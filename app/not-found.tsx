import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#191F28] mb-2 tracking-tight">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-sm text-[#8B95A1] mb-6">
          찾으시는 강사가 있다면 아래에서 검색해보세요
        </p>
        <Link
          href="/instructors"
          className="inline-block px-6 py-3 bg-[#3182F6] text-white font-semibold rounded-xl hover:bg-[#1B64DA] transition-colors duration-150"
        >
          강사 리스트 보기
        </Link>
      </div>
    </div>
  )
}
