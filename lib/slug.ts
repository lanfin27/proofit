import crypto from 'crypto'

/**
 * 비밀 슬러그 생성: {slug}-preview-{8자 영숫자}
 * 결과는 빌드 타임에 한 번만 생성하여 데이터 파일에 하드코딩한다.
 * 빌드마다 변경되면 사전 공유한 링크가 깨진다.
 */
export function generatePrivateSlug(slug: string): string {
  const random = crypto
    .randomBytes(6)
    .toString('base64url')
    .slice(0, 8)
    .toLowerCase()
  return `${slug}-preview-${random}`
}

/**
 * URL이 비밀 슬러그 형식인지 판별 (강사 데이터와 무관한 형식 검사)
 */
export function isPrivateSlugFormat(value: string): boolean {
  return /-preview-[a-z0-9]{8}$/.test(value)
}
