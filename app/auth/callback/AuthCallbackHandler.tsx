'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * OAuth 콜백 핸들러 (클라이언트 컴포넌트).
 *
 * Supabase OAuth 토큰 전달 방식:
 * - PKCE: ?code=XXX (URL search params)
 * - Implicit: #access_token=XXX (URL hash — 서버 route에 전달 안 됨)
 *
 * 두 방식 모두 클라이언트에서 처리하여 카카오 동의 정보를 확실히 캡처한다.
 */
export default function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const next = searchParams.get('next') ?? '/instructors'

    async function handleCallback() {
      const supabase = createClient()

      // PKCE flow: URL에 code 파라미터가 있으면 code exchange
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Code exchange failed:', error.message)
          router.replace('/')
          return
        }
      }

      // code exchange 후 (또는 implicit flow에서 hash로 세션이 이미 설정된 후)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace('/')
        return
      }

      // 카카오 유저이고 provider_token이 있으면 동의 정보 저장
      const provider = session.user.app_metadata?.provider
      if (provider === 'kakao' && session.provider_token) {
        try {
          await fetch('/api/kakao-consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              providerToken: session.provider_token,
              userId: session.user.id,
            }),
          })
        } catch {
          // 동의 저장 실패해도 로그인은 계속 진행
        }
      }

      router.replace(next)
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-[#8B95A1]">로그인 처리 중...</p>
    </div>
  )
}
