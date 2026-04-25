type Props = {
  num: string
  title: string
  desc: string
}

export default function PartDivider({ num, title, desc }: Props) {
  return (
    <div className="part-divider">
      <div className="part-num">{num}</div>
      <div className="part-title">{title}</div>
      <div className="part-desc">{desc}</div>
    </div>
  )
}
