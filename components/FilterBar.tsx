'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { SORT_OPTIONS } from '@/lib/constants'
import { trackEvent } from '@/lib/analytics'

interface FilterBarProps {
  mainCategories: string[]
  categories: string[]
  mainToSub?: Record<string, string[]>
}

export default function FilterBar({
  mainCategories,
  categories,
  mainToSub = {},
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentMainCategory = searchParams.get('mainCategory') ?? '전체'
  const currentCategory = searchParams.get('category') ?? '전체'
  const currentSort = searchParams.get('sort') ?? 'requests'

  const mainCategoryOptions = useMemo(
    () => ['전체', ...mainCategories],
    [mainCategories]
  )

  // 대카테고리 선택에 따라 세부 카테고리 필터링
  const filteredCategories = useMemo(() => {
    if (currentMainCategory === '전체') return categories
    const subs = mainToSub[currentMainCategory]
    if (!subs || subs.length === 0) return categories
    return subs
  }, [currentMainCategory, categories, mainToSub])

  const categoryOptions = useMemo(
    () => ['전체', ...filteredCategories],
    [filteredCategories]
  )

  // 스크롤 관련 상태
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const threshold = 5
    setCanScrollLeft(el.scrollLeft > threshold)
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - threshold
    )
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      ro.disconnect()
    }
  }, [checkScroll, categoryOptions])

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.5
    el.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }, [])

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === '전체' || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      trackEvent('filter_change', { [key]: value })
      router.push(`/instructors?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handleMainCategoryChange = useCallback(
    (mc: string) => {
      const params = new URLSearchParams(searchParams.toString())
      // 대카테고리 변경
      if (mc === '전체') {
        params.delete('mainCategory')
      } else {
        params.set('mainCategory', mc)
      }
      // 세부 카테고리 초기화
      params.delete('category')
      trackEvent('filter_change', { mainCategory: mc })
      router.push(`/instructors?${params.toString()}`, { scroll: false })
      // 스크롤 리셋
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollLeft = 0
      })
    },
    [router, searchParams]
  )

  const handleCategoryClick = useCallback(
    (cat: string) => {
      updateParams('category', cat)
    },
    [updateParams]
  )

  const hasOverflow =
    scrollRef.current
      ? scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      : false

  return (
    <div>
      {/* 1행: 대카테고리 — pill 스타일 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
        {mainCategoryOptions.map((mc) => {
          const active = currentMainCategory === mc
          return (
            <button
              key={mc}
              onClick={() => handleMainCategoryChange(mc)}
              className={`shrink-0 px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-150 focus:outline-none ${
                active
                  ? 'bg-[#191F28] text-white'
                  : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
              }`}
            >
              {mc}
            </button>
          )
        })}
      </div>

      {/* 2행: 카테고리 — 밑줄 탭 + 스크롤 + 페이드 */}
      <div className="relative mt-3">
        {/* 왼쪽 페이드 */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}
        {/* 오른쪽 페이드 */}
        {(canScrollRight || (!canScrollLeft && hasOverflow)) && canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        )}

        {/* 왼쪽 화살표 (데스크톱) */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow items-center justify-center text-[#333D4B] hover:bg-white focus:outline-none"
            aria-label="이전 카테고리"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {/* 오른쪽 화살표 (데스크톱) */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow items-center justify-center text-[#333D4B] hover:bg-white focus:outline-none"
            aria-label="다음 카테고리"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide border-b border-[#E5E8EB]"
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
        >
          {categoryOptions.map((cat) => {
            const active = currentCategory === cat
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 pb-2 text-[13px] whitespace-nowrap transition-colors duration-150 focus:outline-none border-b-2 ${
                  active
                    ? 'text-[#191F28] font-semibold border-[#191F28]'
                    : 'text-[#8B95A1] hover:text-[#4E5968] border-transparent'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* 정렬 */}
      <div className="flex items-center justify-end mt-3">
        <select
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="shrink-0 text-xs text-[#4E5968] bg-transparent focus:outline-none cursor-pointer"
          aria-label="정렬 기준"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
