'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

const DEBOUNCE_MS = 300

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const mounted = useRef(false)

  // URL의 q가 외부에서 바뀌면 (필터 탭 클릭 등) input도 동기화
  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  // 디바운스: value 변경 후 300ms 뒤에 URL 업데이트
  useEffect(() => {
    // 첫 마운트에서는 URL 업데이트를 하지 않음 (초기 하이드레이션 시 loop 방지)
    if (!mounted.current) {
      mounted.current = true
      return
    }

    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') ?? ''
      if (currentQ === value.trim()) return

      const params = new URLSearchParams(searchParams.toString())
      const trimmed = value.trim()
      if (trimmed) {
        params.set('q', trimmed)
      } else {
        params.delete('q')
      }
      trackEvent('search', { q: trimmed })
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleClear = () => {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="relative mb-4" role="search">
      <label htmlFor="search-instructors" className="sr-only">
        강사 검색
      </label>
      <input
        id="search-instructors"
        type="text"
        placeholder="강사명으로 검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        className="w-full h-11 pl-10 pr-10 bg-[#F2F4F6] rounded-xl text-sm text-[#191F28] placeholder-[#8B95A1] border-none outline-none focus:ring-2 focus:ring-[#3182F6] focus:bg-white transition-colors"
      />
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A1]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색 초기화"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B95A1] hover:text-[#4E5968] text-xs focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  )
}
