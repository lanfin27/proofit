import { alphanamInstructor, alphanamReport } from '@/data/reports/alphanam'
import type { Instructor, Report } from '@/lib/report-types'

const instructors: Instructor[] = [alphanamInstructor]
const reports: Record<string, Report> = {
  alphanam: alphanamReport,
}

/**
 * slug 또는 privateSlug로 강사 조회. 정식 슬러그를 우선 매칭하고
 * 매칭이 없으면 비밀 슬러그로 한 번 더 시도한다.
 */
export function getReportInstructor(
  slugOrPrivate: string
): Instructor | undefined {
  const byPublic = instructors.find((i) => i.slug === slugOrPrivate)
  if (byPublic) return byPublic

  return instructors.find((i) => i.privateSlug === slugOrPrivate)
}

/**
 * 입력된 값이 어떤 강사의 비밀 슬러그인지 판별
 */
export function isPrivateSlug(slugOrPrivate: string): boolean {
  return instructors.some((i) => i.privateSlug === slugOrPrivate)
}

export function getReport(slug: string): Report | undefined {
  const instructor = getReportInstructor(slug)
  if (!instructor) return undefined
  return reports[instructor.slug]
}

export function getAllReportInstructors(): Instructor[] {
  return instructors
}
