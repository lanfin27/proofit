import type { ReportDocumentsSection } from '@/lib/report-types'

type Props = {
  data: ReportDocumentsSection
}

export default function ReportDocuments({ data }: Props) {
  return (
    <div className="sec">
      <details className="collapsible" open>
        <summary>
          <div className="summary-head">
            <h2>확인 자료</h2>
            <div className="sec-sub">국세청 증빙 2종 · 플랫폼 증빙 2종</div>
          </div>
          <div className="summary-toggle">˅</div>
        </summary>
        <div className="collapsible-body">
          <div className="docs">
            {data.groups.map((group) => (
              <div key={group.title} className="doc-group">
                <div className="doc-group-header">
                  <div className="doc-group-title">{group.title}</div>
                  <div className="doc-group-count">{group.count}</div>
                </div>
                {group.docs.map((doc) => (
                  <div key={doc.title} className="doc-row">
                    <div
                      className="icon"
                      style={
                        doc.iconStyle === 'platform'
                          ? {
                              background: 'var(--bg-soft)',
                              color: 'var(--ink-sub)',
                            }
                          : undefined
                      }
                    >
                      {doc.iconLabel}
                    </div>
                    <div className="body">
                      <div className="title">{doc.title}</div>
                      <div className="meta">{doc.meta}</div>
                      {doc.verified && (
                        <div className="badge-verified">진위확인 완료</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="coverage">
            <div className="title">{data.coverage.title}</div>
            <div className="grid">
              {data.coverage.years.map((y) => (
                <div key={y.year} className="cell">
                  <div className="year">{y.year}</div>
                  <div className="ok">{y.ok ? '✓' : '–'}</div>
                </div>
              ))}
            </div>
            <div className="note">
              {data.coverage.note}
              <br />
              <span style={{ color: 'var(--ink-muted)', fontSize: 11 }}>
                {data.coverage.subNote}
              </span>
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
