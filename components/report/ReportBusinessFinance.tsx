import type { ReportBusinessFinance } from '@/lib/report-types'

type Props = {
  data: ReportBusinessFinance
}

export default function ReportBusinessFinance({ data }: Props) {
  return (
    <div className="sec">
      <h2>수익 확인</h2>
      <div className="sec-sub">국세청 증빙 × 플랫폼 증빙 교차 확인</div>

      <div className="bf-triad">
        {data.triad.map((cell) => (
          <div key={cell.label} className="bf-cell">
            <div className="bf-label">{cell.label}</div>
            <div className="bf-sublabel">{cell.sublabel}</div>
            <div className="bf-period">{cell.period}</div>
            <div className="bf-value">
              {cell.valueNumber}
              <span className="bf-unit">{cell.valueUnit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bf-ratio">
        <div className="bf-ratio-title">
          <span className="title">{data.ratio.title}</span>
          <span className="pct">{data.ratio.pct}</span>
        </div>
        <div className="bf-ratio-rows">
          {data.ratio.rows.map((row) => (
            <div key={row.label} className="bf-ratio-row">
              <span className="label">{row.label}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${row.barType}`}
                  style={{ width: `${row.barWidth}%` }}
                />
              </div>
              <span className="val">{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bf-evidence">
        <div className="bf-evidence-title">{data.evidence.title}</div>
        {data.evidence.rows.map((row) => (
          <div key={row.year} className="bf-evidence-row">
            <div className="yr">
              {row.year}
              {row.hasMark && <span className="yr-mark">*</span>}
            </div>
            <div className="src">{row.src}</div>
          </div>
        ))}
        <div className="bf-evidence-fx">{data.evidence.fxNote}</div>
        <div className="bf-evidence-method">
          <div className="bf-method-label">{data.evidence.methodLabel}</div>
          <div className="bf-method-value">{data.evidence.methodValue}</div>
        </div>
      </div>

      <div
        className="net-note"
        dangerouslySetInnerHTML={{ __html: data.netNote }}
      />
    </div>
  )
}
