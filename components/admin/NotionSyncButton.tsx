'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast'

export default function NotionSyncButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const handleSync = async (mode: 'incremental' | 'full') => {
    if (
      mode === 'full' &&
      !confirm(
        '전체 교체 모드입니다. 기존 강사/강의/확인 요청 데이터가 모두 삭제된 후 노션에서 재동기화됩니다. 계속하시겠습니까?'
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/sync-notion?mode=${mode}`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error ?? '동기화 실패', 'error')
        return
      }

      const deletedPart = data.deleted > 0 ? `, ${data.deleted}명 삭제` : ''
      showToast(
        `${data.synced ?? 0}명의 강사, ${data.courses ?? 0}개 강의 동기화 완료${deletedPart}`,
        'success'
      )

      if (data.errors && data.errors.length > 0) {
        console.error('Sync errors:', data.errors)
      }

      // 페이지 새로고침으로 최신 데이터 반영
      setTimeout(() => window.location.reload(), 800)
    } catch {
      showToast('동기화 실패 — 네트워크 오류', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleSync('incremental')}
        disabled={isLoading}
        className="px-4 h-10 bg-[#3182F6] text-white text-sm font-semibold rounded-xl hover:bg-[#1B64DA] disabled:opacity-50 transition-colors duration-150"
      >
        {isLoading ? '동기화 중...' : '노션 동기화'}
      </button>
      <button
        onClick={() => handleSync('full')}
        disabled={isLoading}
        className="px-4 h-10 border border-[#E5E8EB] text-[#4E5968] text-sm font-semibold rounded-xl hover:bg-[#F9FAFB] disabled:opacity-50 transition-colors duration-150"
      >
        전체 교체
      </button>
    </div>
  )
}
