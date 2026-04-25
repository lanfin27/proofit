import type { ReportLegal as ReportLegalData } from '@/lib/report-types'

const COPYRIGHT_LABEL = '저작권 및 사용 제한'
const COPYRIGHT_TEXT =
  '본 리포트의 모든 콘텐츠(텍스트·영상·디자인·데이터)는 Proofit의 자산이며, 무단 복제·전재·재배포·AI 학습 활용을 금합니다. Proofit의 서면 동의 없이 본 리포트의 어떠한 내용도 인용·변경할 수 없습니다.'

const REPORT_FEEDBACK_EMAIL = 'teamproofit@gmail.com'

function buildFeedbackMailto(instructorName: string, slug: string): string {
  const subject = encodeURIComponent(
    `[Proofit] ${instructorName} 리포트 정보 수정 요청`
  )
  const body = encodeURIComponent(
    `안녕하세요, Proofit 팀.\n\n` +
      `${instructorName} 강사 리포트(/reports/${slug})에 대해 다음 내용의 수정을 요청드립니다.\n\n` +
      `[수정 요청 내용]\n\n\n` +
      `[수정 사유]\n\n\n` +
      `[요청자 정보]\n` +
      `- 성함:\n` +
      `- 강사 본인 여부:\n` +
      `- 연락 가능한 방법:\n\n` +
      `감사합니다.`
  )
  return `mailto:${REPORT_FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
}

type Props = {
  data: ReportLegalData
  reportVersion: string
  reportCompletedAt: string
  instructorName: string
  slug: string
}

export default function ReportLegal({
  data,
  reportVersion,
  reportCompletedAt,
  instructorName,
  slug,
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
        <a href={buildFeedbackMailto(instructorName, slug)}>정보 수정 요청</a>
      </div>
    </>
  )
}
