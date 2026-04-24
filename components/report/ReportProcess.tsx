import type { ReportProcessStep } from '@/lib/report-types'

interface ReportProcessProps {
  sectionTitle: string
  sectionSub: string
  steps: ReportProcessStep[]
}

export default function ReportProcess({
  sectionTitle,
  sectionSub,
  steps,
}: ReportProcessProps) {
  return (
    <div className="px-5 pt-10">
      <h2 className="text-[19px] font-extrabold text-toss-gray-900 tracking-[-0.035em] mb-1.5">
        {sectionTitle}
      </h2>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-5">
        {sectionSub}
      </div>

      <div className="flex flex-col">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`flex gap-3.5 py-4 ${i > 0 ? 'border-t border-toss-gray-100' : 'pt-1'}`}
          >
            <div className="w-7 h-7 flex-shrink-0 bg-primary-light text-primary rounded-full flex items-center justify-center text-[13px] font-extrabold">
              {step.num}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="text-sm font-bold text-toss-gray-900 tracking-[-0.02em] mb-1">
                {step.title}
              </div>
              <div className="text-[13px] text-toss-gray-500 font-medium leading-[1.55]">
                {step.desc}
              </div>
              {step.videoLink && (
                <a
                  href={step.videoLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2.5 py-2 px-3 bg-toss-gray-100 rounded-lg text-xs font-bold text-toss-gray-900 tracking-[-0.01em] transition-colors hover:bg-toss-gray-200"
                >
                  <span className="w-4 h-4 bg-primary rounded-full inline-flex items-center justify-center">
                    <span className="block w-0 h-0 border-l-[5px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                  </span>
                  {step.videoLink.label}
                  <span className="text-toss-gray-500 font-medium text-[11px]">
                    {step.videoLink.meta}
                  </span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
