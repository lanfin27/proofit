import type { ReportProcessStep } from '@/lib/report-types'

type Props = {
  steps: ReportProcessStep[]
}

export default function ReportProcess({ steps }: Props) {
  return (
    <div className="sec">
      <h2>확인 과정</h2>
      <div className="sec-sub">표준 3단계 절차</div>

      <div className="process">
        {steps.map((step) => (
          <div key={step.num} className="process-item">
            <div className="num">{step.num}</div>
            <div className="body">
              <div className="title">{step.title}</div>
              <div className="desc">{step.desc}</div>
              {step.videoLink && (
                <a
                  className="video-link"
                  href={step.videoLink.url}
                  target="_blank"
                  rel="noopener"
                >
                  <span className="play-icon"></span>
                  {step.videoLink.label}
                  <span className="meta">{step.videoLink.meta}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
