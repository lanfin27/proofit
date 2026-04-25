import { alphanamInstructor } from '@/data/reports/alphanam'
import type { Instructor } from '@/lib/report-types'

const ALL_INSTRUCTORS: Instructor[] = [alphanamInstructor]

/**
 * Look up the report-side instructor record by the Supabase row id used
 * elsewhere in the site. Returns null when the instructor has no report
 * yet (most rows in Supabase).
 *
 * Server-only callers can use the returned object directly. Anything
 * that crosses into a client component must call toPublicInstructorInfo
 * first to drop privateSlug and other server-only fields.
 */
export function getReportInstructorBySupabaseId(
  supabaseId: string
): Instructor | null {
  return ALL_INSTRUCTORS.find((i) => i.supabaseId === supabaseId) ?? null
}

/**
 * Subset of Instructor that is safe to serialize into client component
 * props. Notably omits privateSlug to prevent the leak we hit earlier
 * when ProfileAvatar received the whole Instructor.
 */
export type PublicInstructorInfo = {
  slug: string
  name: string
  status: 'draft' | 'published'
  reportCompletedAt: string
}

export function toPublicInstructorInfo(
  instructor: Instructor
): PublicInstructorInfo {
  return {
    slug: instructor.slug,
    name: instructor.name,
    status: instructor.status,
    reportCompletedAt: instructor.reportCompletedAt,
  }
}
