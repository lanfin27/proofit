import { getEnvLabel } from '@/lib/env'

type Props = {
  status: 'draft' | 'published'
}

export default function DraftBanner({ status }: Props) {
  const env = getEnvLabel()

  if (env === 'production') return null
  if (status === 'published') return null

  const envLabel = env === 'preview' ? 'Preview' : 'Local'

  return (
    <div className="bg-yellow-100 border-b border-yellow-400 py-2.5 px-4 text-center text-xs font-semibold text-yellow-900 tracking-[-0.01em]">
      DRAFT · {envLabel} 환경 전용 · 프로덕션 비공개
    </div>
  )
}
