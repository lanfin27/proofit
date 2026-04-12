import { getInstructors } from '@/lib/data'
import NotionSyncButton from '@/components/admin/NotionSyncButton'

export default async function AdminInstructorsPage() {
  const instructors = await getInstructors({ sort: 'requests' })

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
            강사 관리
          </h1>
          <p className="text-sm text-[#4E5968] mt-1">
            총 {instructors.length}명의 강사
          </p>
        </div>
        <NotionSyncButton />
      </div>

      <div className="mt-8 border border-[#E5E8EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                <th className="px-4 py-3 font-medium">이름</th>
                <th className="px-4 py-3 font-medium">분야</th>
                <th className="px-4 py-3 font-medium">플랫폼</th>
                <th className="px-4 py-3 font-medium text-right">강의 수</th>
                <th className="px-4 py-3 font-medium text-right">평균 가격</th>
                <th className="px-4 py-3 font-medium text-right">요청 수</th>
                <th className="px-4 py-3 font-medium text-center">수익확인</th>
                <th className="px-4 py-3 font-medium">정보업데이트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E8EB]">
              {instructors.map((inst) => (
                <tr key={inst.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3 font-medium text-[#191F28]">
                    {inst.display_name}
                  </td>
                  <td className="px-4 py-3 text-[#4E5968]">
                    {inst.categories.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-[#4E5968]">
                    {inst.platforms.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#191F28]">
                    {inst.course_count}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#191F28]">
                    {inst.price_avg !== null
                      ? `${inst.price_avg.toLocaleString('ko-KR')}원`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#191F28]">
                    {inst.verification_count}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inst.is_verified ? (
                      <span className="text-xs font-medium text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.5 rounded">
                        확인
                      </span>
                    ) : (
                      <span className="text-xs text-[#B0B8C1]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#8B95A1] tabular-nums whitespace-nowrap">
                    {inst.info_updated_at
                      ? new Date(inst.info_updated_at).toLocaleDateString(
                          'ko-KR'
                        )
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
