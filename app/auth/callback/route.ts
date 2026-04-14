import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // 카카오 유저: provider_token으로 동의 항목 조회 → user_consents에 저장
      try {
        const session = data.session
        const user = session.user
        const provider = user.app_metadata?.provider

        if (
          provider === 'kakao' &&
          session.provider_token &&
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('PLACEHOLDER')
        ) {
          const scopeRes = await fetch(
            'https://kapi.kakao.com/v2/user/scopes',
            {
              headers: {
                Authorization: `Bearer ${session.provider_token}`,
              },
            }
          )

          if (scopeRes.ok) {
            const scopeData = (await scopeRes.json()) as {
              scopes?: Array<{ id: string; agreed: boolean }>
            }

            const talkScope = scopeData.scopes?.find(
              (s) => s.id === 'talk_message'
            )
            const agreed =
              talkScope !== undefined ? talkScope.agreed === true : null

            const admin = createAdminClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
              { auth: { persistSession: false, autoRefreshToken: false } }
            )

            await admin.from('user_consents').upsert(
              {
                id: user.id,
                kakao_message_agreed: agreed,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            )
          }
        }
      } catch (err) {
        // 동의 확인 실패해도 로그인 플로우를 절대 차단하지 않는다
        console.error('Kakao scope check failed:', err)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
