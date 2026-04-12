'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#191F28] mb-2 tracking-tight">
          일시적인 문제가 발생했습니다
        </h2>
        <p className="text-sm text-[#8B95A1] mb-6">잠시 후 다시 시도해주세요</p>
        <div className="flex gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-xl hover:bg-[#E5E8EB] transition-colors duration-150"
          >
            홈으로 돌아가기
          </a>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#3182F6] text-white font-semibold rounded-xl hover:bg-[#1B64DA] transition-colors duration-150"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  )
}
