import type { ReportFactCheck } from '@/lib/report-types'

type Props = {
  items: ReportFactCheck[]
}

export default function ReportFactChecklist({ items }: Props) {
  return (
    <div className="sec">
      <details className="collapsible" open>
        <summary>
          <div className="summary-head">
            <h2>팩트 확인</h2>
            <div className="sec-sub">표준 7개 항목 모두 통과</div>
          </div>
          <div className="summary-toggle">˅</div>
        </summary>
        <div className="collapsible-body">
          <div className="checklist">
            {items.map((item) => (
              <div key={item.text} className="check-item">
                <div className="icon">✓</div>
                <div className="text">
                  {item.text}
                  <span className="sub">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}
