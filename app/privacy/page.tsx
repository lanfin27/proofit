import { Metadata } from 'next'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: '개인정보처리방침 | Proofit',
  description: 'Proofit 개인정보처리방침입니다.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        개인정보처리방침
      </h1>
      <p className="mt-2 text-sm text-[#8B95A1]">시행일: 2026년 4월 11일</p>

      <div className="mt-10 space-y-10 text-base text-[#4E5968] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            1. 수집하는 개인정보
          </h2>
          <p className="mt-2">
            카카오 로그인: 닉네임, 프로필 사진(필수), 이메일(선택)
          </p>
          <p className="mt-2">구글 로그인: 이름, 이메일, 프로필 사진</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            2. 수집 목적
          </h2>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>서비스 회원 식별 및 관리</li>
            <li>확인 요청 기능 제공</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            3. 보관 기간
          </h2>
          <p className="mt-2">회원 탈퇴 시 즉시 삭제합니다.</p>
          <p className="mt-2">
            단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            4. 제3자 제공
          </h2>
          <p className="mt-2">
            이용자의 개인정보를 제3자에게 제공하지 않습니다.
          </p>
          <p className="mt-2">
            단, 법률에 의한 요청이 있는 경우 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            5. 개인정보 보호책임자
          </h2>
          <p className="mt-2">
            이메일:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">6. 시행일</h2>
          <p className="mt-2">
            이 개인정보처리방침은 2026년 4월 11일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  )
}
