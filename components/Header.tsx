'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { useLoginModal } from '@/components/LoginModalProvider'
import type { User } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'macrohand27@gmail.com'

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: '강사 목록', href: '/instructors' },
  { label: '팀소개', href: '/about' },
]

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const { openLoginModal } = useLoginModal()
  const pathname = usePathname()

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

  const handleLogout = async () => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    '사용자'

  const isAdmin = user?.email === ADMIN_EMAIL

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-[#E5E8EB] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="shrink-0">
            <span className="text-xl font-extrabold text-[#3182F6] tracking-tight">
              Proofit
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              const requiresAuth = item.href === '/instructors'
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (requiresAuth && !user) {
                      e.preventDefault()
                      openLoginModal(item.href)
                    }
                  }}
                  className={`text-sm transition-colors duration-150 ${
                    active
                      ? 'text-[#191F28] font-semibold'
                      : 'text-[#4E5968] hover:text-[#191F28]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-[#4E5968] hover:text-[#191F28] transition-colors duration-150"
            >
              관리
            </Link>
          )}
          {user ? (
            <>
              <span className="text-sm text-[#4E5968] hidden sm:inline">
                {displayName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#8B95A1] hover:text-[#4E5968] transition-colors duration-150 focus:outline-none"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => openLoginModal()}
              className="text-sm text-[#8B95A1] hover:text-[#4E5968] transition-colors duration-150 focus:outline-none"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
