import { createClient } from '@/lib/supabase/server'

export const ADMIN_EMAIL = 'macrohand27@gmail.com'

export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.email ?? null
  } catch {
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const email = await getCurrentUserEmail()
  return email === ADMIN_EMAIL
}
