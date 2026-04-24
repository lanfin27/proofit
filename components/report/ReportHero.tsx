import type { ReportBadge, ReportHeroStat } from '@/lib/report-types'

interface ReportHeroProps {
  profile: {
    name: string
    initial: string
    subject: string
    avatarUrl?: string
  }
  badges: ReportBadge[]
  video: {
    title: string
    desc: string
    href: string
  }
  heroNumber: {
    label: string
    value: string
    unit: string
    sub: string
  }
  heroStats: ReportHeroStat[]
}

export default function ReportHero({
  profile,
  badges,
  video,
  heroNumber,
  heroStats,
}: ReportHeroProps) {
  return (
    <div className="px-5 pt-8 pb-9">
      {/* Profile */}
      <div className="flex items-center gap-3.5 mb-[18px]">
        <div className="w-16 h-16 rounded-full bg-toss-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl font-extrabold text-toss-gray-500 tracking-[-0.04em]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{profile.initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[26px] font-extrabold text-toss-gray-900 tracking-[-0.045em] leading-[1.15] mb-1.5">
            {profile.name}
          </div>
          <div className="text-[13px] text-toss-gray-500 font-medium">
            {profile.subject}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-1.5 flex-wrap mb-7">
        {badges.map((badge, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2.5 py-[5px] text-xs rounded-md tracking-[-0.01em] ${
              badge.type === 'confirmed'
                ? 'bg-primary-light text-primary font-bold'
                : 'bg-toss-gray-100 text-toss-gray-700 font-semibold'
            }`}
          >
            {badge.label}
          </span>
        ))}
      </div>

      {/* Video CTA */}
      <a
        href={video.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-7 p-[18px] bg-primary-light rounded-xl flex items-center gap-3.5 transition-colors hover:bg-[#dbeafe] group"
      >
        <div className="w-10 h-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(49,130,246,0.3)]">
          <span className="block w-0 h-0 border-l-[11px] border-l-white border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-1" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-primary-hover tracking-[-0.025em] mb-0.5">
            {video.title}
          </div>
          <div className="text-xs text-primary-hover opacity-85 font-semibold">
            {video.desc}
          </div>
        </div>
        <div className="flex-shrink-0 text-lg text-primary font-extrabold">
          &rarr;
        </div>
      </a>

      {/* Hero Number */}
      <div className="mb-7">
        <div className="text-[13px] text-toss-gray-700 font-semibold mb-2">
          {heroNumber.label}
        </div>
        <div className="text-[44px] font-extrabold text-toss-gray-900 tracking-[-0.05em] leading-none tabular-nums">
          {heroNumber.value}
          <span className="text-2xl text-toss-gray-700 font-bold ml-0.5">
            {heroNumber.unit}
          </span>
        </div>
        <div className="text-[13px] text-toss-gray-500 font-medium mt-2.5">
          {heroNumber.sub}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-toss-gray-100">
        {heroStats.map((stat, i) => (
          <div key={i}>
            <div className="text-[11px] text-toss-gray-500 font-semibold mb-1.5">
              {stat.label}
            </div>
            <div className="text-lg font-extrabold text-toss-gray-900 tracking-[-0.035em] leading-[1.2]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
