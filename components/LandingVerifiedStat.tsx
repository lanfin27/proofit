'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

interface LandingVerifiedStatProps {
  count: number
  totalCount: number
}

/**
 * "수익확인된 강사" 통계 카드 — 비로그인 시 숫자를 블러 처리하여 실제 숫자를 가림.
 * SSR 안전: 기본값을 blur로 설정하여 hydration mismatch 방지.
 */
export default function LandingVerifiedStat({ count, totalCount }: LandingVerifiedStatProps) {
  const [shouldBlur, setShouldBlur] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setShouldBlur(false)
      return
    }
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setShouldBlur(!user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setShouldBlur(!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const displayCount = shouldBlur ? Math.max(0, totalCount - 20) : count

  return (
    <div>
      <p className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#3182F6] tracking-tight tabular-nums leading-none">
        <span className={shouldBlur ? 'blur-[10px] select-none' : ''}>
          {displayCount}
        </span>
        <span>명</span>
      </p>
      <p className="text-sm text-[#8B95A1] mt-2">수익확인된 강사</p>
    </div>
  )
}
