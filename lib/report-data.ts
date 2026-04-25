import { alphanamInstructor, alphanamReport } from '@/data/reports/alphanam'
import type { Instructor, Report } from '@/lib/report-types'

const instructors: Instructor[] = [alphanamInstructor]
const reports: Record<string, Report> = {
  alphanam: alphanamReport,
}

export function getReportInstructor(slug: string): Instructor | undefined {
  return instructors.find((i) => i.slug === slug)
}

export function getReport(slug: string): Report | undefined {
  return reports[slug]
}

export function getAllReportInstructors(): Instructor[] {
  return instructors
}
