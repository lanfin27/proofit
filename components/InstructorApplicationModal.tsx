'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { sendGAEvent } from '@/lib/analytics'

interface InstructorApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InstructorApplicationModal({
  isOpen,
  onClose,
}: InstructorApplicationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()
  const [instructorName, setInstructorName] = useState('')
  const [contact, setContact] = useState('')
  const [courseLink, setCourseLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    contact?: string
  }>({})

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
      setContact('')
      setCourseLink('')
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const next: { name?: string; contact?: string } = {}
    if (instructorName.trim().length < 2) {
      next.name = '활동명을 2글자 이상 입력해주세요'
    }
    if (!contact.trim()) {
      next.contact = '연락처를 입력해주세요'
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

    // 로그인 상태면 user_id/email 캡처, 비로그인이면 null
    let userId: string | null = null
    let userEmail: string | null = null
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
        userEmail =
          user.email ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          null
      }
    } catch {
      // 비로그인 — 무시
    }

    const insertPayload: Record<string, unknown> = {
      instructor_name: instructorName.trim(),
      contact: contact.trim(),
      course_link: courseLink.trim() || '',
    }
    if (userId) insertPayload.user_id = userId
    if (userEmail) insertPayload.user_email = userEmail

    const { error } = await supabase
      .from('instructor_applications')
      .insert(insertPayload)

    setIsSubmitting(false)

    if (error) {
      showToast('신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error')
      return
    }

    sendGAEvent('instructor_apply_submit')
    showToast('신청이 완료되었습니다. 확인 후 연락드리겠습니다.', 'success')
    onClose()
  }

  if (!isOpen) return null

  const isFormInvalid =
    instructorName.trim().length < 2 || !contact.trim()

  return (
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
        aria-label="강사 수익확인 신청"
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

        <h2 className="text-lg font-bold text-[#191F28] mt-2">
          강사 수익확인 신청
        </h2>
        <p className="text-sm text-[#8B95A1] mt-1">
          수익을 확인받고 싶은 강사 정보를 알려주세요
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="app-instructor-name"
              className="text-sm font-medium text-[#4E5968]"
            >
              강사 활동명 <span className="text-[#F04452]">*</span>
            </label>
            <input
              id="app-instructor-name"
              type="text"
              placeholder="활동명 또는 채널명"
              value={instructorName}
              onChange={(e) => {
                setInstructorName(e.target.value)
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
              }}
              className={`mt-1 w-full h-11 px-3 border rounded-xl text-sm text-[#191F28] focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] ${
                errors.name ? 'border-[#F04452]' : 'border-[#E5E8EB]'
              }`}
              maxLength={80}
            />
            {errors.name && (
              <p className="text-xs text-[#F04452] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="app-contact"
              className="text-sm font-medium text-[#4E5968]"
            >
              연락처 <span className="text-[#F04452]">*</span>
            </label>
            <input
              id="app-contact"
              type="text"
              placeholder="이메일 또는 휴대폰 번호"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                if (errors.contact)
                  setErrors((p) => ({ ...p, contact: undefined }))
              }}
              className={`mt-1 w-full h-11 px-3 border rounded-xl text-sm text-[#191F28] focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] ${
                errors.contact ? 'border-[#F04452]' : 'border-[#E5E8EB]'
              }`}
              maxLength={100}
            />
            {errors.contact && (
              <p className="text-xs text-[#F04452] mt-1">{errors.contact}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="app-course-link"
              className="text-sm font-medium text-[#4E5968]"
            >
              강의 링크 <span className="text-[#8B95A1] font-normal">(선택)</span>
            </label>
            <input
              id="app-course-link"
              type="text"
              placeholder="강의 판매 페이지 또는 채널 링크"
              value={courseLink}
              onChange={(e) => setCourseLink(e.target.value)}
              className="mt-1 w-full h-11 px-3 border border-[#E5E8EB] rounded-xl text-sm text-[#191F28] focus:outline-none focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6]"
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className="w-full h-12 bg-[#3182F6] text-white font-semibold rounded-xl hover:bg-[#1B64DA] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '신청 중...' : '신청하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
