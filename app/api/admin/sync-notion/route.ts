import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { isAdmin } from '@/lib/admin'
import { fetchNotionInstructors, isNotionConfigured } from '@/lib/notion'

interface GroupedInstructor {
  display_name: string
  main_categories: Set<string>
  platforms: Set<string>
  categories: Set<string>
  verification_documents: Set<string>
  courses: Array<{
    title: string
    platform: string
    price: number
    category: string | null
    url: string
  }>
  youtube_url: string | null
  is_verified: boolean
  verified_at: string | null
  info_updated_at: string | null
  notion_ids: string[]
}

export async function POST(request: Request) {
  const authorized = await isAdmin()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'NOTION_API_KEY 또는 NOTION_INSTRUCTOR_DB_ID가 설정되지 않았습니다' },
      { status: 400 }
    )
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  if (serviceKey.includes('PLACEHOLDER') || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다' },
      { status: 400 }
    )
  }

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') ?? 'incremental'

  try {
    const rows = await fetchNotionInstructors()
    if (rows.length === 0) {
      return NextResponse.json({
        synced: 0,
        courses: 0,
        message: '노션에서 가져올 데이터가 없습니다',
      })
    }

    // Step 1: 강사명 기준으로 그룹핑
    const grouped = new Map<string, GroupedInstructor>()

    for (const row of rows) {
      const name = row.display_name.trim()
      if (!name) continue

      let group = grouped.get(name)
      if (!group) {
        group = {
          display_name: name,
          main_categories: new Set<string>(),
          platforms: new Set<string>(),
          categories: new Set<string>(),
          verification_documents: new Set<string>(),
          courses: [],
          youtube_url: null,
          is_verified: false,
          verified_at: null,
          info_updated_at: null,
          notion_ids: [],
        }
        grouped.set(name, group)
      }

      for (const mc of row.main_categories) group.main_categories.add(mc)
      for (const p of row.platforms) group.platforms.add(p)
      for (const c of row.categories) group.categories.add(c)
      for (const d of row.verification_documents) {
        group.verification_documents.add(d)
      }

      if (row.course_title && row.course_price !== null) {
        group.courses.push({
          title: row.course_title,
          platform: row.platforms[0] ?? '기타',
          price: row.course_price,
          category: row.categories[0] ?? null,
          url: row.course_url ?? row.youtube_url ?? '',
        })
      }

      if (row.youtube_url && !group.youtube_url) {
        group.youtube_url = row.youtube_url
      }

      if (row.is_verified) group.is_verified = true

      // 가장 최근의 verified_at 사용
      if (row.verified_at) {
        if (!group.verified_at || row.verified_at > group.verified_at) {
          group.verified_at = row.verified_at
        }
      }

      // 가장 최근의 info_updated_at 사용
      if (row.info_updated_at) {
        if (
          !group.info_updated_at ||
          row.info_updated_at > group.info_updated_at
        ) {
          group.info_updated_at = row.info_updated_at
        }
      }

      group.notion_ids.push(row.notion_id)
    }

    const admin = createAdminClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Step 2: mode=full이면 기존 데이터 전부 삭제
    if (mode === 'full') {
      await admin.from('verification_requests').delete().not('id', 'is', null)
      await admin.from('courses').delete().not('id', 'is', null)
      await admin.from('instructors').delete().not('id', 'is', null)
    }

    // Step 3: 그룹핑된 강사를 순회하며 upsert
    let syncedInstructors = 0
    let syncedCourses = 0
    const errors: string[] = []

    const groupList = Array.from(grouped.values())
    for (const group of groupList) {
      // is_verified는 verification_documents가 비어있지 않아도 true로 간주
      const isVerified =
        group.is_verified || group.verification_documents.size > 0
      // 인증 강사인데 최종 확인일이 노션에 없으면 오늘로 fallback
      const verifiedAt = isVerified
        ? group.verified_at ?? new Date().toISOString()
        : null

      const instructorRow = {
        display_name: group.display_name,
        main_categories: Array.from(group.main_categories),
        platforms: Array.from(group.platforms),
        categories: Array.from(group.categories),
        youtube_url: group.youtube_url,
        is_verified: isVerified,
        verified_at: verifiedAt,
        verification_documents: Array.from(group.verification_documents),
        info_updated_at: group.info_updated_at,
        notion_id: group.notion_ids[0],
      }

      // display_name 기준 upsert
      const { data: upserted, error: upsertError } = await admin
        .from('instructors')
        .upsert(instructorRow, { onConflict: 'display_name' })
        .select('id')
        .single()

      if (upsertError || !upserted) {
        errors.push(`${group.display_name}: ${upsertError?.message ?? 'upsert 실패'}`)
        continue
      }

      syncedInstructors += 1

      // 해당 강사의 기존 courses 전체 삭제 후 재삽입 (idempotent)
      await admin.from('courses').delete().eq('instructor_id', upserted.id)

      if (group.courses.length > 0) {
        const courseRows = group.courses.map((c) => ({
          instructor_id: upserted.id,
          title: c.title,
          platform: c.platform,
          price: c.price,
          url: c.url || `https://proofit.kr/instructors/${upserted.id}`,
          category: c.category,
        }))

        const { error: courseError } = await admin.from('courses').insert(courseRows)
        if (courseError) {
          errors.push(
            `${group.display_name} courses: ${courseError.message}`
          )
        } else {
          syncedCourses += group.courses.length
        }
      }
    }

    // Step 4: 노션에 없는 강사 삭제 (incremental 모드에서도 실행)
    // courses / verification_requests는 ON DELETE CASCADE로 자동 제거됨
    let deletedCount = 0
    const deletedNames: string[] = []
    const syncedNameSet = new Set(grouped.keys())

    try {
      const { data: allInstructors, error: listError } = await admin
        .from('instructors')
        .select('id, display_name')

      if (listError) {
        errors.push(`stale list fetch: ${listError.message}`)
      } else if (allInstructors) {
        const staleRows = allInstructors.filter(
          (row: { id: string; display_name: string }) =>
            !syncedNameSet.has(row.display_name)
        )

        if (staleRows.length > 0) {
          const staleIds = staleRows.map((r) => r.id)
          const { error: deleteError } = await admin
            .from('instructors')
            .delete()
            .in('id', staleIds)

          if (deleteError) {
            errors.push(`stale delete: ${deleteError.message}`)
          } else {
            deletedCount = staleRows.length
            for (const r of staleRows) deletedNames.push(r.display_name)
          }
        }
      }
    } catch (e) {
      errors.push(
        `stale cleanup: ${e instanceof Error ? e.message : 'unknown'}`
      )
    }

    return NextResponse.json({
      synced: syncedInstructors,
      courses: syncedCourses,
      deleted: deletedCount,
      deleted_names: deletedNames.length > 0 ? deletedNames : undefined,
      notion_rows: rows.length,
      groups: grouped.size,
      mode,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (e) {
    console.error('Notion sync error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Sync 실패' },
      { status: 500 }
    )
  }
}
