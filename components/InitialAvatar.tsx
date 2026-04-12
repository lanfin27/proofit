// Deprecated: use CategoryIcon instead.
// Kept as a thin wrapper so any remaining import paths still compile.
import CategoryIcon from '@/components/CategoryIcon'

interface InitialAvatarProps {
  name?: string
  categories?: string[]
  size?: 'sm' | 'md' | 'lg'
}

export default function InitialAvatar({ categories = [], size = 'md' }: InitialAvatarProps) {
  return <CategoryIcon categories={categories} size={size} />
}
