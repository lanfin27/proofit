'use client'

import { useState, useEffect } from 'react'
import { InstructorSummary } from '@/lib/types'
import InstructorCard from '@/components/InstructorCard'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

interface InstructorListProps {
  instructors: InstructorSummary[]
  /**
   * If true, clicking a card while not logged in opens the login modal
   * instead of navigating. Used on landing/preview surfaces.
   */
  requireLoginOnClick?: boolean
}

export default function InstructorList({
  instructors,
  requireLoginOnClick = false,
}: InstructorListProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {instructors.map((instructor) => (
        <InstructorCard
          key={instructor.id}
          instructor={instructor}
          isLoggedIn={isLoggedIn}
          requireLoginOnClick={requireLoginOnClick}
        />
      ))}
    </div>
  )
}
