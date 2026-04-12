'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'

interface LoginGateTriggerProps {
  /** URL에서 ?login 값이 "instructors"이면 자동으로 /instructors를 redirectAfter로 로그인 모달을 연다 */
  gate?: string | null
}

/**
 * /?login=instructors 같은 URL로 진입했을 때, 클라이언트 측에서 로그인 모달을 자동으로 연다.
 * 이미 로그인되어 있으면 해당 경로로 바로 이동.
 */
export default function LoginGateTrigger({ gate }: LoginGateTriggerProps) {
  const { openLoginModal } = useLoginModal()
  const router = useRouter()
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!gate || hasTriggered.current) return
    const target = gate === 'instructors' ? '/instructors' : null
    if (!target) return

    hasTriggered.current = true

    if (!isSupabaseConfigured()) {
      openLoginModal(target)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push(target)
      } else {
        openLoginModal(target)
      }
    })
  }, [gate, openLoginModal, router])

  return null
}
