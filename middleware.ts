import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 서비스 운영 종료: 메인(`/`)을 제외한 모든 경로 접근을 차단하고
// 안내 페이지로 리다이렉트합니다.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  // 정적 자산(_next, 파비콘, 이미지 등)과 메인만 제외하고 전부 매칭합니다.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
