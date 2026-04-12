import { Metadata } from 'next'
import { CONTACT_EMAIL } from '@/lib/constants'
import InstructorApplicationTrigger from '@/components/InstructorApplicationTrigger'

export const metadata: Metadata = {
  title: '팀소개 | Proofit',
  description:
    '공인회계사 출신 팀이 강사의 실제 수익을 직접 확인합니다. Proofit이 만들어진 이유와 수익확인 프로세스를 소개합니다.',
}

interface ProcessStep {
  number: string
  title: string
  description: string
}

const PROCESS: ProcessStep[] = [
  {
    number: '01',
    title: '숫자를 증명할 수 있는가?',
    description: '소득금액증명원, 부가세 신고서, 플랫폼 정산 내역 등 공식 서류를 통해 실제 수익을 확인합니다.',
  },
  {
    number: '02',
    title: '진짜 이익은 얼마인가?',
    description: '매출이 크다고 돈을 버는 게 아닙니다. 광고비, 촬영비, 플랫폼 수수료, 외주비 등 비용을 빼고 실제로 남는 돈이 얼마인지 확인합니다.',
  },
  {
    number: '03',
    title: '그 숫자의 원천이 어디인가?',
    description: '강의 매출을 유튜브 수익으로 둔갑시킨 건 아닌지, 수입의 실제 출처를 확인합니다. 유튜브, 컨설팅, 오프라인 강의, 디지털 상품 등 수입원의 구성을 검토합니다.',
  },
  {
    number: '04',
    title: '그래서 이 강의료가 합당한가?',
    description: '강사의 실제 수익 규모와 사업 가치를 기반으로, 수강생이 지불하는 강의료가 적정한 수준인지 평가합니다.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* 1. 왜 Proofit을 만들었나요 */}
      <section>
        <h1 className="text-[1.375rem] md:text-2xl font-bold text-[#191F28] leading-[1.4] tracking-tight">
          왜 Proofit을 만들었나요
        </h1>
        <div className="mt-5 space-y-5 text-base md:text-[1.0625rem] text-[#4E5968] font-medium leading-relaxed">
          <p>
            비즈니스 강의 시장에는 &lsquo;강의팔이&rsquo;라 불리는 사기 강사가 넘쳐납니다. <br className="hidden md:block" />
            실제로 돈을 벌어본 적 없으면서 &lsquo;월 1억&rsquo;을 벌었다고 주장하며 고가 강의를 판매하는 사람들 때문에, 진짜 실력 있는 강사들까지 의심받고 있습니다.
          </p>
          <p>
            Proofit은 이 문제를 해결하기 위해 만들어졌습니다.
          </p>
          <div className="bg-[#E8F3FF] rounded-2xl p-6 md:p-7 text-[#191F28]">
            <p className="font-semibold text-[#3182F6] mb-2 text-sm md:text-base">Proofit(푸루핏)의 의미</p>
            <p className="text-[0.9375rem] md:text-base">
              <span className="font-bold">증명(Proof)</span>과 <span className="font-bold">순이익(Profit)</span>의 합성어로,<br className="md:hidden" />
              부풀린 매출이 아닌 <span className="underline decoration-[#3182F6]/30 decoration-2 underline-offset-4">&lsquo;증명된 진짜 순이익&rsquo;</span>이라는 뜻입니다.
            </p>
          </div>
          <p>
            이를 위해 <span className="font-bold text-[#191F28]">대형 회계법인 및 비즈니스 실사 경험이 풍부한 공인회계사 팀</span>이 뭉쳤습니다.<br className="hidden md:block" />
            기업의 가치를 엄격하게 평가하는 전문가의 시선으로 기만적인 수치를 걷어내고,<br className="hidden md:block" />
            수강생에게는 투명한 수익 검증을, 진짜 실력 있는 강사에게는 객관적인 증명의 기회를 제공합니다.
          </p>
        </div>
      </section>

      {/* 2. 문제 제기 (사실 새로운 문제가 아닙니다) */}
      <section className="mt-20">
        <h2 className="text-[1.375rem] md:text-2xl font-bold text-[#191F28] tracking-tight">
          사실 새로운 문제가 아닙니다
        </h2>
        
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 회사를 사고팔 때 */}
          <div className="bg-[#E8F3FF] md:bg-[#F2F4F6] rounded-2xl p-6 md:p-8 flex flex-col h-full">
            <p className="text-sm font-semibold text-[#3182F6]">회사를 사고팔 때</p>
            
            <div className="mt-6 space-y-8 flex-1">
              <div>
                <p className="text-[#191F28] font-bold text-[1.125rem]">&quot;이 매출 진짜야?&quot;</p>
                <p className="text-[#4E5968] mt-2 text-[0.9375rem] flex gap-2 font-medium">
                  <span className="text-[#3182F6]">→</span> 회계사가 장부를 까봄 (실사)
                </p>
              </div>
              <div>
                <p className="text-[#191F28] font-bold text-[1.125rem]">&quot;이 가격 적정해?&quot;</p>
                <p className="text-[#4E5968] mt-2 text-[0.9375rem] flex gap-2 font-medium">
                  <span className="text-[#3182F6]">→</span> 밸류에이션으로 검증
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#3182F6]/10 md:border-[#D1D6DB]">
              <p className="text-[#3182F6] font-semibold flex items-center gap-2 text-[0.9375rem]">
                <span className="text-lg leading-none shrink-0">✓</span> 이 절차 없이 회사 사는 사람 없음
              </p>
            </div>
          </div>

          {/* 강의를 사고팔 때 */}
          <div className="bg-[#FFF4F4] rounded-2xl p-6 md:p-8 flex flex-col h-full">
            <p className="text-sm font-semibold text-[#F04452]">강의를 사고팔 때</p>
            
            <div className="mt-6 space-y-8 flex-1">
              <div>
                <p className="text-[#191F28] font-bold text-[1.125rem]">&quot;월 5천 벌었어요&quot;</p>
                <p className="text-[#4E5968] mt-2 text-[0.9375rem] flex gap-2 font-medium">
                  <span className="text-[#F04452]">→</span> 까보는 사람 없음
                </p>
              </div>
              <div>
                <p className="text-[#191F28] font-bold text-[1.125rem]">&quot;강의료 200만원&quot;</p>
                <p className="text-[#4E5968] mt-2 text-[0.9375rem] flex gap-2 font-medium">
                  <span className="text-[#F04452]">→</span> 적절한지 판단할 근거 없음
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#F04452]/10">
              <p className="text-[#F04452] font-semibold flex items-center gap-2 text-[0.9375rem]">
                <span className="text-xl leading-none shrink-0 transform translate-y-[-1px]">✕</span> 아무도 검증하지 않음
              </p>
            </div>
          </div>
        </div>

        {/* 인용구 */}
        <div className="mt-6 bg-[#F2F4F6] rounded-2xl p-6 md:p-8 flex items-start gap-4">
          <div className="w-1 bg-[#D1D6DB] self-stretch rounded-full shrink-0" />
          <div>
            <p className="text-[#4E5968] font-medium text-base md:text-[1.125rem] italic leading-relaxed">
              &quot;돈도 안 벌어본 사람이 월 1억 번다며 강의를 팝니다.&quot;
            </p>
            <p className="text-[#8B95A1] text-sm mt-3 font-medium">
              — KBS 추적60분, 강의팔이·성공팔이 특집
            </p>
          </div>
        </div>
      </section>

      {/* 수익확인 프로세스 */}
      <section className="mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
          무엇을 확인하나요?
        </h2>
        <p className="mt-3 text-base md:text-lg text-[#4E5968] leading-relaxed">
          자본시장에서 검증된 그 방법론을, 강사에게 그대로 적용합니다.
        </p>
        <div className="mt-8 space-y-4">
          {PROCESS.map((step) => (
            <div key={step.number} className="bg-[#F2F4F6] rounded-2xl p-6 md:p-8">
              <p className="text-sm font-bold text-[#3182F6] tabular-nums">
                {step.number}
              </p>
              <h3 className="text-[1.125rem] md:text-xl font-bold text-[#191F28] mt-2">
                {step.title}
              </h3>
              <p className="text-[#4E5968] mt-3 text-[0.9375rem] md:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 강사 신청 */}
      <section className="mt-16 border-t border-[#E5E8EB] pt-10">
        <h3 className="text-xl md:text-2xl font-bold text-[#191F28] tracking-tight">
          강사이신가요?
        </h3>
        <p className="mt-2 text-base text-[#4E5968] leading-relaxed">
          진짜 강사라면 수익을 증명하세요.
          <br />
          공인회계사 출신 팀이 수익확인을 무료로 진행합니다.
        </p>
        <div className="mt-4">
          <InstructorApplicationTrigger variant="link" />
        </div>
      </section>

      {/* 문의 */}
      <section className="mt-16 border-t border-[#E5E8EB] pt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#191F28] tracking-tight">
          문의
        </h2>
        <p className="mt-4 text-base text-[#4E5968] leading-relaxed">
          서비스 관련 문의, 강사 등록 요청, 수익확인 신청은 아래 이메일로
          연락해주세요.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block mt-3 text-base font-semibold text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150"
        >
          {CONTACT_EMAIL}
        </a>
      </section>
    </div>
  )
}
