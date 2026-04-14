'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { trackEvent, sendGAEvent } from '@/lib/analytics'
import { useToast } from '@/components/Toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectAfter?: string
}

export default function LoginModal({ isOpen, onClose, redirectAfter }: LoginModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

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

  if (!isOpen) return null

  const handleLogin = async (provider: 'kakao' | 'google') => {
    sendGAEvent('login_click', { provider })
    trackEvent('login_modal_open', { trigger: provider })

    if (!isSupabaseConfigured()) {
      showToast('서비스 준비 중입니다', 'info')
      return
    }

    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectAfter ?? '/instructors')}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          ...(provider === 'kakao' && { scopes: 'talk_message' }),
        },
      })

      if (error) {
        trackEvent('login_fail', { provider })
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error')
      }
    } catch {
      trackEvent('login_fail', { provider })
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-7 max-w-md w-full relative"
        role="dialog"
        aria-modal="true"
        aria-label="로그인"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#B0B8C1] hover:text-[#4E5968] transition-colors duration-150 focus:outline-none rounded-lg"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mb-7 mt-2">
          <h2 className="text-xl font-bold text-[#191F28] leading-tight">
            수익이 확인된 강사를<br />확인하세요
          </h2>
          <p className="text-sm text-[#8B95A1] mt-2">
            카카오 계정으로 5초면 끝나요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleLogin('kakao')}
            className="flex items-center justify-center gap-2 w-full h-12 bg-kakao text-[#000000D9] font-semibold rounded-xl transition-all duration-150 hover:brightness-95 focus:outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0.6C4.02944 0.6 0 3.71295 0 7.55C0 9.94013 1.55836 12.0433 3.93132 13.2923L2.93331 16.9439C2.84996 17.2589 3.21275 17.5106 3.48914 17.3281L7.87529 14.3958C8.24099 14.4313 8.61253 14.45 8.98905 14.45C13.9596 14.45 17.989 11.3371 17.989 7.5C17.989 3.66295 13.9706 0.6 9 0.6Z"
                fill="black"
                fillOpacity="0.9"
              />
            </svg>
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleLogin('google')}
            className="flex items-center justify-center gap-2 w-full h-12 bg-white border border-[#E5E8EB] text-[#191F28] font-medium rounded-xl transition-colors duration-150 hover:bg-[#F9FAFB] focus:outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            구글로 시작하기
          </button>
        </div>

        <p className="text-xs text-[#B0B8C1] text-center mt-5">
          로그인 시 이용약관에 동의합니다
        </p>
      </div>
    </div>
  )
}
