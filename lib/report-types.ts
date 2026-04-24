// ─── Report system types ──────────────────────────────

export type ReportBadge = {
  label: string
  type: 'confirmed' | 'tag'
}

export type ReportHeroStat = {
  label: string
  value: string
}

export type ReportClaimItem = {
  topic: string
  status: string
  statusType: 'matched' | 'scope'
  claim: string
  detail: string
  outOfScope?: boolean
}

export type ReportProcessStep = {
  num: number
  title: string
  desc: string
  videoLink?: {
    href: string
    label: string
    meta: string
  }
}

export type ReportCheckItem = {
  text: string
  sub: string
}

export type ReportConsistencyYear = {
  year: string
  note?: string
  govWidth: string
  platformWidth: string
}

export type ReportPaybackRow = {
  fee: string
  days: string
}

export type ReportJudgmentItem = {
  label: string
  checked: boolean
}

export type ReportJudgmentGroup = {
  title: string
  count: string
  items: ReportJudgmentItem[]
}

export type ReportDocument = {
  iconLabel: string
  iconType: 'official' | 'platform'
  title: string
  meta: string
  verified?: boolean
}

export type Report = {
  instructorSlug: string
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
  claims: {
    sectionTitle: string
    sectionSub: string
    ringScore: string
    ringTitle: string
    ringSub: string
    items: ReportClaimItem[]
  }
  process: {
    sectionTitle: string
    sectionSub: string
    steps: ReportProcessStep[]
  }
  checklist: {
    sectionTitle: string
    sectionSub: string
    items: ReportCheckItem[]
  }
  consistency: {
    sectionTitle: string
    sectionSub: string
    verdictTitle: string
    verdictSub: string
    years: ReportConsistencyYear[]
    foot: string
  }
  payback: {
    sectionTitle: string
    sectionSub: string
    premise: string
    monthlyLabel: string
    monthlyValue: string
    monthlyUnit: string
    monthlySub: string
    tableHeaders: [string, string]
    rows: ReportPaybackRow[]
    warning: string
  }
  judgment: {
    sectionTitle: string
    sectionSub: string
    checkedCount: string
    totalCount: string
    groups: ReportJudgmentGroup[]
  }
  documents: {
    sectionTitle: string
    sectionSub: string
    items: ReportDocument[]
    coverage: {
      title: string
      years: string[]
      note: string
    }
  }
  action: {
    title: string
    sub: string
    buttonText: string
  }
  disclaimer: string
  meta: {
    version: string
    date: string
    correctionLabel: string
  }
}

// ─── Instructor (report context) ─────────────────────

export type ReportInstructor = {
  slug: string
  name: string
  tags: string[]
  status: 'draft' | 'published'
  publishedAt?: string
  reportCompletedAt: string
}

// ─── Featured instructor (landing page) ──────────────

export type FeaturedInstructor = {
  slug: string
  name: string
  categories: string[]
  summary: string
  publishedAt: string
  status: 'draft' | 'published'
}
