interface ReportDisclaimerProps {
  disclaimer: string
  meta: {
    version: string
    date: string
    correctionLabel: string
  }
}

export default function ReportDisclaimer({
  disclaimer,
  meta,
}: ReportDisclaimerProps) {
  return (
    <>
      <div
        className="px-5 pt-9 pb-10 text-[11px] text-toss-gray-500 leading-[1.75] font-medium [&_strong]:text-toss-gray-700 [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: disclaimer }}
      />
      <div className="px-5 py-5 pb-8 text-[11px] text-toss-gray-500 flex justify-between items-center border-t border-toss-gray-100 font-medium">
        <span>{meta.version}</span>
        <span className="text-primary font-semibold cursor-default">
          {meta.correctionLabel}
        </span>
      </div>
    </>
  )
}
