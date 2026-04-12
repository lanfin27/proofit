import { InstructorSummary, Course } from '@/lib/types'
import { mockInstructors, mockCourses } from '@/lib/mock-data'
import { FALLBACK_CATEGORIES, FALLBACK_PLATFORMS } from '@/lib/constants'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('PLACEHOLDER') &&
    !key.includes('PLACEHOLDER') &&
    url.length > 0 &&
    key.length > 0
  )
}

async function getSupabaseServer() {
  const { createClient } = await import('@/lib/supabase/server')
  return createClient()
}

type RawInstructor = {
  id: string
  display_name: string
  main_categories: string[] | null
  categories: string[]
  platforms: string[]
  price_min: number | null
  price_max: number | null
  youtube_url: string | null
  instagram_url: string | null
  thread_url: string | null
  is_verified: boolean
  verified_at: string | null
  verification_documents: string[] | null
  info_updated_at: string | null
  created_at: string
}

function toSummaryFallback(raw: RawInstructor): InstructorSummary {
  return {
    ...raw,
    main_categories: raw.main_categories ?? [],
    verification_documents: raw.verification_documents ?? [],
    info_updated_at: raw.info_updated_at ?? null,
    course_count: 0,
    price_avg: null,
    verification_count: 0,
  }
}

export async function getInstructors(params?: {
  mainCategory?: string
  category?: string
  platform?: string
  sort?: string
  q?: string
}): Promise<InstructorSummary[]> {
  if (!isSupabaseConfigured()) {
    return applyFilters(mockInstructors, params)
  }

  // ilike 값에 사용되는 %, _, \를 이스케이프
  const escapeLike = (value: string): string =>
    value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')

  try {
    const supabase = await getSupabaseServer()

    // 1차: instructor_summary View 시도
    let query = supabase.from('instructor_summary').select('*')

    if (params?.mainCategory && params.mainCategory !== '전체') {
      query = query.contains('main_categories', [params.mainCategory])
    }
    if (params?.category && params.category !== '전체') {
      query = query.contains('categories', [params.category])
    }
    if (params?.platform && params.platform !== '전체') {
      query = query.contains('platforms', [params.platform])
    }
    if (params?.q && params.q.trim().length > 0) {
      query = query.ilike('display_name', `%${escapeLike(params.q.trim())}%`)
    }

    if (params?.sort === 'price_asc') {
      query = query.order('price_avg', { ascending: true, nullsFirst: false })
    } else if (params?.sort === 'price_desc') {
      query = query.order('price_avg', { ascending: false, nullsFirst: false })
    } else {
      query = query.order('verification_count', { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      // View는 info_updated_at을 포함하지 않을 수 있으므로 instructors 테이블에서 보충
      const rows = data as InstructorSummary[]
      const missingInfoDate = rows.some(
        (r) => r.info_updated_at === undefined || r.info_updated_at === null
      )
      if (missingInfoDate && rows.length > 0) {
        const { data: dateRows } = await supabase
          .from('instructors')
          .select('id, info_updated_at')
          .in(
            'id',
            rows.map((r) => r.id)
          )
        if (dateRows) {
          const dateMap = new Map<string, string | null>(
            (dateRows as Array<{ id: string; info_updated_at: string | null }>).map(
              (r) => [r.id, r.info_updated_at]
            )
          )
          for (const row of rows) {
            if (!row.info_updated_at) {
              row.info_updated_at = dateMap.get(row.id) ?? null
            }
          }
        }
      }
      return rows
    }

    if (error) {
      console.error('instructor_summary view error:', error.message)
    }

    // 2차 Fallback: instructors 테이블 직접 조회
    let fallbackQuery = supabase.from('instructors').select('*')

    if (params?.mainCategory && params.mainCategory !== '전체') {
      fallbackQuery = fallbackQuery.contains('main_categories', [
        params.mainCategory,
      ])
    }
    if (params?.category && params.category !== '전체') {
      fallbackQuery = fallbackQuery.contains('categories', [params.category])
    }
    if (params?.platform && params.platform !== '전체') {
      fallbackQuery = fallbackQuery.contains('platforms', [params.platform])
    }
    if (params?.q && params.q.trim().length > 0) {
      fallbackQuery = fallbackQuery.ilike(
        'display_name',
        `%${escapeLike(params.q.trim())}%`
      )
    }

    const { data: fallbackData, error: fallbackError } = await fallbackQuery

    if (fallbackError || !fallbackData) {
      console.error('instructors table error:', fallbackError?.message)
      return applyFilters(mockInstructors, params)
    }

    // verification_requests count 조회
    const { data: counts } = await supabase
      .from('verification_requests')
      .select('instructor_id')

    const countMap: Record<string, number> = {}
    ;(counts ?? []).forEach((row: { instructor_id: string }) => {
      countMap[row.instructor_id] = (countMap[row.instructor_id] ?? 0) + 1
    })

    // courses 전체 조회 후 강사별로 집계
    const { data: allCourses } = await supabase
      .from('courses')
      .select('instructor_id, price')

    const courseStatsMap: Record<
      string,
      { count: number; min: number; max: number; sum: number }
    > = {}
    ;(allCourses ?? []).forEach((c: { instructor_id: string; price: number }) => {
      const stats = courseStatsMap[c.instructor_id] ?? {
        count: 0,
        min: Infinity,
        max: -Infinity,
        sum: 0,
      }
      stats.count += 1
      if (c.price < stats.min) stats.min = c.price
      if (c.price > stats.max) stats.max = c.price
      stats.sum += c.price
      courseStatsMap[c.instructor_id] = stats
    })

    const summaries: InstructorSummary[] = (fallbackData as RawInstructor[]).map(
      (raw) => {
        const stats = courseStatsMap[raw.id]
        return {
          ...toSummaryFallback(raw),
          course_count: stats?.count ?? 0,
          price_min: stats ? stats.min : raw.price_min,
          price_max: stats ? stats.max : raw.price_max,
          price_avg: stats ? Math.round(stats.sum / stats.count) : null,
          verification_count: countMap[raw.id] ?? 0,
        }
      }
    )

    return applySort(summaries, params?.sort)
  } catch (e) {
    console.error('Connection error:', e)
    return applyFilters(mockInstructors, params)
  }
}

export async function getInstructor(id: string): Promise<InstructorSummary | null> {
  if (!isSupabaseConfigured()) {
    return mockInstructors.find((i) => i.id === id) ?? null
  }

  try {
    const supabase = await getSupabaseServer()

    // 1차: instructor_summary View 시도
    const { data, error } = await supabase
      .from('instructor_summary')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!error && data) {
      const summary = data as InstructorSummary
      // View에 info_updated_at이 없을 경우 instructors 테이블에서 보충
      if (!summary.info_updated_at) {
        const { data: dateRow } = await supabase
          .from('instructors')
          .select('info_updated_at')
          .eq('id', id)
          .maybeSingle()
        if (dateRow) {
          summary.info_updated_at =
            (dateRow as { info_updated_at: string | null }).info_updated_at ??
            null
        }
      }
      return summary
    }

    if (error) {
      console.error('instructor_summary view error:', error.message)
    }

    // 2차 Fallback: instructors 테이블 직접 조회
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fallbackError || !fallbackData) {
      return mockInstructors.find((i) => i.id === id) ?? null
    }

    const { count } = await supabase
      .from('verification_requests')
      .select('*', { count: 'exact', head: true })
      .eq('instructor_id', id)

    // courses 집계
    const { data: instructorCourses } = await supabase
      .from('courses')
      .select('price')
      .eq('instructor_id', id)

    const prices = (instructorCourses ?? []).map(
      (c: { price: number }) => c.price
    )

    return {
      ...toSummaryFallback(fallbackData as RawInstructor),
      course_count: prices.length,
      price_min: prices.length > 0 ? Math.min(...prices) : (fallbackData as RawInstructor).price_min,
      price_max: prices.length > 0 ? Math.max(...prices) : (fallbackData as RawInstructor).price_max,
      price_avg:
        prices.length > 0
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : null,
      verification_count: count ?? 0,
    }
  } catch (e) {
    console.error('Connection error:', e)
    return mockInstructors.find((i) => i.id === id) ?? null
  }
}

export async function getCourses(instructorId: string): Promise<Course[]> {
  if (!isSupabaseConfigured()) {
    return mockCourses.filter((c) => c.instructor_id === instructorId)
  }

  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('price', { ascending: true })

    if (error) {
      console.error('Supabase error:', error.message)
      return mockCourses.filter((c) => c.instructor_id === instructorId)
    }
    return data ?? []
  } catch (e) {
    console.error('Connection error:', e)
    return mockCourses.filter((c) => c.instructor_id === instructorId)
  }
}

export async function getFilterOptions(): Promise<{
  mainCategories: string[]
  categories: string[]
  platforms: string[]
  /** main_category → sub categories 매핑 (DB 기반) */
  mainToSub: Record<string, string[]>
}> {
  function buildMainToSub(
    rows: Array<{
      main_categories: string[]
      categories: string[]
    }>
  ): Record<string, string[]> {
    const map: Record<string, Set<string>> = {}
    for (const row of rows) {
      for (const mc of row.main_categories) {
        if (!mc) continue
        if (!map[mc]) map[mc] = new Set()
        for (const c of row.categories) {
          if (c) map[mc].add(c)
        }
      }
    }
    const result: Record<string, string[]> = {}
    for (const [mc, set] of Object.entries(map)) {
      result[mc] = Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'))
    }
    return result
  }

  const mockMapping = buildMainToSub(
    mockInstructors.map((i) => ({
      main_categories: i.main_categories,
      categories: i.categories,
    }))
  )

  const fallback = {
    mainCategories: Array.from(
      new Set(mockInstructors.flatMap((i) => i.main_categories))
    ).sort((a, b) => a.localeCompare(b, 'ko')),
    categories: Array.from(
      new Set(mockInstructors.flatMap((i) => i.categories))
    ).sort((a, b) => a.localeCompare(b, 'ko')),
    platforms: Array.from(
      new Set(mockInstructors.flatMap((i) => i.platforms))
    ).sort((a, b) => a.localeCompare(b, 'ko')),
    mainToSub: mockMapping,
  }

  if (!isSupabaseConfigured()) {
    return fallback.categories.length > 0 || fallback.platforms.length > 0
      ? fallback
      : {
          mainCategories: [],
          categories: FALLBACK_CATEGORIES,
          platforms: FALLBACK_PLATFORMS,
          mainToSub: {},
        }
  }

  try {
    const supabase = await getSupabaseServer()

    // main_categories 컬럼을 직접 시도. 없으면 catch로 넘어가서 categories/platforms만 반환.
    const { data, error } = await supabase
      .from('instructors')
      .select('main_categories, categories, platforms')

    if (error || !data) {
      console.error('filter options error:', error?.message)
      // main_categories 컬럼이 아직 없는 환경에서는 빈 값 반환해도 필터 일부만 비활성화됨
      const { data: basicData } = await supabase
        .from('instructors')
        .select('categories, platforms')
      if (basicData) {
        const catSet = new Set<string>()
        const platSet = new Set<string>()
        for (const row of basicData as Array<{
          categories: string[] | null
          platforms: string[] | null
        }>) {
          for (const c of row.categories ?? []) if (c) catSet.add(c)
          for (const p of row.platforms ?? []) if (p) platSet.add(p)
        }
        return {
          mainCategories: [],
          categories: Array.from(catSet).sort((a, b) => a.localeCompare(b, 'ko')),
          platforms: Array.from(platSet).sort((a, b) => a.localeCompare(b, 'ko')),
          mainToSub: {},
        }
      }
      return fallback
    }

    const mainCategorySet = new Set<string>()
    const categorySet = new Set<string>()
    const platformSet = new Set<string>()

    for (const row of data as Array<{
      main_categories: string[] | null
      categories: string[] | null
      platforms: string[] | null
    }>) {
      for (const mc of row.main_categories ?? []) {
        if (mc) mainCategorySet.add(mc)
      }
      for (const c of row.categories ?? []) {
        if (c) categorySet.add(c)
      }
      for (const p of row.platforms ?? []) {
        if (p) platformSet.add(p)
      }
    }

    const mainCategories = Array.from(mainCategorySet).sort((a, b) =>
      a.localeCompare(b, 'ko')
    )
    const categories = Array.from(categorySet).sort((a, b) =>
      a.localeCompare(b, 'ko')
    )
    const platforms = Array.from(platformSet).sort((a, b) =>
      a.localeCompare(b, 'ko')
    )

    // main → sub 매핑 생성
    const mainToSub = buildMainToSub(
      (data as Array<{
        main_categories: string[] | null
        categories: string[] | null
        platforms: string[] | null
      }>).map((row) => ({
        main_categories: (row.main_categories ?? []).filter(Boolean),
        categories: (row.categories ?? []).filter(Boolean),
      }))
    )

    if (categories.length === 0 && platforms.length === 0) {
      return {
        mainCategories,
        categories: FALLBACK_CATEGORIES,
        platforms: FALLBACK_PLATFORMS,
        mainToSub,
      }
    }

    return { mainCategories, categories, platforms, mainToSub }
  } catch (e) {
    console.error('Connection error:', e)
    return fallback
  }
}

export async function getStats(): Promise<{ instructorCount: number; requestCount: number }> {
  const mockStats = {
    instructorCount: mockInstructors.length,
    requestCount: mockInstructors.reduce(
      (sum, i) => sum + (i.verification_count ?? 0),
      0
    ),
  }

  if (!isSupabaseConfigured()) {
    return mockStats
  }

  try {
    const supabase = await getSupabaseServer()
    const { count: instructorCount, error: iErr } = await supabase
      .from('instructors')
      .select('*', { count: 'exact', head: true })

    if (iErr) {
      console.error('Supabase error:', iErr.message)
      return mockStats
    }

    const { count: requestCount, error: rErr } = await supabase
      .from('verification_requests')
      .select('*', { count: 'exact', head: true })

    if (rErr) {
      return { instructorCount: instructorCount ?? 0, requestCount: 0 }
    }

    return {
      instructorCount: instructorCount ?? 0,
      requestCount: requestCount ?? 0,
    }
  } catch (e) {
    console.error('Connection error:', e)
    return mockStats
  }
}

function applySort(
  instructors: InstructorSummary[],
  sort?: string
): InstructorSummary[] {
  const result = [...instructors]
  if (sort === 'price_asc') {
    result.sort((a, b) => (a.price_avg ?? a.price_min ?? 0) - (b.price_avg ?? b.price_min ?? 0))
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (b.price_avg ?? b.price_max ?? 0) - (a.price_avg ?? a.price_max ?? 0))
  } else {
    result.sort((a, b) => b.verification_count - a.verification_count)
  }
  return result
}

function applyFilters(
  instructors: InstructorSummary[],
  params?: {
    mainCategory?: string
    category?: string
    platform?: string
    sort?: string
    q?: string
  }
): InstructorSummary[] {
  let result = [...instructors]

  if (params?.mainCategory && params.mainCategory !== '전체') {
    result = result.filter((i) =>
      i.main_categories.includes(params.mainCategory!)
    )
  }
  if (params?.category && params.category !== '전체') {
    result = result.filter((i) => i.categories.includes(params.category!))
  }
  if (params?.platform && params.platform !== '전체') {
    result = result.filter((i) => i.platforms.includes(params.platform!))
  }
  if (params?.q && params.q.trim().length > 0) {
    const needle = params.q.trim().toLowerCase()
    result = result.filter((i) =>
      i.display_name.toLowerCase().includes(needle)
    )
  }

  return applySort(result, params?.sort)
}
