import type { ReportCheckItem } from '@/lib/report-types'

interface ReportChecklistProps {
  sectionTitle: string
  sectionSub: string
  items: ReportCheckItem[]
}

export default function ReportChecklist({
  sectionTitle,
  sectionSub,
  items,
}: ReportChecklistProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={i}
            className={`py-3.5 flex gap-3 items-center ${i > 0 ? 'border-t border-toss-gray-100' : 'pt-0.5'}`}
          >
            <div className="w-[22px] h-[22px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-black">
              &#10003;
            </div>
            <div className="flex-1 text-sm font-semibold text-toss-gray-900 tracking-[-0.02em] leading-[1.45]">
              {item.text}
              <span className="block text-xs font-medium text-toss-gray-500 mt-[3px] tracking-[-0.01em]">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
