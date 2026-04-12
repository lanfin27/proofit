// Fallback lists — used only when Supabase is unreachable or returns no data.
// Live filter options come from DB (getFilterOptions) so that adding a new
// category/platform in Notion auto-propagates to the website.
export const FALLBACK_CATEGORIES = [
  '재테크',
  '부동산',
  '주식',
  '이커머스',
  '마케팅',
]
export const FALLBACK_PLATFORMS = [
  '클래스101',
  '크몽',
  '탈잉',
  '유튜브',
  '자체채널',
]

export const SORT_OPTIONS = [
  { value: 'requests', label: '확인 요청 많은 순' },
  { value: 'price_asc', label: '가격 낮은 순' },
  { value: 'price_desc', label: '가격 높은 순' },
] as const

export const CONTACT_EMAIL = 'teamproofit@gmail.com'

export interface CategoryColor {
  bg: string
  text: string
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  재테크: { bg: '#E8F3FF', text: '#3182F6' },
  부동산: { bg: '#FFF3E8', text: '#E5740B' },
  주식: { bg: '#E8FFE8', text: '#1B8C3D' },
  이커머스: { bg: '#FFE8F3', text: '#D63384' },
  마케팅: { bg: '#F3E8FF', text: '#7C3AED' },
  워드프레스: { bg: '#E8EFFF', text: '#4A6CF7' },
  블로그: { bg: '#FFF8E8', text: '#B8860B' },
  스마트스토어: { bg: '#E8FFF3', text: '#0EA5E9' },
  전자책: { bg: '#FFF0F0', text: '#DC2626' },
  유튜브: { bg: '#FFE8E8', text: '#FF0000' },
  인스타그램: { bg: '#F3E8FF', text: '#C13584' },
  틱톡: { bg: '#E8F4F8', text: '#010101' },
  쿠팡: { bg: '#E8F3FF', text: '#E31937' },
  기타: { bg: '#F2F4F6', text: '#8B95A1' },
}

const DEFAULT_COLOR: CategoryColor = { bg: '#F2F4F6', text: '#8B95A1' }

export function getCategoryColor(categories: string[]): CategoryColor {
  const first = categories[0] ?? '기타'
  return CATEGORY_COLORS[first] ?? DEFAULT_COLOR
}

export function getCategoryLabel(categories: string[]): string {
  const first = categories[0] ?? '기타'
  // 2글자로 줄이기 (한글 기준)
  if (first.length <= 3) return first
  return first.slice(0, 2)
}
