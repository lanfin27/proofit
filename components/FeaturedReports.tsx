import Link from 'next/link'
import type { FeaturedInstructor } from '@/lib/report-types'

function daysAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '1일 전'
  return `${diffDays}일 전`
}

function getFeatured(all: FeaturedInstructor[]): FeaturedInstructor[] {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  return all
    .filter(
      (i) =>
        i.status === 'published' &&
        i.publishedAt &&
        new Date(i.publishedAt) >= sevenDaysAgo
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

export default function FeaturedReports({
  instructors,
}: {
  instructors: FeaturedInstructor[]
}) {
  const featured = getFeatured(instructors)

  if (featured.length === 0) return null

  return (
    <section className="py-12 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-extrabold text-toss-gray-900 tracking-[-0.03em]">
            이번 주 새로 공개된 리포트
          </h2>
          <span className="text-[13px] font-medium text-toss-gray-500">
            최근 7일
          </span>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map((instructor) => (
            <Link
              key={instructor.slug}
              href={`/reports/${instructor.slug}`}
              className="block bg-white border border-toss-gray-200 rounded-xl px-[18px] py-4 transition-all duration-150 hover:border-primary hover:-translate-y-px"
              aria-label={`${instructor.name} 리포트 보기, ${daysAgo(instructor.publishedAt)} 공개`}
            >
              {/* Top meta */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold tracking-[0.3px] text-primary-hover bg-primary-light px-[7px] py-0.5 rounded">
                  NEW
                </span>
                <span className="text-[11px] text-toss-gray-500">
                  {daysAgo(instructor.publishedAt)}
                </span>
              </div>

              {/* Name */}
              <div className="text-lg font-extrabold text-toss-gray-900 tracking-[-0.03em] mb-0.5">
                {instructor.name}
              </div>

              {/* Categories */}
              <div className="text-xs text-toss-gray-600 mb-2.5">
                {instructor.categories.map((cat, i) => (
                  <span key={cat}>
                    {i > 0 && (
                      <span className="text-toss-gray-400 mx-0.5">·</span>
                    )}
                    {cat}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <div className="text-[13px] text-toss-gray-800 leading-[1.55] font-medium">
                {instructor.summary}
              </div>

              {/* CTA */}
              <div className="mt-3 text-[13px] font-bold text-primary-hover">
                리포트 보기 &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
