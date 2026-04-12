import { getInstructors } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'

interface RawRequestRow {
  id: string
  instructor_id: string
  created_at: string
  is_admin: boolean | null
}

async function getAllRequests(): Promise<RawRequestRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('verification_requests')
      .select('id, instructor_id, created_at, is_admin')
      .order('created_at', { ascending: false })

    if (!error && data) {
      return data as RawRequestRow[]
    }

    // is_admin 컬럼이 없으면 (migration 014 미실행) fallback
    if (error?.code === '42703') {
      const fallback = await supabase
        .from('verification_requests')
        .select('id, instructor_id, created_at')
        .order('created_at', { ascending: false })
      if (!fallback.error && fallback.data) {
        return (fallback.data as Array<Omit<RawRequestRow, 'is_admin'>>).map(
          (r) => ({ ...r, is_admin: false })
        )
      }
    }

    return []
  } catch {
    return []
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface Aggregate {
  total: number
  admin: number
  user: number
}

export default async function AdminRequestsPage() {
  const [instructors, allRequests] = await Promise.all([
    getInstructors({ sort: 'requests' }),
    getAllRequests(),
  ])

  const nameMap = new Map(instructors.map((i) => [i.id, i.display_name]))

  // 강사별로 합계 / 관리자 / 일반 집계
  const statsMap = new Map<string, Aggregate>()
  for (const req of allRequests) {
    const current = statsMap.get(req.instructor_id) ?? {
      total: 0,
      admin: 0,
      user: 0,
    }
    current.total += 1
    if (req.is_admin) {
      current.admin += 1
    } else {
      current.user += 1
    }
    statsMap.set(req.instructor_id, current)
  }

  // 랭킹: 전체 강사 목록에 집계 붙이고 합계 내림차순
  const ranked = instructors
    .map((inst) => ({
      id: inst.id,
      display_name: inst.display_name,
      ...(statsMap.get(inst.id) ?? { total: 0, admin: 0, user: 0 }),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20)

  const recent = allRequests.slice(0, 20)

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        확인 요청
      </h1>
      <p className="text-sm text-[#4E5968] mt-1">
        강사별 요청 랭킹과 최근 요청 목록 (관리자/일반 구분)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <section>
          <h2 className="text-base font-semibold text-[#191F28] mb-3">
            강사별 요청 랭킹
          </h2>
          <div className="border border-[#E5E8EB] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                    <th className="px-4 py-3 font-medium w-10">#</th>
                    <th className="px-4 py-3 font-medium">강사</th>
                    <th className="px-4 py-3 font-medium text-right">합계</th>
                    <th className="px-4 py-3 font-medium text-right">관리자</th>
                    <th className="px-4 py-3 font-medium text-right">일반</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E8EB]">
                  {ranked.map((inst, idx) => (
                    <tr key={inst.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 text-[#8B95A1] tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#191F28]">
                        {inst.display_name}
                      </td>
                      <td className="px-4 py-3 text-right text-[#191F28] font-semibold tabular-nums">
                        {inst.total}
                      </td>
                      <td className="px-4 py-3 text-right text-[#3182F6] tabular-nums">
                        {inst.admin}
                      </td>
                      <td className="px-4 py-3 text-right text-[#4E5968] tabular-nums">
                        {inst.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28] mb-3">
            최근 요청
          </h2>
          <div className="border border-[#E5E8EB] rounded-xl overflow-hidden">
            {recent.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                      <th className="px-4 py-3 font-medium">강사</th>
                      <th className="px-4 py-3 font-medium">유형</th>
                      <th className="px-4 py-3 font-medium text-right">시간</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E8EB]">
                    {recent.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F9FAFB]">
                        <td className="px-4 py-3 text-[#191F28]">
                          {nameMap.get(r.instructor_id) ??
                            r.instructor_id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">
                          {r.is_admin ? (
                            <span className="text-xs font-medium text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.5 rounded">
                              관리자
                            </span>
                          ) : (
                            <span className="text-xs text-[#8B95A1]">일반</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-[#4E5968] tabular-nums whitespace-nowrap">
                          {formatDateTime(r.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-sm text-[#8B95A1]">최근 요청이 없습니다</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
