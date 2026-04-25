import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getReportInstructor, getReport } from '@/lib/report-data'
import { canViewDraft, isProductionDeployment } from '@/lib/env'
import DraftBanner from '@/components/report/DraftBanner'
import ReportHero from '@/components/report/ReportHero'
import PartDivider from '@/components/report/PartDivider'
import ReportClaims from '@/components/report/ReportClaims'
import ReportBusinessFinance from '@/components/report/ReportBusinessFinance'
import ReportProcess from '@/components/report/ReportProcess'
import ReportFactChecklist from '@/components/report/ReportFactChecklist'
import ReportDocuments from '@/components/report/ReportDocuments'
import ReportAction from '@/components/report/ReportAction'
import ReportPayback from '@/components/report/ReportPayback'
import ReportLegal from '@/components/report/ReportLegal'
import './report.css'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const instructor = getReportInstructor(params.slug)

  if (!instructor) {
    return { title: 'Proofit', robots: { index: false } }
  }

  const accessedViaPrivateSlug = params.slug === instructor.privateSlug

  // 정식 슬러그 + published + 프로덕션에서만 인덱싱 허용.
  // 비밀 슬러그는 어떤 환경에서도 noindex.
  const canIndex =
    !accessedViaPrivateSlug &&
    instructor.status === 'published' &&
    isProductionDeployment()

  return {
    title: `${instructor.name} · 수익확인 완료 | Proofit`,
    description: `공인회계사 출신 팀이 직접 확인한 ${instructor.name} 강사의 수익 리포트.`,
    robots: { index: canIndex, follow: canIndex },
  }
}

export default function ReportPage({ params }: PageProps) {
  const instructor = getReportInstructor(params.slug)

  if (!instructor) {
    notFound()
  }

  const accessedViaPrivateSlug = params.slug === instructor.privateSlug

  // published 상태에서 비밀 슬러그로 접근 시 정식 슬러그로 영구 리다이렉트
  if (accessedViaPrivateSlug && instructor.status === 'published') {
    redirect(`/reports/${instructor.slug}`)
  }

  // 정식 슬러그 + draft + 프로덕션 → 404
  // (비밀 슬러그는 어떤 환경에서도 통과 — 사전 공유 목적)
  if (
    !accessedViaPrivateSlug &&
    instructor.status !== 'published' &&
    !canViewDraft()
  ) {
    notFound()
  }

  const report = getReport(params.slug)

  if (!report) {
    notFound()
  }

  return (
    <div className="report-page">
      <DraftBanner
        status={instructor.status}
        accessedViaPrivateSlug={accessedViaPrivateSlug}
      />
      <div className="app">
        <ReportHero instructor={instructor} hero={report.hero} />

        <PartDivider
          num="01"
          title="확인 결과"
          desc="강사 주장 · 수익 확인"
        />
        <ReportClaims data={report.claims} />
        <ReportBusinessFinance data={report.businessFinance} />

        <PartDivider
          num="02"
          title="확인 절차"
          desc="표준 3단계 · 체크리스트 · 자료"
        />
        <ReportProcess steps={report.process} />
        <ReportFactChecklist items={report.factChecklist} />
        <ReportDocuments data={report.documents} />
        <ReportAction data={report.action} />

        <PartDivider
          num="03"
          title="강의료 판단"
          desc="회수 기간 시뮬레이션"
        />
        <ReportPayback data={report.payback} />

        <ReportLegal
          data={report.legal}
          reportVersion={instructor.reportVersion}
          reportCompletedAt={instructor.reportCompletedAt}
        />
      </div>
    </div>
  )
}
