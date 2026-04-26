'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import InstructorRequestModal from '@/components/InstructorRequestModal'
import type { User } from '@supabase/supabase-js'

/**
 * Student-side CTA strip for the v2 main page. Mirrors the auth flow
 * used by ReportAction: not signed in → open login modal with redirect
 * to '/' (private slugs never enter the redirect chain), signed in →
 * open the existing InstructorRequestModal verbatim.
 */
export default function MainStudentCta() {
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
      <div className="cta-strip">
        <div className="cta-strip-text">
          <h3>확인받고 싶은 강사가 있나요?</h3>
          <p>누구나 수익확인을 요청할 수 있습니다.</p>
        </div>
        <button className="cta-strip-btn" onClick={handleClick}>
          강사 확인 요청하기
        </button>
      </div>
      <InstructorRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
