'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src?: string
  alt: string
  initial: string
}

export default function ProfileAvatar({ src, alt, initial }: Props) {
  const [imageError, setImageError] = useState(false)
  const showImage = Boolean(src) && !imageError

  return (
    <div className="profile-avatar">
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          width={64}
          height={64}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  )
}
