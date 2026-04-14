import { createClient as createServerClient } from '@supabase/supabase-js'

// 항상 최신 유저 목록을 가져오도록 캐싱 비활성화
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AuthUser {
  id: string
  email: string | null
  created_at: string
  user_metadata?: Record<string, unknown>
  app_metadata?: {
    provider?: string
    providers?: string[]
  }
  identities?: Array<{
    provider?: string
    identity_data?: Record<string, unknown>
  }>
}

async function getUsers(): Promise<{ users: AuthUser[]; error: string | null }> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  if (serviceKey.includes('PLACEHOLDER') || !serviceKey || !url) {
    return {
      users: [],
      error:
        'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local에 실제 키를 입력하세요.',
    }
  }

  try {
    const admin = createServerClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })
    if (error) {
      return { users: [], error: error.message }
    }
    return { users: (data.users ?? []) as unknown as AuthUser[], error: null }
  } catch (e) {
    return {
      users: [],
      error: e instanceof Error ? e.message : '유저 조회 실패',
    }
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getProvider(user: AuthUser): string {
  return (
    user.app_metadata?.provider ??
    user.app_metadata?.providers?.[0] ??
    (user.user_metadata?.provider as string | undefined) ??
    '—'
  )
}

function getUserName(user: AuthUser): string {
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    '—'
  )
}

/**
 * 카카오 talk_message 동의 여부를 user_metadata에서 추출.
 * Supabase가 카카오에서 받아오는 메타데이터 구조에 따라 체크:
 * - custom_claims.talk_message
 * - provider_token_scope에 "talk_message" 포함
 * - kakao_account 내부 consent 필드
 * 정보가 없으면 null 반환.
 */
function getKakaoMessageConsent(user: AuthUser): boolean | null {
  const provider = getProvider(user)
  if (provider !== 'kakao') return null

  const meta = user.user_metadata ?? {}

  // 방법 1: custom_claims
  const claims = meta.custom_claims as Record<string, unknown> | undefined
  if (claims && typeof claims.talk_message === 'boolean') {
    return claims.talk_message
  }

  // 방법 2: provider_token_scope
  const scope =
    (meta.provider_token_scope as string | undefined) ??
    (meta.scope as string | undefined) ??
    ''
  if (scope && scope.includes('talk_message')) return true

  // 방법 3: kakao_account 동의 정보
  const kakaoAccount = meta.kakao_account as Record<string, unknown> | undefined
  if (kakaoAccount) {
    if (kakaoAccount.talk_message_needs_agreement === false) return true
    if (kakaoAccount.talk_message_needs_agreement === true) return false
  }

  // 방법 4: identities의 identity_data
  const kakaoIdentity = (user.identities ?? []).find(
    (i) => i.provider === 'kakao'
  )
  if (kakaoIdentity?.identity_data) {
    const idScope = kakaoIdentity.identity_data.provider_token_scope as
      | string
      | undefined
    if (idScope && idScope.includes('talk_message')) return true
  }

  return null
}

export default async function AdminUsersPage() {
  const { users, error } = await getUsers()

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        유저 관리
      </h1>
      <p className="text-sm text-[#4E5968] mt-1">
        {error ? '유저 조회 불가' : `총 ${users.length}명`}
      </p>

      {error ? (
        <div className="mt-8 border border-[#E5E8EB] rounded-xl p-6 bg-[#F9FAFB]">
          <p className="text-sm text-[#4E5968]">{error}</p>
        </div>
      ) : (
        <div className="mt-8 border border-[#E5E8EB] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                  <th className="px-4 py-3 font-medium">닉네임</th>
                  <th className="px-4 py-3 font-medium">이메일</th>
                  <th className="px-4 py-3 font-medium">로그인 방법</th>
                  <th className="px-4 py-3 font-medium">메시지 동의</th>
                  <th className="px-4 py-3 font-medium">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB]">
                {users.map((u) => {
                  const provider = getProvider(u)
                  const consent = getKakaoMessageConsent(u)
                  return (
                    <tr key={u.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-medium text-[#191F28]">
                        {getUserName(u)}
                      </td>
                      <td className="px-4 py-3 text-[#4E5968]">
                        {u.email ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#4E5968]">{provider}</td>
                      <td className="px-4 py-3">
                        {provider !== 'kakao' ? (
                          <span className="text-[#B0B8C1]">—</span>
                        ) : consent === true ? (
                          <span className="text-[#1B8C3D] font-medium">
                            동의
                          </span>
                        ) : consent === false ? (
                          <span className="text-[#8B95A1]">미동의</span>
                        ) : (
                          <span className="text-[#B0B8C1]">확인 안됨</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#4E5968] tabular-nums">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
