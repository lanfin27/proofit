'use client'

import { ReactNode } from 'react'

interface BlurOverlayProps {
  children: ReactNode
}

/**
 * Pass-through wrapper. Previously rendered a gradient + login CTA overlay.
 * Card-level price masking + click-to-modal now handles the same affordance,
 * so this component just renders children.
 *
 * Kept as a thin shim so existing imports still compile.
 */
export default function BlurOverlay({ children }: BlurOverlayProps) {
  return <div className="relative">{children}</div>
}
