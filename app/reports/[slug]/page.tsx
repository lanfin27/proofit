import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getReportInstructor, getReport } from '@/lib/report-data'
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

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const instructor = getReportInstructor(params.slug)

  if (!instructor || instructor.status !== 'published') {
    return { title: 'Proofit', robots: { index: false } }
  }

  return {
    title: `${instructor.name} · 수익확인 완료 | Proofit`,
    description: `공인회계사 출신 팀이 직접 확인한 ${instructor.name} 강사의 수익 리포트.`,
    robots: { index: true },
  }
}

export default function ReportPage({ params }: PageProps) {
  const instructor = getReportInstructor(params.slug)

  if (!instructor || instructor.status !== 'published') {
    notFound()
  }

  const report = getReport(params.slug)

  if (!report) {
    notFound()
  }

  return (
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
  )
}
