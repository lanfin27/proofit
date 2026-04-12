import { Metadata } from 'next'
import FAQPageContent from './FAQPageContent'

export const metadata: Metadata = {
  title: '자주 묻는 질문 | Proofit',
  description: 'Proofit 서비스에 대해 자주 묻는 질문과 답변',
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#191F28]">
        자주 묻는 질문
      </h1>
      <div className="mt-8">
        <FAQPageContent />
      </div>
    </div>
  )
}
