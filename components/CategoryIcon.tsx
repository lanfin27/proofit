import { getCategoryLabel } from '@/lib/constants'

interface CategoryIconProps {
  categories: string[]
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10 text-[11px]',
  md: 'w-11 h-11 text-xs',
  lg: 'w-16 h-16 text-sm',
}

export default function CategoryIcon({ categories, size = 'md' }: CategoryIconProps) {
  const label = getCategoryLabel(categories)

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-[#E8F3FF] text-[#3182F6] font-bold flex items-center justify-center shrink-0`}
      aria-label={`${categories[0] ?? '기타'} 카테고리`}
    >
      {label}
    </div>
  )
}
