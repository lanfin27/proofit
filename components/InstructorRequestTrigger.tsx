'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import InstructorRequestModal from '@/components/InstructorRequestModal'
import type { User } from '@supabase/supabase-js'

/**
 * Renders the "강사 요청하기 →" CTA. Click behavior:
 * - 비로그인: LoginModal 열기 (로그인 후 랜딩으로 복귀)
 * - 로그인: InstructorRequestModal 열기
 */
export default function InstructorRequestTrigger() {
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleClick = () => {
    if (!user) {
      openLoginModal('/')
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-sm text-[#8B95A1]">
          확인하고 싶은 강사가 없나요?
        </p>
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-1 mt-1 text-sm font-medium text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150 focus:outline-none"
        >
          강사 요청하기
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <InstructorRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
