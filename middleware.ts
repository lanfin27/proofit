import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(_request: NextRequest) {
  // Supabase session refresh는 클라이언트 측 onAuthStateChange로 처리.
  // Edge Runtime 호환성 문제로 middleware에서 @supabase/ssr 사용을 제거.
  // 인증 체크는 각 페이지의 서버 컴포넌트에서 직접 수행
  // (admin/layout.tsx의 isAdmin, instructors/page.tsx의 requireAuthOrRedirect).
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
