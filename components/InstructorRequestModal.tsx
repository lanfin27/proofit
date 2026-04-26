'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { sendGAEvent } from '@/lib/analytics'

interface InstructorRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\/.+/i.test(url)
}

export default function InstructorRequestModal({
  isOpen,
  onClose,
}: InstructorRequestModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()
  const [instructorName, setInstructorName] = useState('')
  const [courseUrl, setCourseUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({})
  // Tracks client-side mount so the portal target (document.body)
  // is only accessed after hydration. Without this guard SSR would
  // try to render into an element that does not exist server-side.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    if (!isOpen) {
      setInstructorName('')
      setCourseUrl('')
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const next: { name?: string; url?: string } = {}
    const trimmedName = instructorName.trim()
    const trimmedUrl = courseUrl.trim()

    if (trimmedName.length < 2) {
      next.name = '강사명을 2글자 이상 입력해주세요'
    }
    if (!trimmedUrl) {
      next.url = '강의 링크를 입력해주세요'
    } else if (!isSafeUrl(trimmedUrl)) {
      next.url = '올바른 링크를 입력해주세요 (http:// 또는 https://)'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    if (!isSupabaseConfigured()) {
      showToast('서비스 준비 중입니다', 'info')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      showToast('로그인이 필요합니다', 'error')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from('instructor_requests').insert({
      user_id: user.id,
      user_email:
        user.email ??
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        '알 수 없음',
      instructor_name: instructorName.trim(),
      course_url: courseUrl.trim(),
    })

    setIsSubmitting(false)

    if (error) {
      showToast('다시 시도해주세요', 'error')
      return
    }

    sendGAEvent('student_request_submit', { instructor_name: instructorName.trim() })
    showToast('요청이 접수되었습니다', 'success')
    onClose()
  }

  if (!isOpen || !mounted) return null

  const isFormInvalid =
    !!errors.name ||
    !!errors.url ||
    instructorName.trim().length < 2 ||
    !isSafeUrl(courseUrl.trim())

  // Render through a portal anchored to <body>. Without this, the
  // modal sits inside whatever scoped wrapper its trigger lives under
  // (e.g. .report-page on /reports/[slug]) and inherits that
  // wrapper's global * { margin: 0; padding: 0 } reset, which strips
  // every Tailwind p-* / mt-* class inside the modal and collapses
  // the layout. Anchoring at document.body keeps the modal outside
  // any page-scoped resets, so the same component renders correctly
  // from every trigger surface.
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 max-w-sm w-full relative"
        role="dialog"
        aria-modal="true"
        aria-label="강사 확인 요청"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#B0B8C1] hover:text-[#4E5968] transition-colors duration-150 focus:outline-none rounded-lg"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-[#191F28] mt-2">강사 확인 요청</h2>
        <p className="text-sm text-[#8B95A1] mt-1">
          확인하고 싶은 강사 정보를 알려주세요
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="instructor-name"
              className="text-sm font-medium text-[#4E5968]"
            >
              강사명
            </label>
            <input
              id="instructor-name"
              type="text"
              placeholder="강사 활동명 또는 채널명"
              value={instructorName}
              onChange={(e) => {
                setInstructorName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
              }}
              className="mt-1 w-full h-11 px-3 border border-[#E5E8EB] rounded-xl text-sm text-[#191F28] focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6]"
              maxLength={80}
            />
            {errors.name && (
              <p className="text-xs text-[#F04452] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="course-url"
              className="text-sm font-medium text-[#4E5968]"
            >
              강의 링크
            </label>
            <input
              id="course-url"
              type="url"
              placeholder="https://class101.net/... 또는 유튜브 링크"
              value={courseUrl}
              onChange={(e) => {
                setCourseUrl(e.target.value)
                if (errors.url) setErrors((p) => ({ ...p, url: undefined }))
              }}
              className={`mt-1 w-full h-11 px-3 border rounded-xl text-sm text-[#191F28] focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] ${
                (errors.url || (courseUrl.trim() && !isSafeUrl(courseUrl.trim())))
                  ? 'border-[#F04452]'
                  : 'border-[#E5E8EB]'
              }`}
              maxLength={500}
            />
            {errors.url ? (
              <p className="text-xs text-[#F04452] mt-1">{errors.url}</p>
            ) : (
              courseUrl.trim() &&
              !isSafeUrl(courseUrl.trim()) && (
                <p className="text-xs text-[#F04452] mt-1">
                  올바른 링크 형식으로 입력해주세요 (예: https://...)
                </p>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className="w-full h-12 bg-[#3182F6] text-white font-semibold rounded-xl hover:bg-[#1B64DA] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : '요청하기'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
