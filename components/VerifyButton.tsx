'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { useLoginModal } from '@/components/LoginModalProvider'
import { trackEvent } from '@/lib/analytics'

const ADMIN_EMAIL = 'macrohand27@gmail.com'

interface VerifyButtonProps {
  instructorId: string
  initialCount?: number
  isVerified: boolean
  fullWidth?: boolean
}

export default function VerifyButton({
  instructorId,
  isVerified,
  fullWidth = false,
}: VerifyButtonProps) {
  const [hasRequested, setHasRequested] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!isSupabaseConfigured() || isVerified) return

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const admin = user.email === ADMIN_EMAIL
      setIsAdmin(admin)
      // 관리자는 무제한이므로 hasRequested 체크 스킵
      if (admin) return
      supabase
        .from('verification_requests')
        .select('id')
        .eq('instructor_id', instructorId)
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setHasRequested(true)
        })
    })
  }, [instructorId, isVerified])

  const handleClick = useCallback(async () => {
    trackEvent('verify_request_click', { instructor_id: instructorId })

    if (!isSupabaseConfigured()) {
      showToast('서비스 준비 중입니다', 'info')
      return
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      openLoginModal(
        typeof window !== 'undefined' ? window.location.pathname : undefined
      )
      return
    }

    const userIsAdmin = user.email === ADMIN_EMAIL
    setIsAdmin(userIsAdmin)

    setIsLoading(true)
    // 일반 유저만 Optimistic disable
    if (!userIsAdmin) {
      setHasRequested(true)
    }

    let { error } = await supabase.from('verification_requests').insert({
      instructor_id: instructorId,
      user_id: user.id,
      is_admin: userIsAdmin,
    })

    // is_admin 컬럼이 아직 없으면 (migration 014 미실행) 필드 제외하고 재시도
    if (error && error.code === '42703') {
      const retry = await supabase.from('verification_requests').insert({
        instructor_id: instructorId,
        user_id: user.id,
      })
      error = retry.error
    }

    if (error) {
      if (error.code === '23505') {
        // 중복 — 일반 유저가 이미 요청한 경우 (또는 관리자이지만 구 스키마)
        trackEvent('verify_request_duplicate', { instructor_id: instructorId })
        if (!userIsAdmin) {
          setHasRequested(true)
          showToast('이미 요청한 강사입니다', 'info')
        } else {
          // 관리자가 23505 → 스키마 아직 업데이트되지 않음
          showToast('이미 요청됨 (014 마이그레이션 필요)', 'info')
        }
      } else {
        if (!userIsAdmin) setHasRequested(false)
        showToast('다시 시도해주세요', 'error')
      }
    } else {
      trackEvent('verify_request_success', {
        instructor_id: instructorId,
        admin: userIsAdmin,
      })
      if (userIsAdmin) {
        showToast('요청이 등록되었습니다', 'success')
      }
    }

    setIsLoading(false)
  }, [instructorId, showToast, openLoginModal])

  const baseClass = fullWidth ? 'w-full h-12' : 'h-11'

  if (isVerified) {
    return (
      <button
        disabled
        className={`${baseClass} px-4 bg-[#3182F6] text-white text-sm font-semibold rounded-xl cursor-not-allowed flex items-center justify-center`}
      >
        수익이 확인된 강사입니다
      </button>
    )
  }

  // 관리자는 항상 활성 버튼 (여러 번 클릭 가능)
  // 일반 유저는 hasRequested면 비활성
  if (!isAdmin && hasRequested) {
    return (
      <button
        disabled
        className={`${baseClass} px-4 bg-[#E8F3FF] text-[#3182F6] text-sm font-medium rounded-xl cursor-not-allowed flex items-center justify-center`}
      >
        요청 완료
      </button>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        handleClick()
      }}
      disabled={isLoading}
      className={`${baseClass} px-4 bg-[#3182F6] text-white text-sm font-semibold rounded-xl transition-colors duration-150 hover:bg-[#1B64DA] focus:outline-none disabled:opacity-50 flex items-center justify-center`}
    >
      {isLoading ? '요청 중...' : '확인 요청하기'}
    </button>
  )
}
