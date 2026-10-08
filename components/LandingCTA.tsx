'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import { trackEvent } from '@/lib/analytics'

/**
 * Mobile-only sticky bottom CTA. Hidden when logged in.
 */
export default function LandingCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsReady(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setIsReady(true)
    })
  }, [])

  const isVisible = isReady && !isLoggedIn

  // Pad the bottom of the page on mobile so the fixed bar doesn't cover the footer
  useEffect(() => {
    if (!isVisible) return
    document.body.classList.add('pb-20', 'md:pb-0')
    return () => document.body.classList.remove('pb-20', 'md:pb-0')
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E8EB] p-3 md:hidden z-40">
      <button
        onClick={() => {
          trackEvent('cta_button_click', { type: 'sticky_bottom' })
          openLoginModal()
        }}
        className="w-full h-12 bg-[#3182F6] text-white font-semibold rounded-xl flex items-center justify-center"
      >
        강의료 확인하기
      </button>
    </div>
  )
}
