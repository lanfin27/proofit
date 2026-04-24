import type { ReportConsistencyYear } from '@/lib/report-types'

interface ReportConsistencyProps {
  sectionTitle: string
  sectionSub: string
  verdictTitle: string
  verdictSub: string
  years: ReportConsistencyYear[]
  foot: string
}

export default function ReportConsistency({
  sectionTitle,
  sectionSub,
  verdictTitle,
  verdictSub,
  years,
  foot,
}: ReportConsistencyProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      {/* Verdict */}
      <div className="py-4 px-5 bg-primary-light rounded-xl flex items-center gap-3.5 mb-5">
        <div className="w-8 h-8 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black">
          &#10003;
        </div>
        <div className="flex-1">
          <div className="text-sm font-extrabold text-primary-hover tracking-[-0.025em] mb-0.5">
            {verdictTitle}
          </div>
          <div className="text-xs text-primary-hover opacity-85 font-semibold">
            {verdictSub}
          </div>
        </div>
      </div>

      {/* Year bars */}
      <div className="flex flex-col">
        {years.map((yr, i) => (
          <div
            key={yr.year}
            className={`py-4 ${i > 0 ? 'border-t border-toss-gray-100' : 'pt-1'}`}
          >
            <div className="flex justify-between items-baseline mb-2.5">
              <div className="text-sm font-extrabold text-toss-gray-900 tracking-[-0.02em]">
                {yr.year}
              </div>
              {yr.note && (
                <div className="text-[11px] text-toss-gray-500 font-semibold">
                  {yr.note}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-[54px_1fr] gap-2.5 items-center">
                <span className="text-[11px] text-toss-gray-500 font-bold">
                  국세청
                </span>
                <div className="h-1.5 bg-toss-gray-100 rounded-[3px] relative">
                  <div
                    className="h-full rounded-[3px] bg-primary min-w-[3px]"
                    style={{ width: yr.govWidth }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-[54px_1fr] gap-2.5 items-center">
                <span className="text-[11px] text-toss-gray-500 font-bold">
                  플랫폼
                </span>
                <div className="h-1.5 bg-toss-gray-100 rounded-[3px] relative">
                  <div
                    className="h-full rounded-[3px] bg-toss-gray-700 min-w-[3px]"
                    style={{ width: yr.platformWidth }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-xs text-toss-gray-500 font-medium leading-[1.6]">
        {foot}
      </div>
    </div>
  )
}
