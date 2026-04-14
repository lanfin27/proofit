import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/instructors'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Server component context — can be ignored
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // DEBUG: 카카오 유저 메타데이터 확인용 (Vercel Logs에서 확인)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('=== KAKAO USER DEBUG ===')
        console.log(JSON.stringify(user, null, 2))
        console.log('=== USER METADATA ===')
        console.log(JSON.stringify(user?.user_metadata, null, 2))
        console.log('=== APP METADATA ===')
        console.log(JSON.stringify(user?.app_metadata, null, 2))
        console.log('=== IDENTITIES ===')
        console.log(JSON.stringify(user?.identities, null, 2))
      } catch {
        // debug 실패해도 무시
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
