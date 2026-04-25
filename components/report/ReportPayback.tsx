'use client'

import { useState } from 'react'
import type { ReportPayback as ReportPaybackData } from '@/lib/report-types'

type Props = {
  data: ReportPaybackData
}

export default function ReportPayback({ data }: Props) {
  const [value, setValue] = useState<number>(data.defaultValue)

  const dailyNet = data.monthlyNetIncome / 30
  const days = value === 0 ? 0 : value / dailyNet
  const ratio = (value / data.monthlyNetIncome) * 100
  const barWidth = Math.max(0.3, Math.min(ratio, 100))

  const clampValue = (raw: string): number => {
    const parsed = parseInt(raw)
    if (isNaN(parsed)) return 0
    if (parsed < data.sliderMin) return data.sliderMin
    if (parsed > data.sliderMax) return data.sliderMax
    return parsed
  }

  return (
    <div className="sec">
      <h2>강의료 회수 계산기</h2>
      <div className="sec-sub">수강생이 강사 수익 수준 도달 시 회수 기간</div>

      <div className="pb-calc">
        <div className="pb-fixed">
          <div className="pb-fixed-head">
            <div className="pb-fixed-label">
              {data.monthlyNetLabel}
              <span className="pb-fixed-sub">{data.monthlyNetSub}</span>
            </div>
            <div className="pb-fixed-amount">{data.monthlyNetDisplay}</div>
          </div>
          <div className="pb-fixed-bar"></div>
        </div>

        <div className="pb-input-area">
          <div className="pb-input-label">강의료를 입력해 보세요</div>

          <div className="pb-slider-current">
            약 <span>{value.toLocaleString()}</span>만 원
          </div>

          <div className="pb-slider-wrap">
            <input
              type="range"
              className="pb-slider"
              min={data.sliderMin}
              max={data.sliderMax}
              step={data.sliderStep}
              value={value}
              onChange={(e) => setValue(clampValue(e.target.value))}
            />
          </div>

          <div className="pb-slider-marks">
            <span>0</span>
            <span>1,250만</span>
            <span>2,500만</span>
          </div>

          <div className="pb-direct-input">
            <span className="pb-direct-input-label">직접 입력</span>
            <input
              type="number"
              min={data.sliderMin}
              max={data.sliderMax}
              step={data.sliderStep}
              value={value}
              onChange={(e) => setValue(clampValue(e.target.value))}
              onBlur={(e) => {
                if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                  setValue(0)
                }
              }}
            />
            <span className="pb-direct-input-unit">만 원</span>
          </div>

          <div className="pb-default-note">{data.defaultNote}</div>
        </div>

        <div className="pb-result">
          <div className="pb-result-head">
            <div className="pb-result-label">회수 기간</div>
            <div className="pb-result-days">
              약 {data.learningMonths}개월 + <span>{days.toFixed(1)}</span>일
            </div>
          </div>
          <div className="pb-learning-note">{data.learningNote}</div>

          <div className="pb-result-bar-row">
            <span className="pb-result-bar-label">입력 강의료 비중</span>
            <span className="pb-result-bar-value">
              약 <span>{ratio.toFixed(1)}</span>%
            </span>
          </div>
          <div className="pb-result-bar-track">
            <div
              className="pb-result-bar-fill"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className="pb-explain"
        dangerouslySetInnerHTML={{ __html: data.explain }}
      />
    </div>
  )
}
