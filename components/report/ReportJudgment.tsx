import type { ReportJudgmentGroup } from '@/lib/report-types'

interface ReportJudgmentProps {
  sectionTitle: string
  sectionSub: string
  checkedCount: string
  totalCount: string
  groups: ReportJudgmentGroup[]
}

export default function ReportJudgment({
  sectionTitle,
  sectionSub,
  checkedCount,
  totalCount,
  groups,
}: ReportJudgmentProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      {/* Counter */}
      <div className="flex justify-between items-baseline pb-4 mb-5 border-b border-toss-gray-100">
        <div className="text-[13px] text-toss-gray-700 font-semibold">
          해당 체크
        </div>
        <div className="text-[22px] font-extrabold text-toss-gray-900 tracking-[-0.035em] tabular-nums">
          {checkedCount}
          <span className="text-toss-gray-500 opacity-60 font-bold">
            {' '}
            / {totalCount}
          </span>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group, gi) => (
        <div key={gi} className={gi < groups.length - 1 ? 'mb-7' : ''}>
          <div className="text-xs font-extrabold text-toss-gray-700 tracking-[0.04em] uppercase mb-3">
            {group.title}
            <span className="text-[11px] text-toss-gray-500 font-bold ml-1.5 tracking-normal normal-case">
              {group.count}
            </span>
          </div>
          <div className="flex flex-col">
            {group.items.map((item, ii) => (
              <div
                key={ii}
                className={`py-3 flex items-center gap-3 ${ii > 0 ? 'border-t border-toss-gray-100' : 'pt-0.5'}`}
              >
                <div
                  className={`w-[18px] h-[18px] flex-shrink-0 rounded-[5px] flex items-center justify-center text-[10px] font-black ${
                    item.checked
                      ? 'bg-toss-gray-900 text-white'
                      : 'bg-toss-gray-100 border-[1.5px] border-toss-gray-100'
                  }`}
                >
                  {item.checked ? '✓' : ''}
                </div>
                <div
                  className={`flex-1 text-sm tracking-[-0.02em] leading-[1.4] ${
                    item.checked
                      ? 'font-semibold text-toss-gray-900'
                      : 'font-medium text-toss-gray-500'
                  }`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
