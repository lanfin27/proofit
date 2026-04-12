interface StatsProps {
  instructorCount: number
  requestCount: number
}

export default function Stats({ instructorCount, requestCount }: StatsProps) {
  return (
    <div className="mt-8 flex gap-8 items-baseline flex-wrap">
      <div>
        <span className="text-3xl md:text-4xl font-extrabold text-[#191F28] tabular-nums">
          {instructorCount > 0 ? instructorCount : '—'}
        </span>
        <span className="text-sm text-[#8B95A1] ml-1">명의 강사</span>
      </div>
      <div>
        <span className="text-3xl md:text-4xl font-extrabold text-[#191F28] tabular-nums">
          {requestCount > 0 ? requestCount.toLocaleString('ko-KR') : '—'}
        </span>
        <span className="text-sm text-[#8B95A1] ml-1">건의 확인 요청</span>
      </div>
    </div>
  )
}
