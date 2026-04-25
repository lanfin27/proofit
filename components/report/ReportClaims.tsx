import type { ReportClaimsSection } from '@/lib/report-types'

type Props = {
  data: ReportClaimsSection
}

export default function ReportClaims({ data }: Props) {
  return (
    <div className="sec">
      <h2>강사 주장 확인</h2>
      <div className="sec-sub">
        Proofit이 선정한 주요 공개 주장 3건을 증빙과 대조
      </div>

      <div className="confirm-ring">
        <div className="num" style={{ fontSize: 22 }}>
          ✓
        </div>
        <div className="body">
          <div className="title">{data.ringTitle}</div>
          <div className="sub">{data.ringSub}</div>
        </div>
      </div>

      <div className="claim-list">
        {data.claims.map((claim) => (
          <div key={claim.topic} className="claim-row">
            <div className="head">
              <div className="topic">{claim.topic}</div>
              <div className={`status ${claim.status}`}>{claim.statusLabel}</div>
            </div>
            <div className="claim">{claim.claim}</div>
            <div
              className="detail"
              dangerouslySetInnerHTML={{ __html: claim.detail }}
            />
            <a
              href={claim.sourceUrl}
              target="_blank"
              rel="noopener"
              className="source"
            >
              {claim.sourceLabel}
              <span className="source-arrow">↗</span>
            </a>
          </div>
        ))}
      </div>

      <div className="claim-footnote">{data.footnote}</div>
    </div>
  )
}
