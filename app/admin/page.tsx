import { createClient } from '@/lib/supabase/server'
import { mockInstructors, mockCourses } from '@/lib/mock-data'

interface DashboardStats {
  instructorCount: number
  courseCount: number
  userCount: number | null
  requestCount: number
  todayRequestCount: number
  instructorRequestCount: number
}

async function getDashboardStats(): Promise<DashboardStats> {
  const fallback: DashboardStats = {
    instructorCount: mockInstructors.length,
    courseCount: mockCourses.length,
    userCount: null,
    requestCount: mockInstructors.reduce(
      (sum, i) => sum + (i.verification_count ?? 0),
      0
    ),
    todayRequestCount: 0,
    instructorRequestCount: 0,
  }

  try {
    const supabase = await createClient()

    const [instructorRes, courseRes, requestRes] = await Promise.all([
      supabase.from('instructors').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase
        .from('verification_requests')
        .select('*', { count: 'exact', head: true }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayCount } = await supabase
      .from('verification_requests')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    const { count: instructorRequestCount } = await supabase
      .from('instructor_requests')
      .select('*', { count: 'exact', head: true })

    return {
      instructorCount: instructorRes.count ?? fallback.instructorCount,
      courseCount: courseRes.count ?? fallback.courseCount,
      userCount: null, // Admin API로만 조회 가능
      requestCount: requestRes.count ?? fallback.requestCount,
      todayRequestCount: todayCount ?? 0,
      instructorRequestCount: instructorRequestCount ?? 0,
    }
  } catch (e) {
    console.error('Dashboard stats error:', e)
    return fallback
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        대시보드
      </h1>
      <p className="text-sm text-[#4E5968] mt-1">전체 서비스 현황을 확인합니다.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard label="총 강사 수" value={stats.instructorCount} />
        <StatCard label="총 강의 수" value={stats.courseCount} />
        <StatCard
          label="총 유저 수"
          value={stats.userCount}
          hint={stats.userCount === null ? 'Service role key 필요' : undefined}
        />
        <StatCard label="총 확인 요청 수" value={stats.requestCount} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <StatCard label="오늘 확인 요청 수" value={stats.todayRequestCount} />
        <StatCard label="강사 요청 수" value={stats.instructorRequestCount} />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: number | null
  hint?: string
}) {
  return (
    <div className="border border-[#E5E8EB] rounded-xl p-5 bg-white">
      <p className="text-xs text-[#8B95A1]">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold text-[#191F28] mt-1 tabular-nums">
        {value !== null ? value.toLocaleString('ko-KR') : '—'}
      </p>
      {hint && <p className="text-xs text-[#B0B8C1] mt-1">{hint}</p>}
    </div>
  )
}
