'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Instructor } from '@/lib/report-types'

type Props = {
  instructor: Instructor
}

export default function ProfileAvatar({ instructor }: Props) {
  const [imageError, setImageError] = useState(false)
  const showImage = Boolean(instructor.profileImage) && !imageError

  return (
    <div className="profile-avatar">
      {showImage ? (
        <Image
          src={instructor.profileImage!}
          alt={instructor.name}
          width={64}
          height={64}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{instructor.initial}</span>
      )}
    </div>
  )
}
