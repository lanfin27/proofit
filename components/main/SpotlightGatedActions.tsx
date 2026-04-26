'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import type { User } from '@supabase/supabase-js'

/**
 * Shared auth hook for the two spotlight CTAs. Mirrors the pattern
 * used by InstructorRequestTrigger — subscribe to Supabase auth and
 * gate clicks while not signed in.
 */
function useGatedClick() {
  const [user, setUser] = useState<User | null>(null)
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

  return { user, openLoginModal }
}

type ReportCtaProps = {
  slug: string
}

/**
 * Spotlight "확인 리포트 보기" button. Wraps the original <Link>
 * with an auth gate — anonymous clicks open the login modal,
 * signed-in clicks navigate normally.
 */
export function SpotlightReportCta({ slug }: ReportCtaProps) {
  const { user, openLoginModal } = useGatedClick()

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      openLoginModal('/')
    }
  }

  return (
    <Link
      href={`/reports/${slug}`}
      className="sp-cta-primary"
      onClick={handleClick}
    >
      확인 리포트 보기 →
    </Link>
  )
}

type VideoProps = {
  videoUrl: string
}

/**
 * Spotlight "진위확인 영상" card. Anonymous clicks open the login
 * modal; signed-in clicks follow the YouTube link in a new tab via
 * the underlying <a target="_blank">.
 *
 * Stays on <a> (not <button>) so the .sp-video CSS — aspect-ratio,
 * gradient background, absolute-positioned play icon and caption —
 * applies the same way it did before any auth gating was added.
 * Mirrors the SpotlightReportCta pattern: preventDefault on the
 * onClick, then openLoginModal.
 */
export function SpotlightVideoCard({ videoUrl }: VideoProps) {
  const { user, openLoginModal } = useGatedClick()

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      openLoginModal('/')
    }
  }

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="sp-video"
      onClick={handleClick}
    >
      <div className="sp-video-play"></div>
      <div className="sp-video-caption">
        <div className="t1">▶ 진위확인 영상 보기</div>
        <div className="t2">Proofit 검증</div>
      </div>
    </a>
  )
}
