import type { ReportLegal as ReportLegalData } from '@/lib/report-types'

type Props = {
  data: ReportLegalData
  reportVersion: string
  reportCompletedAt: string
}

export default function ReportLegal({
  data,
  reportVersion,
  reportCompletedAt,
}: Props) {
  return (
    <>
      <div className="disclaimer">
        <div className="disclaimer-label">{data.disclaimerLabel}</div>
        {data.disclaimerParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="copyright-notice">
        <div className="copyright-label">{data.copyrightLabel}</div>
        <p>{data.copyrightText}</p>
      </div>

      <div className="meta-foot">
        <span>
          리포트 {reportVersion} · {reportCompletedAt}
        </span>
        <a>정보 수정 요청</a>
      </div>
    </>
  )
}
