import Image from 'next/image'
import Link from 'next/link'
import { getInstructors } from '@/lib/data'
import {
  getAllPublishedReportInstructors,
  getRecentPublishedReportInstructors,
  getAllMappedSupabaseIds,
} from '@/lib/instructor-mapping'
import { getReport } from '@/lib/report-data'
import type { InstructorSummary } from '@/lib/types'
import FAQSection from '@/components/FAQSection'
import LandingCTA from '@/components/LandingCTA'
import MainStudentCta from './MainStudentCta'
import MainInstructorCta from './MainInstructorCta'

const VIDEO_DURATION_FALLBACK = '1분 12초'

function formatPrice(value: number | null): string | null {
  if (value === null || value === 0) return null
  return `${value.toLocaleString('ko-KR')}원`
}

function formatPriceLabel(s: InstructorSummary): {
  label: string
  value: string | null
} {
  if (s.course_count <= 1 || s.price_avg === null) {
    return { label: '강의료', value: formatPrice(s.price_min ?? s.price_avg) }
  }
  return { label: '평균 강의료', value: formatPrice(s.price_avg) }
}

/**
 * v2 main landing page. Server component. Pulls Supabase instructor
 * rows + the report-side data file and merges them by supabaseId.
 *
 * privateSlug never crosses into client output: this file only reads
 * scalar fields off Instructor, and the only client components used
 * (MainStudentCta, MainInstructorCta) take no props.
 */
export default async function MainPageV2() {
  const supabaseInstructors = await getInstructors({ sort: 'requests' })

  const recentPublished = getRecentPublishedReportInstructors(7)
  const allPublished = getAllPublishedReportInstructors()
  const mappedIds = getAllMappedSupabaseIds()

  const supabaseById = new Map(supabaseInstructors.map((s) => [s.id, s]))

  const waitingInstructors = supabaseInstructors
    .filter((s) => !mappedIds.has(s.id))
    .slice(0, 6)

  const spotlight = recentPublished[0] ?? null
  const spotlightReport = spotlight ? getReport(spotlight.slug) : null

  return (
    <div className="main-page">
      <div className="container">
        {/* HERO */}
        <section className="hero">
          <div className="hero-head">
            <h1>
              강사가 정말 그 돈을 벌었는지,
              <br />
              <span className="accent">Proofit이 직접 확인합니다.</span>
            </h1>
            <p className="lede">
              진위확인된 국세청 증빙을 통해 확인된 수익만 공개합니다.
            </p>
          </div>

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
                    <Link
                      href={`/reports/${spotlight.slug}`}
                      className="sp-cta-primary"
                    >
                      확인 리포트 보기 →
                    </Link>
                  </div>
                </div>

                <div className="sp-right">
                  <a
                    href={spotlightReport.hero.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-video"
                  >
                    <div className="sp-video-play"></div>
                    <div className="sp-video-caption">
                      <div className="t1">▶ 진위확인 영상 보기</div>
                      <div className="t2">
                        {spotlightReport.hero.videoDurationLabel ??
                          VIDEO_DURATION_FALLBACK}{' '}
                        · Proofit 검증
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 수익확인 완료 */}
        <section className="sec-verified">
          <div className="sec-head">
            <div className="sec-head-left">
              <div className="sec-label">수익확인 완료</div>
              <div className="sec-title">
                실제 수익이 확인된{' '}
                <span className="count">강사 {allPublished.length}명</span>
              </div>
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
              const price = supa
                ? formatPrice(supa.price_min ?? supa.price_avg)
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

        {/* 확인 요청 대기 */}
        {waitingInstructors.length > 0 && (
          <section className="sec-waiting">
            <div className="sec-head">
              <div className="sec-head-left">
                <div className="sec-title">확인 요청 대기 중</div>
                <div className="sec-sub">
                  학생들이 수익확인을 요청하고 있는 강사
                </div>
              </div>
            </div>

            <div className="waiting-grid">
              {waitingInstructors.map((s) => {
                const price = formatPriceLabel(s)
                const courseLabel =
                  s.course_count > 0 ? ` · ${s.course_count}개 강의` : ''
                const platformText =
                  s.platforms.length > 0 ? s.platforms[0] : '플랫폼 정보 없음'
                return (
                  <Link
                    key={s.id}
                    href={`/instructors/${s.id}`}
                    className="wc"
                  >
                    <div className="wc-top">
                      <div className="wc-info">
                        <div className="wc-name">{s.display_name}</div>
                        {s.categories.length > 0 && (
                          <div className="wc-tags">
                            {s.categories.slice(0, 3).map((cat) => (
                              <span key={cat} className="wc-tag">
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="wc-meta">
                          {platformText}
                          {courseLabel}
                        </div>
                      </div>
                    </div>
                    <div className="wc-bottom">
                      <div className="wc-bottom-left">
                        <div className="wc-price-label">{price.label}</div>
                        <div className="wc-price">{price.value ?? '—'}</div>
                      </div>
                      {s.verification_count > 0 && (
                        <span className="wc-request">
                          <span className="count">
                            {s.verification_count}명
                          </span>{' '}
                          확인 요청 중
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <MainStudentCta />

        <div className="faq-wrap">
          <h2 className="faq-wrap-title">자주 묻는 질문</h2>
          <FAQSection />
        </div>

        <MainInstructorCta />

        <div className="footer">
          <strong>Proofit.</strong> 공인회계사팀이 수행하는 업무상 참고
          분석입니다. 공인회계사법상 인증업무가 아니며 법적 효력이 없습니다.
          <br />
          proofit.co.kr
        </div>
      </div>

      <LandingCTA />
    </div>
  )
}
