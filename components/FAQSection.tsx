'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '누가 확인하나요?',
    a: '공인회계사 출신 팀이 직접 진행합니다. 기업 인수합병(M&A)에서 사용하는 재무실사 방법론을 강사에게 적용합니다.',
  },
  {
    q: '무엇을 확인하나요?',
    a: '소득금액증명원, 부가가치세 신고서 등 국세청 공식 서류를 기반으로 강사의 실제 수익을 확인합니다. 강의에서 주장하는 수익과 실제 소득이 일치하는지, 그리고 수강생이 지불하는 강의료가 적정한 수준인지를 검토합니다.',
  },
  {
    q: '확인된 강사는 어떻게 구분하나요?',
    a: "수익이 확인된 강사에게는 '확인' 뱃지가 부여되며, 강사 상세 페이지에서 확인된 항목을 볼 수 있습니다.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={faq.q}
            className="bg-[#F2F4F6] rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
            >
              <span className="text-[15px] font-semibold text-[#191F28]">
                {faq.q}
              </span>
              <span
                className={`text-[#8B95A1] ml-4 flex-shrink-0 text-xl leading-none transition-transform duration-200 ${
                  isOpen ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-5">
                <p className="text-sm text-[#4E5968] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
