import type { ReportDocument } from '@/lib/report-types'

interface ReportDocumentsProps {
  sectionTitle: string
  sectionSub: string
  items: ReportDocument[]
  coverage: {
    title: string
    years: string[]
    note: string
  }
}

export default function ReportDocuments({
  sectionTitle,
  sectionSub,
  items,
  coverage,
}: ReportDocumentsProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      {/* Document rows */}
      <div className="flex flex-col">
        {items.map((doc, i) => (
          <div
            key={i}
            className={`py-4 flex gap-3.5 items-center ${i > 0 ? 'border-t border-toss-gray-100' : 'pt-1'}`}
          >
            <div
              className={`w-10 h-10 flex-shrink-0 rounded-[10px] flex items-center justify-center text-xs font-extrabold tracking-[-0.02em] ${
                doc.iconType === 'official'
                  ? 'bg-primary-light text-primary'
                  : 'bg-toss-gray-100 text-toss-gray-700'
              }`}
            >
              {doc.iconLabel}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-toss-gray-900 tracking-[-0.02em] mb-[3px]">
                {doc.title}
              </div>
              <div className="text-xs text-toss-gray-500 font-medium">
                {doc.meta}
              </div>
              {doc.verified && (
                <div className="text-[11px] font-bold text-primary inline-flex items-center gap-1 mt-1.5">
                  <span className="w-3.5 h-3.5 bg-primary text-white rounded-full inline-flex items-center justify-center text-[10px]">
                    &#10003;
                  </span>
                  진위확인 완료
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Coverage */}
      <div className="mt-7 pt-6 border-t border-toss-gray-100">
        <div className="text-sm font-extrabold text-toss-gray-900 tracking-[-0.025em] mb-4">
          {coverage.title}
        </div>
        <div className="grid grid-cols-6 gap-1.5 mb-3.5">
          {coverage.years.map((year) => (
            <div
              key={year}
              className="text-center py-3 px-1 bg-primary-light rounded-lg"
            >
              <div className="text-xs font-extrabold text-primary tracking-[-0.01em]">
                {year}
              </div>
              <div className="text-[10px] text-primary opacity-85 font-bold mt-0.5">
                &#10003;
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-toss-gray-500 font-medium leading-[1.6]">
          {coverage.note}
        </div>
      </div>
    </div>
  )
}
