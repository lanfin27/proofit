import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getReportInstructor, getReport } from '@/lib/report-data'
import { canViewDraft, isProductionDeployment } from '@/lib/env'
import ReportHero from '@/components/report/ReportHero'
import ReportClaims from '@/components/report/ReportClaims'
import ReportProcess from '@/components/report/ReportProcess'
import ReportChecklist from '@/components/report/ReportChecklist'
import ReportConsistency from '@/components/report/ReportConsistency'
import ReportPayback from '@/components/report/ReportPayback'
import ReportJudgment from '@/components/report/ReportJudgment'
import ReportDocuments from '@/components/report/ReportDocuments'
import ReportAction from '@/components/report/ReportAction'
import ReportDisclaimer from '@/components/report/ReportDisclaimer'
import DraftBanner from '@/components/report/DraftBanner'

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

  // 프로덕션 + published 조합에서만 색인 허용.
  // Preview/로컬은 published라도 검색엔진 노출 금지.
  const canIndex =
    instructor.status === 'published' && isProductionDeployment()

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

  // 프로덕션에서는 draft 차단. Preview/로컬에서는 검토 허용.
  if (instructor.status !== 'published' && !canViewDraft()) {
    notFound()
  }

  const report = getReport(params.slug)

  if (!report) {
    notFound()
  }

  return (
    <>
      <DraftBanner status={instructor.status} />
      <div className="max-w-[520px] mx-auto bg-white min-h-screen text-[15px] leading-[1.5] tracking-[-0.02em]">
        <ReportHero
          profile={report.profile}
          badges={report.badges}
          video={report.video}
          heroNumber={report.heroNumber}
          heroStats={report.heroStats}
        />
        <ReportClaims {...report.claims} />
        <ReportProcess {...report.process} />
        <ReportChecklist {...report.checklist} />
        <ReportConsistency {...report.consistency} />
        <ReportPayback {...report.payback} />
        <ReportJudgment {...report.judgment} />
        <ReportDocuments {...report.documents} />
        <ReportAction {...report.action} />
        <ReportDisclaimer
          disclaimer={report.disclaimer}
          meta={report.meta}
        />
      </div>
    </>
  )
}
