'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '제출한 자료가 외부에 공개되나요?',
    a: '아닙니다. 모든 증빙 자료와 세부 내용은 외부에 일절 공개되지 않습니다. 오직 확인 결과만이 합당한 요청에 의해 공개되며, 그마저도 강사님 본인의 동의 하에서만 진행됩니다.',
  },
  {
    q: '확인은 어떤 방식으로 진행되나요?',
    a: '확인 과정은 영상 촬영을 통해 투명하게 진행됩니다. 다만 촬영된 영상의 유튜브 업로드 역시 강사 본인의 동의 하에서만 이루어지며, 동의하지 않을 경우 영상은 공개되지 않습니다.',
  },
  {
    q: '비용이 드나요?',
    a: '아닙니다. 현재 무료로 진행하고 있습니다. 원래 수백만 원 수준의 전문가 리뷰를, 시장 신뢰 재건을 위해 무료로 제공합니다.',
  },
  {
    q: '어떤 자료를 내야 하나요?',
    a: '소득금액증명원, 부가세 신고서 등 공식 서류를 기반으로 진행합니다. 답변 가능한 범위 내에서만 제출하시면 됩니다.',
  },
  {
    q: '누가 확인하나요?',
    a: '공인회계사 출신들이 직접 진행합니다. M&A에서 기업의 수익을 확인하는 재무실사와 가격의 적정성을 따지는 밸류에이션 방법론을 강사에게 적용합니다.',
  },
]

export default function FAQPageContent() {
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
