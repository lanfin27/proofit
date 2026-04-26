import { alphanamInstructor } from '@/data/reports/alphanam'
import type { Instructor } from '@/lib/report-types'

const ALL_INSTRUCTORS: Instructor[] = [alphanamInstructor]

/**
 * All instructors with a published report. Used by the main landing
 * verified grid; intentionally returns an empty array when nothing is
 * published yet so the caller can render its placeholder state.
 */
export function getAllPublishedReportInstructors(): Instructor[] {
  return ALL_INSTRUCTORS.filter((i) => i.status === 'published')
}

/**
 * Subset of published instructors whose report shipped within the
 * given window (default 7 days). Drives the main landing spotlight —
 * meant to surface "new" reports, so an instructor without
 * publishedAt or one published earlier than the window is omitted.
 */
export function getRecentPublishedReportInstructors(
  daysWindow = 7
): Instructor[] {
  const cutoff = Date.now() - daysWindow * 86_400_000
  return ALL_INSTRUCTORS.filter((i) => {
    if (i.status !== 'published') return false
    if (!i.publishedAt) return false
    return new Date(i.publishedAt).getTime() >= cutoff
  })
}

/**
 * Set of Supabase ids that have a report mapping (any status). Used
 * by the main landing waiting grid to filter out instructors that
 * already appear in the verified section.
 */
export function getAllMappedSupabaseIds(): Set<string> {
  const ids = ALL_INSTRUCTORS.map((i) => i.supabaseId).filter(
    (id): id is string => Boolean(id)
  )
  return new Set(ids)
}

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
