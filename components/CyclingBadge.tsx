'use client'

import { useState, useEffect } from 'react'

const ITEMS: Array<{ label: string; bg: string; text: string }> = [
  { label: '미확인', bg: '#F2F4F6', text: '#8B95A1' },
  { label: '확인', bg: '#E8F3FF', text: '#3182F6' },
  { label: '확인중', bg: '#FFF8E8', text: '#B8860B' },
]

export default function CyclingBadge() {
  const [index, setIndex] = useState(0) // 고정 초기값 — 서버/클라이언트 동일
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 마운트 후 랜덤 시작
    const randomStart = Math.floor(Math.random() * ITEMS.length)
    setIndex(randomStart)
    setMounted(true)

    // 1500~2500ms 랜덤 간격
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ITEMS.length)
    }, 1500 + Math.random() * 1000)

    return () => clearInterval(interval)
  }, [])

  const item = ITEMS[index]

  return (
    <span
      className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium transition-all duration-500 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: item.bg, color: item.text }}
      aria-hidden="true"
    >
      {item.label}
    </span>
  )
}
