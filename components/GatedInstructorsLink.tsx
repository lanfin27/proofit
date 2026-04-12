'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'

interface GatedInstructorsLinkProps {
  href?: string
  className?: string
  children: ReactNode
}

/**
 * Link that gates access to /instructors behind login.
 * - 비로그인: 클릭 시 로그인 모달 (redirectAfter=/instructors)
 * - 로그인: 일반 Link 이동
 * - Supabase 미설정(mock mode): 게이트 없이 통과
 */
export default function GatedInstructorsLink({
  href = '/instructors',
  className,
  children,
}: GatedInstructorsLinkProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { openLoginModal } = useLoginModal()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoggedIn(true) // mock mode — treat as logged in
      setIsReady(true)
      return
    }
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setIsReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (!isReady) return
    if (!isLoggedIn) {
      e.preventDefault()
      openLoginModal(href)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
