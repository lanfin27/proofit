import type { Instructor, ReportHero as ReportHeroData } from '@/lib/report-types'
import ProfileAvatar from './ProfileAvatar'

type Props = {
  instructor: Instructor
  hero: ReportHeroData
}

export default function ReportHero({ instructor, hero }: Props) {
  return (
    <div className="hero">
      <div className="profile-head">
        <ProfileAvatar
          src={instructor.profileImage}
          alt={instructor.name}
          initial={instructor.initial}
        />
        <div className="profile-meta">
          <div className="name-row">
            <div className="profile-name">{instructor.name}</div>
            <span className="inline-badge">수익확인 완료</span>
          </div>
        </div>
      </div>

      <div className="badges">
        {instructor.tags.map((tag) => (
          <span key={tag} className="badge tag">
            {tag}
          </span>
        ))}
      </div>

      <a
        className="hero-video"
        href={hero.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="play"></div>
        <div className="body">
          <div className="title">진위확인 영상</div>
          <div className="desc">국세청증빙 홈택스 진위확인</div>
        </div>
        <div className="arrow">→</div>
      </a>

      <div className="hero-number">
        <div className="label">{hero.cumulativeAdRevenue.label}</div>
        <div className="value">
          {hero.cumulativeAdRevenue.valueNumber}
          <span className="unit">{hero.cumulativeAdRevenue.valueUnit}</span>
        </div>
        <div className="sub">{hero.cumulativeAdRevenue.sub}</div>
      </div>

      <div className="hero-stats three-col">
        <div className="hero-stat doc-list-stat">
          <div className="label">국세청 증빙</div>
          <div className="value">
            {hero.stats.taxDocs.map((doc) => (
              <div key={doc} className="doc-item">
                {doc}
              </div>
            ))}
          </div>
        </div>
        <div className="hero-stat main-num">
          <div className="label">누적 순이익</div>
          <div className="value">{hero.stats.cumulativeNetProfit}</div>
        </div>
        <div className="hero-stat doc-list-stat">
          <div className="label">플랫폼 증빙</div>
          <div className="value">
            {hero.stats.platformDocs.map((doc) => (
              <div key={doc} className="doc-item">
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
