import { getEnvLabel } from '@/lib/env'

type Props = {
  status: 'draft' | 'published'
  accessedViaPrivateSlug?: boolean
}

export default function DraftBanner({
  status,
  accessedViaPrivateSlug,
}: Props) {
  const env = getEnvLabel()

  if (accessedViaPrivateSlug) {
    return (
      <div className="draft-banner">
        비공개 사전 공유 링크 · 외부 공유 금지
      </div>
    )
  }

  if (status === 'published') return null
  if (env === 'production') return null

  const envLabel = env === 'preview' ? 'Preview' : 'Local'
  return (
    <div className="draft-banner">
      DRAFT · {envLabel} 환경 전용 · 프로덕션 비공개
    </div>
  )
}
