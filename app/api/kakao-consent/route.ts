import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

/**
 * POST /api/kakao-consent
 * 클라이언트에서 provider_token + userId를 받아
 * 카카오 동의 API를 호출하고 user_consents에 저장.
 */
export async function POST(request: Request) {
  try {
    const { providerToken, userId } = (await request.json()) as {
      providerToken?: string
      userId?: string
    }

    if (!providerToken || !userId) {
      return NextResponse.json(
        { error: 'Missing providerToken or userId' },
        { status: 400 }
      )
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    if (!serviceKey || serviceKey.includes('PLACEHOLDER')) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    // 카카오 동의 항목 조회
    const scopeRes = await fetch('https://kapi.kakao.com/v2/user/scopes', {
      headers: { Authorization: `Bearer ${providerToken}` },
    })

    if (!scopeRes.ok) {
      console.error('Kakao scopes API error:', scopeRes.status)
      return NextResponse.json({ agreed: null })
    }

    const scopeData = (await scopeRes.json()) as {
      scopes?: Array<{ id: string; agreed: boolean }>
    }

    const talkScope = scopeData.scopes?.find((s) => s.id === 'talk_message')
    const agreed = talkScope !== undefined ? talkScope.agreed === true : null

    // user_consents에 저장
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    await admin.from('user_consents').upsert(
      {
        id: userId,
        kakao_message_agreed: agreed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    return NextResponse.json({ agreed })
  } catch (e) {
    console.error('Kakao consent API error:', e)
    return NextResponse.json({ agreed: null })
  }
}
