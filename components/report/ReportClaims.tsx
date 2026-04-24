import type { ReportClaimItem } from '@/lib/report-types'

interface ReportClaimsProps {
  sectionTitle: string
  sectionSub: string
  ringScore: string
  ringTitle: string
  ringSub: string
  items: ReportClaimItem[]
}

export default function ReportClaims({
  sectionTitle,
  sectionSub,
  ringScore,
  ringTitle,
  ringSub,
  items,
}: ReportClaimsProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      {/* Confirm Ring */}
      <div className="p-5 bg-primary-light rounded-xl flex items-center gap-4 mb-4">
        <div className="w-[52px] h-[52px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-base font-extrabold tracking-[-0.04em]">
          {ringScore}
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-extrabold text-primary-hover tracking-[-0.025em] mb-0.5">
            {ringTitle}
          </div>
          <div className="text-xs text-primary-hover opacity-85 font-semibold">
            {ringSub}
          </div>
        </div>
      </div>

      {/* Claim List */}
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={i}
            className={`py-[18px] ${i > 0 ? 'border-t border-toss-gray-100' : ''} ${item.outOfScope ? 'opacity-[0.82]' : ''}`}
          >
            <div className="flex justify-between items-baseline mb-2.5 gap-2.5">
              <div className="text-[13px] font-bold text-toss-gray-900 tracking-[-0.02em]">
                {item.topic}
              </div>
              <div
                className={`text-[11px] font-bold py-[3px] px-2 rounded-md whitespace-nowrap ${
                  item.statusType === 'matched'
                    ? 'bg-primary-light text-primary'
                    : 'bg-toss-gray-100 text-toss-gray-500'
                }`}
              >
                {item.status}
              </div>
            </div>
            <div className="text-sm text-toss-gray-700 font-medium leading-[1.55] mb-2 before:content-['\u201C'] before:text-toss-gray-400 before:mr-0.5 after:content-['\u201D'] after:text-toss-gray-400 after:ml-0.5">
              {item.claim}
            </div>
            <div
              className="text-[13px] text-toss-gray-500 font-medium leading-[1.6] [&_strong]:text-toss-gray-700 [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: item.detail }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
