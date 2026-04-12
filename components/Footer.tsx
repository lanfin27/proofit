import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E8EB] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <Link
              href="/"
              className="text-lg font-extrabold text-[#3182F6] tracking-tight"
            >
              Proofit
            </Link>
            <p className="mt-2 text-sm text-[#8B95A1] max-w-sm leading-relaxed">
              공인회계사 출신 팀이 강사의 실제 수익을 확인합니다.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#4E5968]">
              <Link
                href="/about"
                className="hover:text-[#191F28] transition-colors duration-150"
              >
                팀소개
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#191F28] transition-colors duration-150"
              >
                이용약관
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#191F28] transition-colors duration-150"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/faq"
                className="hover:text-[#191F28] transition-colors duration-150"
              >
                자주 묻는 질문
              </Link>
            </div>
            <p className="text-sm text-[#8B95A1]">
              문의:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-[#191F28] transition-colors duration-150"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
        <p className="text-xs text-[#B0B8C1] mt-6">
          © 2026 Proofit. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
