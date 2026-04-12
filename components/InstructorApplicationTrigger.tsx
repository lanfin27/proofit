'use client'

import { useState } from 'react'
import InstructorApplicationModal from '@/components/InstructorApplicationModal'

/**
 * "수익확인 신청하기" 버튼 + 모달 — 강사용 CTA.
 * 랜딩/About 등 서버 컴포넌트에서 사용 가능한 클라이언트 래퍼.
 */
export default function InstructorApplicationTrigger({
  variant = 'button',
}: {
  variant?: 'button' | 'link'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 inline-flex items-center justify-center px-6 py-3 bg-[#191F28] text-white text-sm font-semibold rounded-xl hover:bg-[#333D4B] transition-colors duration-150 focus:outline-none"
        >
          확인 신청하기 →
        </button>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-[#191F28] text-white text-sm font-semibold rounded-xl hover:bg-[#333D4B] transition-colors duration-150 focus:outline-none"
        >
          수익확인 신청하기 →
        </button>
      )}

      <InstructorApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
