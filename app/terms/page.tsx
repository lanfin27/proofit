import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | Proofit',
  description: 'Proofit 서비스 이용약관입니다.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
        이용약관
      </h1>
      <p className="mt-2 text-sm text-[#8B95A1]">시행일: 2026년 4월 11일</p>

      <div className="mt-10 space-y-10 text-base text-[#4E5968] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제1조 (목적)
          </h2>
          <p className="mt-2">
            이 약관은 Proofit(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 서비스
            제공자와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제2조 (서비스의 내용)
          </h2>
          <p className="mt-2">
            ① 서비스는 비즈니스 강의 강사의 정보를 수집, 비교하여 제공합니다.
          </p>
          <p className="mt-2">
            ② 서비스는 공인회계사 출신 팀의 분석을 통해 강사의 수익확인 현황을
            제공합니다.
          </p>
          <p className="mt-2">
            ③ 서비스에서 제공하는 정보는 투자 조언이 아니며, 강의 구매에 대한
            최종 판단은 이용자 본인에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제3조 (회원가입 및 탈퇴)
          </h2>
          <p className="mt-2">
            ① 이용자는 카카오 또는 구글 계정을 통해 회원가입할 수 있습니다.
          </p>
          <p className="mt-2">
            ② 이용자는 언제든지 서비스에서 회원 탈퇴를 요청할 수 있으며, 탈퇴 시
            개인정보는 즉시 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제4조 (금지행위)
          </h2>
          <p className="mt-2">① 허위 정보를 등록하거나 타인을 사칭하는 행위</p>
          <p className="mt-2">
            ② 서비스의 정보를 무단으로 수집, 복제, 배포하는 행위
          </p>
          <p className="mt-2">③ 서비스의 정상적인 운영을 방해하는 행위</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제5조 (면책)
          </h2>
          <p className="mt-2">
            ① 서비스는 강사가 제공한 정보의 정확성을 보증하지 않습니다.
          </p>
          <p className="mt-2">
            ② 서비스를 통해 이루어진 강의 구매에 대해 서비스는 책임을 지지
            않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">
            제6조 (준거법)
          </h2>
          <p className="mt-2">이 약관은 대한민국 법률에 따라 해석됩니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[#191F28]">부칙</h2>
          <p className="mt-2">이 약관은 2026년 4월 11일부터 시행됩니다.</p>
        </section>
      </div>
    </div>
  )
}
