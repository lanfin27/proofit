'use client'

import Link from 'next/link'
import { InstructorSummary } from '@/lib/types'
import { useLoginModal } from '@/components/LoginModalProvider'
import CyclingBadge from '@/components/CyclingBadge'
import { sendGAEvent } from '@/lib/analytics'

interface InstructorCardProps {
  instructor: InstructorSummary
  isLoggedIn: boolean
  /**
   * If true, clicking the card while not logged in opens the login modal
   * (instead of navigating to the detail page).
   */
  requireLoginOnClick?: boolean
}

function formatPrice(instructor: InstructorSummary, isLoggedIn: boolean): string {
  if (instructor.course_count === 0) return '가격 정보 없음'
  if (!isLoggedIn) return '●●●,●●●원'

  if (instructor.course_count === 1) {
    return `${instructor.price_avg?.toLocaleString('ko-KR') ?? '—'}원`
  }

  return `평균 ${instructor.price_avg?.toLocaleString('ko-KR') ?? '—'}원`
}

function formatPriceRange(instructor: InstructorSummary): string | null {
  if (
    instructor.course_count <= 1 ||
    instructor.price_min === null ||
    instructor.price_max === null ||
    instructor.price_min === instructor.price_max
  ) {
    return null
  }
  return `${instructor.price_min.toLocaleString('ko-KR')}원 ~ ${instructor.price_max.toLocaleString('ko-KR')}원`
}

export default function InstructorCard({
  instructor,
  isLoggedIn,
  requireLoginOnClick = false,
}: InstructorCardProps) {
  const { openLoginModal } = useLoginModal()
  const isVerified = instructor.is_verified
  const priceRange = isLoggedIn ? formatPriceRange(instructor) : null
  const priceText = formatPrice(instructor, isLoggedIn)
  const href = `/instructors/${instructor.id}`

  // 랜딩(로그인 게이트 컨텍스트)에서 비로그인이면 수익확인 뱃지를 블러 처리
  const hideVerification = requireLoginOnClick && !isLoggedIn

  // 수익확인 강사: 연파랑 배경 / 일반: 연회색 배경
  const cardBg = isVerified
    ? 'bg-[#E8F3FF] hover:bg-[#D4E8FF]'
    : 'bg-[#F2F4F6] hover:bg-[#E5E8EB]'

  const cardClass = `block ${cardBg} rounded-2xl p-5 transition-colors duration-150`

  const handleClick = (e: React.MouseEvent) => {
    sendGAEvent('instructor_card_click', {
      instructor_name: instructor.display_name,
      category: instructor.categories[0] ?? '',
    })
    if (requireLoginOnClick && !isLoggedIn) {
      e.preventDefault()
      openLoginModal(href)
    }
  }

  const content = (
    <>
      {/* 상단: 강사명 + 수익확인 뱃지 */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[#191F28] truncate">
            {instructor.display_name}
          </span>
          {hideVerification ? (
            <CyclingBadge />
          ) : (
            isVerified && (
              <span className="shrink-0 text-xs font-medium text-[#3182F6] bg-white px-1.5 py-0.5 rounded">
                확인
              </span>
            )
          )}
        </div>
        {/* 카테고리 — 통일된 파란색 */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {(instructor.categories ?? []).map((cat) => (
            <span
              key={cat}
              className="text-[11px] px-1.5 py-0.5 rounded bg-[#E8F3FF] text-[#3182F6] font-medium leading-none"
            >
              {cat}
            </span>
          ))}
        </div>
        {/* 플랫폼 — 회색 작은 텍스트 */}
        <p className="text-[11px] text-[#B0B8C1] mt-1 truncate">
          {(instructor.platforms ?? []).join(' · ')}
        </p>
      </div>

      {/* 하단: 가격 + 강의수 + 요청수 */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`text-lg font-bold tabular-nums truncate ${
              isLoggedIn ? 'text-[#191F28]' : 'text-[#B0B8C1]'
            }`}
          >
            {priceText}
          </p>
          {priceRange && (
            <p className="text-xs text-[#B0B8C1] tabular-nums mt-0.5 truncate">
              {priceRange}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[#8B95A1] tabular-nums">
            {instructor.course_count > 0
              ? `${instructor.course_count}개 강의`
              : '강의 없음'}
          </p>
          <p
            className={`text-xs tabular-nums mt-0.5 ${
              instructor.verification_count > 0
                ? 'font-medium text-[#4E5968]'
                : 'text-[#8B95A1]'
            }`}
          >
            <span
              className={
                instructor.verification_count > 0
                  ? 'text-[#3182F6] font-semibold'
                  : ''
              }
            >
              {instructor.verification_count}명
            </span>{' '}
            수익확인 요청
          </p>
        </div>
      </div>
    </>
  )

  return (
    <Link href={href} className={cardClass} onClick={handleClick}>
      {content}
    </Link>
  )
}
