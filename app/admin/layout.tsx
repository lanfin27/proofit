import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/admin'

export const metadata = {
  title: '관리자 | Proofit',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authorized = await isAdmin()
  if (!authorized) {
    redirect('/')
  }

  return (
    <div>
      <div className="bg-[#F9FAFB] border-b border-[#E5E8EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-[#8B95A1] mb-2">관리자</p>
          <nav className="flex gap-5 flex-wrap">
            <AdminTab href="/admin">대시보드</AdminTab>
            <AdminTab href="/admin/instructors">강사</AdminTab>
            <AdminTab href="/admin/users">유저</AdminTab>
            <AdminTab href="/admin/requests">확인 요청</AdminTab>
            <AdminTab href="/admin/instructor-requests">강사 요청</AdminTab>
            <AdminTab href="/admin/instructor-applications">수익확인 신청</AdminTab>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

function AdminTab({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-[#4E5968] hover:text-[#191F28] font-medium transition-colors duration-150"
    >
      {children}
    </Link>
  )
}
