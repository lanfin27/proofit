/**
 * Toggle for the v2 instructor profile design.
 * Production stays on the existing design until this env var is set
 * to 'true' in Vercel; Preview/local default to enabled so reviewers
 * see the new layout without extra configuration.
 */
export function isNewProfileDesignEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_NEW_PROFILE_DESIGN === 'true') return true
  if (process.env.NEXT_PUBLIC_NEW_PROFILE_DESIGN === 'false') return false
  return process.env.VERCEL_ENV !== 'production'
}

/**
 * Toggle for the v2 main landing design. Same convention as the
 * profile flag — production opt-in, Preview/local default on.
 */
export function isNewMainDesignEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_NEW_MAIN_DESIGN === 'true') return true
  if (process.env.NEXT_PUBLIC_NEW_MAIN_DESIGN === 'false') return false
  return process.env.VERCEL_ENV !== 'production'
}
