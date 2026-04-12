'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import { trackEvent } from '@/lib/analytics'

export default function LandingBottomCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  return (
    <section className="border-t border-[#E5E8EB] py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isLoggedIn ? (
          <Link
            href="/instructors"
            className="inline-flex items-center gap-1 text-base font-semibold text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150"
          >
            전체 강사 보기
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <>
            <p className="text-base md:text-lg font-semibold text-[#191F28]">
              강사의 강의료와 수익확인 현황을 확인하세요
            </p>
            <div className="mt-5 flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  trackEvent('cta_button_click', { type: 'bottom_kakao' })
                  openLoginModal('/instructors')
                }}
                className="flex items-center justify-center gap-2 w-full max-w-xs h-12 bg-kakao text-[#000000D9] font-semibold rounded-xl transition-all duration-150 hover:brightness-95"
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
                onClick={() => {
                  trackEvent('cta_button_click', { type: 'bottom_google' })
                  openLoginModal('/instructors')
                }}
                className="text-sm text-[#8B95A1] hover:text-[#4E5968] transition-colors duration-150"
              >
                구글로 시작하기
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
