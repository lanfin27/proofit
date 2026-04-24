import type { ReportPaybackRow } from '@/lib/report-types'

interface ReportPaybackProps {
  sectionTitle: string
  sectionSub: string
  premise: string
  monthlyLabel: string
  monthlyValue: string
  monthlyUnit: string
  monthlySub: string
  tableHeaders: [string, string]
  rows: ReportPaybackRow[]
  warning: string
}

export default function ReportPayback({
  sectionTitle,
  sectionSub,
  premise,
  monthlyLabel,
  monthlyValue,
  monthlyUnit,
  monthlySub,
  tableHeaders,
  rows,
  warning,
}: ReportPaybackProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      {/* Premise */}
      <div
        className="py-3.5 px-4 bg-toss-gray-100 rounded-xl mb-5 text-[13px] text-toss-gray-700 leading-[1.6] font-medium [&_strong]:text-toss-gray-900 [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: premise }}
      />

      {/* Monthly */}
      <div className="mb-6">
        <div className="text-xs text-toss-gray-500 font-semibold mb-1.5">
          {monthlyLabel}
        </div>
        <div className="text-[32px] font-extrabold text-toss-gray-900 tracking-[-0.045em] leading-none tabular-nums">
          {monthlyValue}
          <span className="text-lg text-toss-gray-700 font-bold ml-0.5">
            {monthlyUnit}
          </span>
        </div>
        <div className="text-xs text-toss-gray-500 font-medium mt-1.5">
          {monthlySub}
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col">
        <div className="grid grid-cols-2 py-2.5 border-b border-toss-gray-100 text-[11px] text-toss-gray-500 font-bold tracking-[0.02em] uppercase">
          <div>{tableHeaders[0]}</div>
          <div className="text-right">{tableHeaders[1]}</div>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 py-4 border-b border-toss-gray-100 items-center"
          >
            <div className="text-[15px] font-bold text-toss-gray-900 tracking-[-0.025em]">
              {row.fee}
            </div>
            <div className="text-lg font-extrabold text-toss-gray-900 tracking-[-0.035em] text-right tabular-nums">
              {row.days}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 text-xs text-toss-gray-500 leading-[1.65] font-medium [&_strong]:text-toss-gray-700 [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: warning }}
      />
    </div>
  )
}
