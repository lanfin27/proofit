'use client'

import type { ReportAction as ReportActionData } from '@/lib/report-types'

type Props = {
  data: ReportActionData
}

export default function ReportAction({ data }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    if (!data.buttonHref) {
      e.preventDefault()
    }
  }

  return (
    <div className="action">
      <div className="title">{data.title}</div>
      <div className="sub">{data.sub}</div>
      {data.buttonHref ? (
        <a href={data.buttonHref} onClick={handleClick}>
          <button>{data.buttonLabel}</button>
        </a>
      ) : (
        <button onClick={handleClick}>{data.buttonLabel}</button>
      )}
    </div>
  )
}
