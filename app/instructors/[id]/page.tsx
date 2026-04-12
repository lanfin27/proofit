import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getInstructor, getCourses } from '@/lib/data'
import CategoryIcon from '@/components/CategoryIcon'
import InstructorDetailClient from '@/components/InstructorDetailClient'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const instructor = await getInstructor(params.id)

  if (!instructor) {
    return { title: '강사를 찾을 수 없습니다 | Proofit' }
  }

  const categories = instructor.categories.join(', ')
  const platforms = instructor.platforms.join(', ')
  const priceRange =
    instructor.price_min !== null && instructor.price_max !== null
      ? `${instructor.price_min.toLocaleString('ko-KR')}원~${instructor.price_max.toLocaleString('ko-KR')}원`
      : ''

  const description = [
    categories ? `${categories} 강의` : '',
    platforms,
    priceRange,
    instructor.verification_count
      ? `${instructor.verification_count}명이 수익 확인을 요청했습니다`
      : '',
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    title: `${instructor.display_name} | 강의 비교 & 수익확인 현황 | Proofit`,
    description,
    openGraph: {
      title: `${instructor.display_name} | 강의 비교 & 수익확인 현황 | Proofit`,
      description,
    },
  }
}

export default async function InstructorDetailPage({ params }: PageProps) {
  const [instructor, courses] = await Promise.all([
    getInstructor(params.id),
    getCourses(params.id),
  ])

  if (!instructor) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-16">
      <div className="max-w-3xl">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <CategoryIcon categories={instructor.categories} size="lg" />
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
                {instructor.display_name}
              </h1>
              {instructor.is_verified && (
                <span className="text-xs font-medium text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.5 rounded">
                  확인
                </span>
              )}
            </div>

            <div className="mt-1.5 text-sm text-[#8B95A1]">
              {instructor.categories.join(' · ')}
              <span className="mx-1.5 text-[#D1D6DB]">·</span>
              {instructor.platforms.join(' · ')}
            </div>
          </div>
        </div>

        <InstructorDetailClient instructor={instructor} courses={courses} />
      </div>
    </div>
  )
}
