import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getInstructors, getFilterOptions } from '@/lib/data'
import FilterBar from '@/components/FilterBar'
import InstructorList from '@/components/InstructorList'
import SearchBar from '@/components/SearchBar'
import InstructorRequestTrigger from '@/components/InstructorRequestTrigger'
import { CONTACT_EMAIL } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  searchParams: {
    mainCategory?: string
    category?: string
    platform?: string
    sort?: string
    q?: string
  }
}

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

async function requireAuthOrRedirect() {
  // Supabase 미설정(mock 모드)이면 게이트 비활성화
  if (!isSupabaseConfigured()) return

  let hasUser = false
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    hasUser = !!user
  } catch (e) {
    // Auth 체크 자체가 실패(네트워크 등)하면 접근 허용 — 사용자 경험 우선
    console.error('Auth check error:', e)
    return
  }

  if (!hasUser) {
    redirect('/?login=instructors')
  }
}

export default async function InstructorsPage({ searchParams }: PageProps) {
  await requireAuthOrRedirect()

  const q = searchParams.q?.trim() ?? ''

  const [instructors, filterOptions] = await Promise.all([
    getInstructors({
      mainCategory: searchParams.mainCategory,
      category: searchParams.category,
      platform: searchParams.platform,
      sort: searchParams.sort,
      q,
    }),
    getFilterOptions(),
  ])

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>

        <Suspense fallback={null}>
          <FilterBar
            mainCategories={filterOptions.mainCategories}
            categories={filterOptions.categories}
            mainToSub={filterOptions.mainToSub}
          />
        </Suspense>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {instructors.length > 0 ? (
          <>
            <InstructorList instructors={instructors} />
            <InstructorRequestTrigger />
          </>
        ) : q ? (
          <div className="text-center py-20">
            <p className="text-base text-[#4E5968]">
              &ldquo;<span className="font-semibold text-[#191F28]">{q}</span>
              &rdquo;에 해당하는 강사가 없습니다
            </p>
            <Link
              href="/instructors"
              className="inline-block mt-3 text-sm font-medium text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150"
            >
              전체 강사 보기 →
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-base font-semibold text-[#191F28]">
              해당 조건의 강사가 없습니다
            </p>
            <p className="text-sm text-[#8B95A1] mt-2">
              다른 분야를 선택해보세요
            </p>
            <p className="text-sm text-[#8B95A1] mt-6">
              찾는 강사가 없나요?{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#3182F6] font-medium underline underline-offset-2"
              >
                이메일로 알려주세요
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
