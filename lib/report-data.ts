import { alphanamInstructor, alphanamReport } from '@/data/reports/alphanam'
import type { ReportInstructor, Report } from '@/lib/report-types'

const instructors: ReportInstructor[] = [alphanamInstructor]
const reports: Report[] = [alphanamReport]

export function getReportInstructor(
  slug: string
): ReportInstructor | undefined {
  return instructors.find((i) => i.slug === slug)
}

export function getReport(slug: string): Report | undefined {
  return reports.find((r) => r.instructorSlug === slug)
}

export function getAllReportInstructors(): ReportInstructor[] {
  return instructors
}
