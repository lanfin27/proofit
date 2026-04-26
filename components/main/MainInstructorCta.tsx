'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import InstructorApplicationModal from '@/components/InstructorApplicationModal'
import type { User } from '@supabase/supabase-js'

/**
 * Instructor-side CTA strip for the v2 main page. Same auth pattern
 * as MainStudentCta — not signed in → openLoginModal('/'), signed in
 * → open the existing InstructorApplicationModal verbatim.
 *
 * Visually rendered with the .cta-strip--instructor modifier so it
 * doesn't compete with the student CTA stacked above.
 */
export default function MainInstructorCta() {
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
      <div className="cta-strip cta-strip--instructor">
        <div className="cta-strip-text">
          <h3>강사이신가요?</h3>
          <p>수익확인을 통해 수강생에게 신뢰를 보여주세요. 현재 무료 진행 중입니다.</p>
        </div>
        <button className="cta-strip-btn" onClick={handleClick}>
          수익확인 신청하기 →
        </button>
      </div>
      <InstructorApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
