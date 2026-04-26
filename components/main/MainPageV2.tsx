import Image from 'next/image'
import Link from 'next/link'
import { getInstructors, getStats } from '@/lib/data'
import {
  getAllPublishedReportInstructors,
  getRecentPublishedReportInstructors,
} from '@/lib/instructor-mapping'
import { getReport } from '@/lib/report-data'
import InstructorList from '@/components/InstructorList'
import LandingCTA from '@/components/LandingCTA'
import InstructorRequestTrigger from '@/components/InstructorRequestTrigger'
import InstructorApplicationTrigger from '@/components/InstructorApplicationTrigger'
import FAQSection from '@/components/FAQSection'
import GatedInstructorsLink from '@/components/GatedInstructorsLink'
import LoginGateTrigger from '@/components/LoginGateTrigger'
import LandingVerifiedStat from '@/components/LandingVerifiedStat'
import {
  SpotlightReportCta,
  SpotlightVideoCard,
} from '@/components/main/SpotlightGatedActions'

// Carried over verbatim from app/page.tsx — same definitions live in
// the legacy branch so behaviour stays identical when the flag flips.
function ValueCard({
  metric,
  title,
  description,
}: {
  metric: string
  title: string
  description: string
}) {
  return (
    <div>
      <p className="text-[1.75rem] md:text-[2rem] font-extrabold text-[#3182F6] tracking-tight tabular-nums leading-none">
        {metric}
      </p>
      <h3 className="mt-3 text-base font-semibold text-[#191F28]">{title}</h3>
      <p className="mt-1 text-sm text-[#4E5968] leading-relaxed">{description}</p>
    </div>
  )
}

function formatPriceShort(value: number): string {
  if (value >= 10000) {
    const man = value / 10000
    return `${man % 1 === 0 ? man : man.toFixed(1)}만`
  }
  return `${value.toLocaleString('ko-KR')}`
}

type Props = {
  gateParam?: string | null
}

/**
 * v2 main landing page. Server component.
 *
 * Scope of v2: ONLY the hero head (h1 + lede). The rest of the
 * page — stats row, instructor list, ValueCard band, social proof,
 * dark hooking section, instructor application banner, FAQ, sticky
 * LandingCTA — is the same markup that app/page.tsx renders in its
 * legacy branch, so the two flag states differ only in hero
 * typography.
 *
 * privateSlug never crosses into client output: this file does not
 * touch any report-side Instructor object.
 */
export default async function MainPageV2({ gateParam }: Props) {
  const [instructors, stats] = await Promise.all([
    getInstructors({ sort: 'requests' }),
    getStats(),
  ])

  const recentPublished = getRecentPublishedReportInstructors(7)
  const allPublished = getAllPublishedReportInstructors()
  const supabaseById = new Map(instructors.map((s) => [s.id, s]))

  const spotlight = recentPublished[0] ?? null
  const spotlightReport = spotlight ? getReport(spotlight.slug) : null

  const previewInstructors = instructors.slice(0, 10)
  const verifiedCount = instructors.filter((i) => i.is_verified).length
  const totalPlatforms = new Set(
    instructors.flatMap((i) => i.platforms)
  ).size

  // 가격 범위 계산 (전체 강사의 최저~최고)
  const allPrices = instructors
    .flatMap((i) => [i.price_min, i.price_max])
    .filter((p): p is number => p !== null && p > 0)
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : null

  return (
    <div>
      <LoginGateTrigger gate={gateParam ?? null} />

      {/* Hero — v2 카피 + v2 typography */}
      <section className="pt-10 md:pt-16 lg:pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="main-page-hero">
            <h1>
              강사가 정말 그 돈을 벌었는지,
              <br />
              <span className="accent">Proofit이 직접 확인합니다.</span>
            </h1>
            <p className="main-page-hero-lede">
              진위확인된 국세청 증빙을 통해 확인된 수익만 공개합니다.
            </p>
          </div>

          {/* v2 spotlight + verified-grid (위치 B: 헤드라인 다음, 통계 앞) */}
          <div className="main-v2-section">
            {spotlight && spotlightReport && (
              <div className="spotlight-wrap">
                <div className="spotlight-ribbon">신규 수익확인 완료</div>
                <div className="spotlight">
                  <div className="sp-left">
                    <div className="sp-profile">
                      <div className="sp-avatar">
                        {spotlight.profileImage ? (
                          <Image
                            src={spotlight.profileImage}
                            alt={spotlight.name}
                            width={56}
                            height={56}
                            priority
                          />
                        ) : (
                          <span>{spotlight.initial}</span>
                        )}
                      </div>
                      <div className="sp-profile-meta">
                        <div className="sp-name">{spotlight.name}</div>
                        <div className="sp-tags">
                          {spotlight.tags.map((tag) => (
                            <span key={tag} className="sp-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sp-number-label">
                      {spotlightReport.hero.cumulativeAdRevenue.label}
                    </div>
                    <div className="sp-number">
                      {spotlightReport.hero.cumulativeAdRevenue.valueNumber}
                      <span className="unit">
                        {spotlightReport.hero.cumulativeAdRevenue.valueUnit}
                      </span>
                    </div>
                    <div className="sp-number-sub">
                      {spotlightReport.hero.cumulativeAdRevenue.sub}
                    </div>

                    <div className="sp-evidence">
                      <div className="sp-ev-group-label">확인 근거</div>
                      <div className="sp-ev-chips">
                        {spotlightReport.hero.stats.taxDocs.map((doc) => (
                          <span key={doc} className="sp-ev-chip">
                            {doc}
                          </span>
                        ))}
                        {spotlightReport.hero.stats.platformDocs.map((doc) => (
                          <span key={doc} className="sp-ev-chip">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sp-ctas">
                      <SpotlightReportCta slug={spotlight.slug} />
                    </div>
                  </div>

                  <div className="sp-right">
                    <SpotlightVideoCard
                      videoUrl={spotlightReport.hero.videoUrl}
                    />
                  </div>
                </div>
              </div>
            )}

            <section className="sec-verified">
              <div className="sec-head">
                <div className="sec-head-left">
                  <div className="sec-label">수익확인 완료</div>
                  <div className="sec-title">실제 수익이 확인된 강사</div>
                  <div className="sec-sub">
                    진위확인된 국세청 증빙으로 수익을 확인한 강사
                  </div>
                </div>
              </div>

              <div className="verified-grid">
                {allPublished.map((inst) => {
                  const supa = inst.supabaseId
                    ? supabaseById.get(inst.supabaseId)
                    : null
                  const report = getReport(inst.slug)
                  const heroNumber = report?.hero.cumulativeAdRevenue
                  const priceValue = supa?.price_min ?? supa?.price_avg ?? null
                  const price =
                    priceValue !== null && priceValue > 0
                      ? `${priceValue.toLocaleString('ko-KR')}원`
                      : null

                  return (
                    <Link
                      key={inst.slug}
                      href={`/reports/${inst.slug}`}
                      className="vc"
                    >
                      <div className="vc-top">
                        <div className="vc-avatar">
                          {inst.profileImage ? (
                            <Image
                              src={inst.profileImage}
                              alt={inst.name}
                              width={44}
                              height={44}
                            />
                          ) : (
                            <span>{inst.initial}</span>
                          )}
                        </div>
                        <div className="vc-name-wrap">
                          <div className="vc-name-row">
                            <div className="vc-name">{inst.name}</div>
                            <span className="vc-verified-badge">확인 완료</span>
                          </div>
                          <div className="vc-tags">
                            {inst.tags.map((tag) => (
                              <span key={tag} className="vc-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {heroNumber && (
                        <div className="vc-number-wrap">
                          <div className="vc-number-label">
                            확인된 {heroNumber.label}
                          </div>
                          <div className="vc-number">
                            {heroNumber.valueNumber}
                            <span className="unit">{heroNumber.valueUnit}</span>
                          </div>
                        </div>
                      )}

                      <div className="vc-evidence">
                        <span className="vc-ev-chip primary">국세청 증빙</span>
                        {report?.hero.stats.platformDocs.map((doc) => (
                          <span key={doc} className="vc-ev-chip">
                            {doc} 정산서
                          </span>
                        ))}
                      </div>

                      <div className="vc-footer">
                        <div className="vc-price">
                          {price ? (
                            <>
                              강의료 <strong>{price}</strong>
                            </>
                          ) : (
                            <>강의 정보 확인 중</>
                          )}
                        </div>
                        <span className="vc-cta">리포트 보기</span>
                      </div>
                    </Link>
                  )
                })}

                <div className="vc-placeholder">
                  <div className="vc-placeholder-icon">+</div>
                  <div className="vc-placeholder-title">
                    다음 강사 검증 진행 중
                  </div>
                  <div className="vc-placeholder-desc">
                    공인회계사 출신 팀이 강사들의 실제 수익을 검증하고 있습니다.
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 통계 — 기존 그대로 */}
          <div className="mt-10 flex gap-10 md:gap-16">
            <div>
              <p className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#3182F6] tracking-tight tabular-nums leading-none">
                {stats.instructorCount > 0
                  ? `${stats.instructorCount}명`
                  : '—'}
              </p>
              <p className="text-sm text-[#8B95A1] mt-2">총 강사</p>
            </div>
            <LandingVerifiedStat count={verifiedCount} totalCount={stats.instructorCount} />
          </div>
        </div>
      </section>

      {/* 강사 카드 — 히어로 바로 아래, 타이트하게 */}
      <section className="pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#191F28]">강사 리스트</h2>
            <GatedInstructorsLink className="text-sm font-medium text-[#3182F6] hover:text-[#1B64DA] transition-colors duration-150">
              전체 보기 →
            </GatedInstructorsLink>
          </div>

          <InstructorList
            instructors={previewInstructors}
            requireLoginOnClick
          />

          {/* 강사 요청 — 컴팩트하게 */}
          <InstructorRequestTrigger />
        </div>
      </section>

      {/* 왜 Proofit인가 — 숫자 강조 */}
      <section className="bg-[#F2F4F6] py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            metric={totalPlatforms > 0 ? `${totalPlatforms}개` : '여러'}
            title="플랫폼 강의를 한 곳에"
            description="클래스101, 크몽, 유튜브, 탈잉의 강의를 통합했습니다."
          />
          <ValueCard
            metric={
              minPrice && maxPrice
                ? `${formatPriceShort(minPrice)}~${formatPriceShort(maxPrice)}`
                : '비교'
            }
            title="강의료를 한눈에 비교"
            description="같은 분야 강사의 강의료를 나란히 비교할 수 있습니다."
          />
          <ValueCard
            metric="강사수익확인"
            title="공인회계사가 직접 확인"
            description="M&A 재무실사 방법론으로 강사의 실제 수익을 확인합니다."
          />
        </div>
      </section>

      {/* 사회적 증거 (10건 이상) */}
      {stats.requestCount >= 10 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-base text-[#4E5968]">
              지금까지{' '}
              <span className="font-bold text-[#3182F6]">
                {stats.requestCount.toLocaleString('ko-KR')}명
              </span>
              의 수강생이 강사의 수익확인을 요청했습니다
            </p>
          </div>
        </section>
      )}

      {/* 후킹 + 신뢰 — 다크 배경 */}
      <section className="bg-[#3182F6] py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-[2.25rem] lg:text-[2.75rem] font-extrabold text-white leading-[1.25] tracking-[-0.02em]">
            아직도 수익 확인 안된
            <br />
            강사의 고가강의에
            <br className="md:hidden" />
            {' '}
            돈을 쓰고 계신가요?
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
            공인회계사 출신 팀이 강사의 실제 수익을
            <br className="hidden md:block" />
            {' '}
            공식 서류로 직접 확인합니다.
          </p>
        </div>
      </section>

      {/* 강사 신청 배너 */}
      <section className="py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-t border-[#E5E8EB]">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-base md:text-lg font-bold text-[#191F28]">
              진짜 강사라면 수익을 증명하세요
            </p>
            <p className="text-sm text-[#8B95A1] mt-1">
              현재 무료로 수익확인을 진행하고 있습니다.
            </p>
          </div>
          <InstructorApplicationTrigger />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#191F28] text-center">
            자주 묻는 질문
          </h2>
          <div className="mt-8">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* 모바일 하단 고정 바 */}
      <LandingCTA />
    </div>
  )
}
