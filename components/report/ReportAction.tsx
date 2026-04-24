interface ReportActionProps {
  title: string
  sub: string
  buttonText: string
}

export default function ReportAction({
  title,
  sub,
  buttonText,
}: ReportActionProps) {
  return (
    <div className="mt-4 mx-5 p-6 bg-toss-gray-100 rounded-xl text-center">
      <div className="text-[15px] font-extrabold text-toss-gray-900 tracking-[-0.025em] mb-1">
        {title}
      </div>
      <div className="text-[13px] text-toss-gray-500 font-medium mb-4">
        {sub}
      </div>
      <button className="bg-toss-gray-900 text-white border-0 py-3.5 px-[18px] rounded-xl text-[15px] font-extrabold tracking-[-0.02em] w-full cursor-pointer font-sans">
        {buttonText}
      </button>
    </div>
  )
}
