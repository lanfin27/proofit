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
}

async function getUsers(): Promise<{
  users: AuthUser[]
  consentsMap: Map<string, boolean | null>
  error: string | null
}> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  if (serviceKey.includes('PLACEHOLDER') || !serviceKey || !url) {
    return {
      users: [],
      consentsMap: new Map(),
      error:
        'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local에 실제 키를 입력하세요.',
    }
  }

  try {
    const admin = createServerClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // 유저 목록 + 동의 정보 병렬 조회
    const [usersRes, consentsRes] = await Promise.all([
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      admin.from('user_consents').select('id, kakao_message_agreed'),
    ])

    if (usersRes.error) {
      return { users: [], consentsMap: new Map(), error: usersRes.error.message }
    }

    // 동의 정보 맵 구성 (user_consents 테이블이 없어도 빈 맵으로 처리)
    const consentsMap = new Map<string, boolean | null>()
    if (!consentsRes.error && consentsRes.data) {
      for (const row of consentsRes.data as Array<{
        id: string
        kakao_message_agreed: boolean | null
      }>) {
        consentsMap.set(row.id, row.kakao_message_agreed)
      }
    }

    return {
      users: (usersRes.data.users ?? []) as unknown as AuthUser[],
      consentsMap,
      error: null,
    }
  } catch (e) {
    return {
      users: [],
      consentsMap: new Map(),
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

export default async function AdminUsersPage() {
  const { users, consentsMap, error } = await getUsers()

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
                  const consent = consentsMap.get(u.id)
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
