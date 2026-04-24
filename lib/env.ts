/**
 * 현재 실행 환경이 프로덕션 배포인지 판별.
 * - Vercel production 배포에서만 true
 * - Preview URL, 로컬 dev 서버에서는 false
 */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === 'production'
}

/**
 * Draft 상태 리포트를 현재 환경에서 렌더링할 수 있는지 판별.
 * - 프로덕션: draft는 렌더링 불가 (404)
 * - Preview/로컬: draft도 렌더링 가능 (검토용)
 */
export function canViewDraft(): boolean {
  return !isProductionDeployment()
}

/**
 * 현재 환경 라벨 (DraftBanner 등에서 사용)
 */
export function getEnvLabel(): 'production' | 'preview' | 'development' {
  const env = process.env.VERCEL_ENV
  if (env === 'production') return 'production'
  if (env === 'preview') return 'preview'
  return 'development'
}
