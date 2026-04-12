import { createClient } from '@/lib/supabase/server'
import { InstructorRequest } from '@/lib/types'

async function getInstructorRequests(): Promise<InstructorRequest[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('instructor_requests')
      .select('id, user_id, user_email, instructor_name, course_url, created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      console.error('instructor_requests error:', error.message)
      return []
    }
    return (data ?? []) as InstructorRequest[]
  } catch (e) {
    console.error('Connection error:', e)
    return []
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\/.+/i.test(url)
}

export default async function AdminInstructorRequestsPage() {
  const requests = await getInstructorRequests()

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        강사 요청
      </h1>
      <p className="text-sm text-[#4E5968] mt-1">
        수강생이 확인을 요청한 강사 목록 (총 {requests.length}건)
      </p>

      <div className="mt-8 border border-[#E5E8EB] rounded-xl overflow-hidden">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                  <th className="px-4 py-3 font-medium">신청자</th>
                  <th className="px-4 py-3 font-medium">강사명</th>
                  <th className="px-4 py-3 font-medium">강의 링크</th>
                  <th className="px-4 py-3 font-medium">신청일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB]">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 text-[#4E5968] truncate max-w-[200px]">
                      {req.user_email ?? req.user_id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#191F28]">
                      {req.instructor_name}
                    </td>
                    <td className="px-4 py-3 max-w-[280px]">
                      {isSafeUrl(req.course_url) ? (
                        <a
                          href={req.course_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3182F6] hover:underline truncate block"
                        >
                          {req.course_url}
                        </a>
                      ) : (
                        <span className="text-[#8B95A1] truncate block">
                          {req.course_url}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#8B95A1] tabular-nums whitespace-nowrap">
                      {formatDateTime(req.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-[#8B95A1]">아직 강사 요청이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
