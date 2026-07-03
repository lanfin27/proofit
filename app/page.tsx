'use client'

import { useState } from 'react'

export default function ClosedPage() {
  const [showNotice, setShowNotice] = useState(true)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* 로고만 남깁니다 */}
      <span className="text-3xl font-extrabold text-[#3182F6] tracking-tight">
        Proofit
      </span>

      {/* 서비스 종료 안내 팝업 */}
      {showNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="서비스 종료 안내"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-8 shadow-xl">
            <h2 className="text-lg font-extrabold text-[#191F28] tracking-tight">
              서비스 종료 안내
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#4E5968]">
              <p>그동안 프루핏 서비스를 이용해주셔서 감사합니다.</p>
              <p>
                강의 시장의 불투명함이라는 문제를 개선하고자 프루핏 서비스를
                런칭하였고, 짧은 기간이지만 부단히 여러 강사분들을 섭외하려고
                노력하였으나 정보를 제공하는 강사분들이 극소수에 불과하여
                부득이하게 서비스를 계속하여 운영해 나가기가 어렵게 되었습니다.
              </p>
              <p>그동안 서비스를 이용해주셔서 진심으로 감사했습니다.</p>
              <p className="text-[#8B95A1]">- 팀프루핏 운영진 드림</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotice(false)}
              className="mt-7 w-full rounded-xl bg-[#3182F6] py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1B64DA] focus:outline-none"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
