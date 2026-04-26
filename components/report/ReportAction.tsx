'use client'

import { useState, useEffect } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import InstructorRequestModal from '@/components/InstructorRequestModal'
import type { User } from '@supabase/supabase-js'
import type { ReportAction as ReportActionData } from '@/lib/report-types'

type Props = {
  data: ReportActionData
}

export default function ReportAction({ data }: Props) {
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
      // Redirect target is '/' (not the current report URL) so a private
      // preview slug never makes it into the login redirect chain.
      openLoginModal('/')
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="action">
        <div className="title">{data.title}</div>
        <div className="sub">{data.sub}</div>
        <button onClick={handleClick}>{data.buttonLabel}</button>
      </div>
      <InstructorRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
