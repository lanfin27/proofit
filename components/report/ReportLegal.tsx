import type { ReportLegal as ReportLegalData } from '@/lib/report-types'

const COPYRIGHT_LABEL = '저작권 및 사용 제한'
const COPYRIGHT_TEXT =
  '본 리포트의 모든 콘텐츠(텍스트·영상·디자인·데이터)는 Proofit의 자산이며, 무단 복제·전재·재배포·AI 학습 활용을 금합니다. Proofit의 서면 동의 없이 본 리포트의 어떠한 내용도 인용·변경할 수 없습니다.'

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
        <div className="copyright-label">{COPYRIGHT_LABEL}</div>
        <p>{COPYRIGHT_TEXT}</p>
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
