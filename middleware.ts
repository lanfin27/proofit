import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 기본 응답 — 오류 발생 시 이 응답을 그대로 반환
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // 환경변수가 없거나 PLACEHOLDER면 세션 갱신 스킵
  if (!url || !key || url.includes('PLACEHOLDER') || key.includes('PLACEHOLDER')) {
    return supabaseResponse
  }

  try {
    // Edge Runtime에서 동적 import로 @supabase/ssr 로드
    const { createServerClient } = await import('@supabase/ssr')

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // 세션 갱신 — 실패해도 사이트 접근은 허용
    await supabase.auth.getUser()
  } catch (e) {
    // Supabase 연결 실패, Edge Runtime 호환 문제 등 모든 오류를 무시
    // 사이트는 정상적으로 로드되어야 함
    console.error('Middleware session refresh failed:', e)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
