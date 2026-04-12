'use client'

import { useState, useEffect } from 'react'
import { InstructorSummary, Course } from '@/lib/types'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import VerifyButton from '@/components/VerifyButton'
import InstructorApplicationModal from '@/components/InstructorApplicationModal'
import { trackEvent } from '@/lib/analytics'
import { CONTACT_EMAIL } from '@/lib/constants'

interface Props {
  instructor: InstructorSummary
  courses: Course[]
}

function formatSummaryLine(instructor: InstructorSummary): string | null {
  if (instructor.course_count === 0) return null
  const parts: string[] = [`강의 ${instructor.course_count}개`]
  if (instructor.price_avg !== null) {
    if (instructor.course_count === 1) {
      parts.push(`${instructor.price_avg.toLocaleString('ko-KR')}원`)
    } else {
      parts.push(`평균 ${instructor.price_avg.toLocaleString('ko-KR')}원`)
    }
  }
  if (
    instructor.course_count > 1 &&
    instructor.price_min !== null &&
    instructor.price_max !== null &&
    instructor.price_min !== instructor.price_max
  ) {
    parts.push(
      `${instructor.price_min.toLocaleString('ko-KR')}원 ~ ${instructor.price_max.toLocaleString('ko-KR')}원`
    )
  }
  return parts.join(' · ')
}

function isSafeUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}

function formatPrice(price: number): string {
  if (price === 0) return '무료'
  return `${price.toLocaleString('ko-KR')}원`
}

export default function InstructorDetailClient({ instructor, courses }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAppModalOpen, setIsAppModalOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  const channelLinks: { label: string; url: string; icon: React.ReactNode }[] = []

  if (instructor.youtube_url && isSafeUrl(instructor.youtube_url)) {
    channelLinks.push({
      label: 'YouTube',
      url: instructor.youtube_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    })
  }
  if (instructor.instagram_url && isSafeUrl(instructor.instagram_url)) {
    channelLinks.push({
      label: 'Instagram',
      url: instructor.instagram_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    })
  }
  if (instructor.thread_url && isSafeUrl(instructor.thread_url)) {
    channelLinks.push({
      label: 'Threads',
      url: instructor.thread_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.104-1.14 3.447-1.17.985-.023 1.905.112 2.744.392.01-.62-.04-1.2-.157-1.725-.267-1.183-.828-1.748-1.667-1.748l-.084.002c-.56.02-1.03.253-1.362.677-.318.403-.484.957-.493 1.646l-2.043-.034c.018-1.2.37-2.163 1.048-2.862.715-.738 1.678-1.138 2.786-1.16l.132-.002c1.5 0 2.638.665 3.274 1.912.492.965.65 2.18.476 3.712l-.007.056c.938.607 1.668 1.408 2.122 2.36.744 1.556.788 4.156-1.206 6.107-1.774 1.737-3.964 2.489-7.099 2.511zm-1.288-6.093c-.038 0-.076 0-.115.002-.93.04-1.643.316-2.065.8-.372.43-.532.977-.503 1.542.042.766.452 1.419 1.155 1.838.627.375 1.438.558 2.34.506 1.12-.06 1.98-.466 2.557-1.2.483-.617.806-1.456.959-2.493-.862-.378-1.89-.597-3.054-.597l-.274.002z" />
        </svg>
      ),
    })
  }

  return (
    <>
      {/* Channel Links */}
      {channelLinks.length > 0 && (
        <div className="flex gap-3 mt-5">
          {isLoggedIn ? (
            channelLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} 새 탭에서 열기`}
                className="text-[#8B95A1] hover:text-[#191F28] transition-colors duration-150"
                onClick={() =>
                  trackEvent('channel_link_click', {
                    instructor_id: instructor.id,
                    channel: link.label,
                  })
                }
              >
                {link.icon}
              </a>
            ))
          ) : (
            <div className="flex gap-3 blur-[5px] select-none" aria-hidden="true">
              {channelLinks.map((link) => (
                <span key={link.label} className="text-[#8B95A1]">
                  {link.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 수익확인 현황 */}
      {instructor.is_verified &&
        instructor.verification_documents &&
        instructor.verification_documents.length > 0 && (
          <div className="border border-[#E8F3FF] bg-[#F5FAFF] rounded-xl p-5 mt-6">
            <p className="text-[#3182F6] font-semibold text-sm">
              ✓ 수익확인 강사
            </p>
            <p className="text-xs text-[#8B95A1] mt-1 mb-4">
              공인회계사 검증팀이 아래 서류를 직접 확인했습니다.
            </p>
            <ul className="space-y-2">
              {instructor.verification_documents.map((doc) => (
                <li key={doc} className="flex items-center gap-2">
                  <span className="text-[#3182F6] text-xs font-bold">✓</span>
                  <span className="text-sm text-[#191F28]">{doc}</span>
                </li>
              ))}
            </ul>
            {instructor.verified_at && (
              <p className="text-xs text-[#B0B8C1] mt-4">
                최종 확인일:{' '}
                {new Date(instructor.verified_at).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
        )}

      {/* Summary line */}
      {(() => {
        const summary = formatSummaryLine(instructor)
        if (!summary) return null
        return (
          <div className="mt-8">
            {isLoggedIn ? (
              <p className="text-sm text-[#4E5968] tabular-nums">{summary}</p>
            ) : (
              <p className="text-sm text-[#8B95A1]">
                강의 {instructor.course_count}개 · 가격은 로그인 후 확인
              </p>
            )}
          </div>
        )
      })()}

      {/* Courses */}
      <div className="mt-10">
        <h2 className="text-base font-semibold text-[#191F28] mb-3">강의 목록</h2>
        {courses.length > 0 ? (
          <div className="flex flex-col gap-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-3 bg-[#F2F4F6] rounded-xl p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#191F28] truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-[#8B95A1] mt-1">
                    {course.category ? `${course.category} · ` : ''}
                    {course.platform}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  {isLoggedIn ? (
                    <span className="text-sm font-semibold text-[#191F28] tabular-nums">
                      {formatPrice(course.price)}
                    </span>
                  ) : (
                    <span
                      className="text-sm font-semibold text-[#191F28] tabular-nums blur-[5px] select-none"
                      aria-hidden="true"
                    >
                      000,000원
                    </span>
                  )}
                  {isLoggedIn && isSafeUrl(course.url) ? (
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="새 탭에서 열기"
                      className="text-sm text-[#8B95A1] hover:text-[#191F28] transition-colors duration-150"
                      onClick={() =>
                        trackEvent('course_link_click', {
                          instructor_id: instructor.id,
                          platform: course.platform,
                          url: course.url,
                        })
                      }
                    >
                      보러가기 →
                    </a>
                  ) : !isLoggedIn ? (
                    <span className="text-sm text-[#B0B8C1] blur-[4px] select-none">
                      보러가기 →
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 border-t border-[#E5E8EB]">
            <p className="text-sm text-[#4E5968]">등록된 강의 정보가 아직 없습니다</p>
            <p className="text-sm text-[#8B95A1] mt-1">
              정보를 알고 계시면{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#191F28] underline underline-offset-2"
              >
                이메일로 알려주세요
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Verification Request Section */}
      <div className="border-t border-[#E5E8EB] pt-8 mt-8">
        <div>
          <span
            className={`text-3xl md:text-4xl font-extrabold tabular-nums ${
              (instructor.verification_count ?? 0) >= 50
                ? 'text-[#F04452]'
                : 'text-[#191F28]'
            }`}
          >
            {(instructor.verification_count ?? 0).toLocaleString('ko-KR')}
          </span>
          <span className="text-sm text-[#8B95A1] ml-1.5">
            명이 확인을 요청했습니다
          </span>
        </div>
        <div className="mt-5">
          <VerifyButton
            instructorId={instructor.id}
            initialCount={instructor.verification_count ?? 0}
            isVerified={instructor.is_verified}
            fullWidth
          />
        </div>
      </div>

      {/* 강사 본인 CTA */}
      <div className="bg-[#F2F4F6] rounded-2xl p-6 mt-12">
        <p className="text-base font-bold text-[#191F28]">본인이신가요?</p>
        <p className="text-sm text-[#4E5968] mt-1 leading-relaxed">
          수익확인을 통해 수강생에게 신뢰를 보여주세요. 현재 무료로 진행
          중입니다.
        </p>
        <button
          onClick={() => setIsAppModalOpen(true)}
          className="inline-block mt-3 text-sm font-semibold text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150 focus:outline-none"
        >
          수익확인 신청하기 →
        </button>
        <p className="text-xs text-[#8B95A1] mt-4">
          정보가 잘못되었나요?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=정보 수정 요청 - ${instructor.display_name}`}
            className="text-[#4E5968] underline underline-offset-2 hover:text-[#191F28]"
          >
            수정 요청
          </a>
        </p>
      </div>

      <InstructorApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
      />

      {/* 강사 정보 업데이트 일자 */}
      {instructor.info_updated_at && (
        <p className="text-[11px] text-[#B0B8C1] mt-8 text-center">
          강사 정보 업데이트:{' '}
          {new Date(instructor.info_updated_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
    </>
  )
}
