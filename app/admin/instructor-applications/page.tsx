import { createClient } from '@/lib/supabase/server'

interface ApplicationRow {
  id: string
  instructor_name: string
  contact: string
  course_link: string | null
  user_email: string | null
  status: string
  created_at: string
}

async function getApplications(): Promise<ApplicationRow[]> {
  try {
    const supabase = await createClient()

    // user_email 컬럼 포함 시도
    const { data, error } = await supabase
      .from('instructor_applications')
      .select(
        'id, instructor_name, contact, course_link, user_email, status, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(200)

    // user_email 컬럼이 아직 없으면 (migration 016 미실행) fallback
    if (error?.code === '42703') {
      const { data: fb, error: fbErr } = await supabase
        .from('instructor_applications')
        .select('id, instructor_name, contact, course_link, status, created_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!fbErr && fb) {
        return (
          fb as Array<{
            id: string
            instructor_name: string
            contact: string
            course_link: string | null
            status: string
            created_at: string
          }>
        ).map((r) => ({ ...r, user_email: null }))
      }
      if (fbErr) console.error('instructor_applications error:', fbErr.message)
      return []
    }

    if (error) {
      console.error('instructor_applications error:', error.message)
      return []
    }
    return (data ?? []) as ApplicationRow[]
  } catch {
    return []
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\/.+/i.test(url)
}

const STATUS_LABELS: Record<string, string> = {
  pending: '대기',
  in_progress: '진행 중',
  completed: '완료',
  rejected: '반려',
}

export default async function AdminInstructorApplicationsPage() {
  const applications = await getApplications()

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        강사 수익확인 신청
      </h1>
      <p className="text-sm text-[#4E5968] mt-1">
        강사가 직접 신청한 수익확인 목록 (총 {applications.length}건)
      </p>

      <div className="mt-8 border border-[#E5E8EB] rounded-xl overflow-hidden">
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] text-left text-xs text-[#4E5968]">
                  <th className="px-4 py-3 font-medium">강사 활동명</th>
                  <th className="px-4 py-3 font-medium">연락처</th>
                  <th className="px-4 py-3 font-medium">강의 링크</th>
                  <th className="px-4 py-3 font-medium">신청자 계정</th>
                  <th className="px-4 py-3 font-medium">상태</th>
                  <th className="px-4 py-3 font-medium">신청일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8EB]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 font-medium text-[#191F28]">
                      {app.instructor_name}
                    </td>
                    <td className="px-4 py-3 text-[#4E5968]">
                      {app.contact}
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      {app.course_link && isSafeUrl(app.course_link) ? (
                        <a
                          href={app.course_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3182F6] hover:underline truncate block"
                        >
                          {app.course_link}
                        </a>
                      ) : app.course_link ? (
                        <span className="text-[#8B95A1] truncate block">
                          {app.course_link}
                        </span>
                      ) : (
                        <span className="text-[#B0B8C1]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#4E5968]">
                      {app.user_email ? (
                        <span className="text-[#191F28]">{app.user_email}</span>
                      ) : (
                        <span className="text-[#8B95A1]">비회원</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          app.status === 'completed'
                            ? 'text-[#1B8C3D] bg-[#E8FFE8]'
                            : app.status === 'in_progress'
                              ? 'text-[#3182F6] bg-[#E8F3FF]'
                              : app.status === 'rejected'
                                ? 'text-[#F04452] bg-[#FFF0F0]'
                                : 'text-[#8B95A1] bg-[#F2F4F6]'
                        }`}
                      >
                        {STATUS_LABELS[app.status] ?? app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8B95A1] tabular-nums whitespace-nowrap">
                      {formatDateTime(app.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-[#8B95A1]">
              아직 강사 수익확인 신청이 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
