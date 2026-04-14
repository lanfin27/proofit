import { Suspense } from 'react'
import AuthCallbackHandler from './AuthCallbackHandler'

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-sm text-[#8B95A1]">로그인 처리 중...</p>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  )
}
