import Image from 'next/image'
import Link from 'next/link'
import { getReportInstructorBySupabaseId } from '@/lib/instructor-mapping'
import { getReport } from '@/lib/report-data'
import { CONTACT_EMAIL } from '@/lib/constants'
import type { InstructorSummary, Course } from '@/lib/types'

type Props = {
  instructor: InstructorSummary
  courses: Course[]
}

function isSafeUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}

function formatKoreanDate(iso: string): string {
  return iso.slice(0, 10).replaceAll('-', '.')
}

function formatPrice(price: number): string {
  if (price === 0) return '무료'
  return `${price.toLocaleString('ko-KR')}원`
}

export default function ProfilePageV2({ instructor, courses }: Props) {
  const reportInstructor = getReportInstructorBySupabaseId(instructor.id)
  if (!reportInstructor) return null

  const isPublished = reportInstructor.status === 'published'
  const report = getReport(reportInstructor.slug)
  const heroNumber = isPublished ? report?.hero.cumulativeAdRevenue : null
  const showReportShowcase = isPublished

  // This file is a server component and only reads scalar fields
  // (slug, name, status, profileImage, subject, tags) off
  // reportInstructor — privateSlug is never referenced, so it cannot
  // cross into client output.

  return (
    <div className="profile-page">
      <div className="app">
        <div className={`hero${showReportShowcase ? '' : ' hero--no-report'}`}>
          <div className="profile-head">
            <div className="profile-avatar">
              {reportInstructor.profileImage ? (
                <Image
                  src={reportInstructor.profileImage}
                  alt={instructor.display_name}
                  width={64}
                  height={64}
                  priority
                />
              ) : (
                <span>{reportInstructor.initial}</span>
              )}
            </div>
            <div className="profile-meta">
              <div className="name-row">
                <div className="profile-name">{instructor.display_name}</div>
                {isPublished && (
                  <span className="inline-badge">수익확인 완료</span>
                )}
              </div>
              <div className="profile-subject">{reportInstructor.subject}</div>
            </div>
          </div>

          <div className="badges">
            {reportInstructor.tags.map((tag) => (
              <span key={tag} className="badge tag">
                {tag}
              </span>
            ))}
          </div>

          {heroNumber && (
            <div className="hero-number">
              <div className="label">{heroNumber.label}</div>
              <div className="value">
                {heroNumber.valueNumber}
                <span className="unit">{heroNumber.valueUnit}</span>
              </div>
              <div className="sub">{heroNumber.sub}</div>
            </div>
          )}

          {isPublished && (
            <Link
              href={`/reports/${reportInstructor.slug}`}
              className="report-cta"
            >
              <div className="label">수익확인 리포트 전체 보기</div>
              <div className="arrow">→</div>
            </Link>
          )}
        </div>

        {courses.length > 0 && (
          <div className="sec">
            <h2>이 강사의 강의</h2>
            <div className="sec-sub">강의 {courses.length}개</div>
            <div className="course-list">
              {courses.map((course) => {
                const linkable = isSafeUrl(course.url)
                const inner = (
                  <>
                    <div className="course-title">{course.title}</div>
                    <div className="course-foot">
                      <div className="course-meta">{course.platform}</div>
                      <div className="course-action">
                        <span className="course-price">
                          {formatPrice(course.price)}
                        </span>
                        {linkable && (
                          <span className="course-link">보러가기 →</span>
                        )}
                      </div>
                    </div>
                  </>
                )
                return linkable ? (
                  <a
                    key={course.id}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="course-item"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={course.id} className="course-item">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="foot">
          <div>
            {instructor.info_updated_at
              ? `강사 정보 업데이트: ${formatKoreanDate(instructor.info_updated_at)}`
              : ''}
          </div>
          <a
            className="edit-link"
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              `정보 수정 요청 - ${instructor.display_name}`
            )}`}
          >
            정보가 잘못되었나요? <u>수정 요청</u>
          </a>
        </div>
      </div>
    </div>
  )
}
