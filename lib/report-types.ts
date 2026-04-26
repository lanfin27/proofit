// ─── Report system types (v66) ──────────────────────────────

export type Instructor = {
  slug: string
  privateSlug: string
  supabaseId?: string
  name: string
  initial: string
  profileImage?: string
  subject: string
  tags: string[]
  status: 'draft' | 'published'
  publishedAt?: string
  reportVersion: string
  reportCompletedAt: string
}

// Hero
export type ReportHero = {
  videoUrl: string
  videoDurationLabel: string
  cumulativeAdRevenue: {
    label: string
    valueNumber: string
    valueUnit: string
    sub: string
  }
  stats: {
    taxDocs: string[]
    cumulativeNetProfit: string
    platformDocs: string[]
  }
}

// Claim vs Confirmed
export type ReportClaim = {
  topic: string
  status: 'matched' | 'partial' | 'mismatch'
  statusLabel: string
  claim: string
  detail: string
  sourceUrl: string
  sourceLabel: string
}

export type ReportClaimsSection = {
  ringTitle: string
  ringSub: string
  claims: ReportClaim[]
  footnote: string
}

// Business Finance
export type ReportBusinessFinanceCell = {
  label: string
  sublabel: string
  period: string
  valueNumber: string
  valueUnit: string
}

export type ReportBusinessFinanceRatioRow = {
  label: string
  barWidth: number
  barType: 'primary' | 'total'
  val: string
}

export type ReportBusinessFinanceEvidenceRow = {
  year: string
  hasMark?: boolean
  src: string
}

export type ReportBusinessFinance = {
  triad: ReportBusinessFinanceCell[]
  ratio: {
    title: string
    pct: string
    rows: ReportBusinessFinanceRatioRow[]
  }
  evidence: {
    title: string
    rows: ReportBusinessFinanceEvidenceRow[]
    fxNote: string
    methodLabel: string
    methodValue: string
  }
}

// Process
export type ReportProcessStep = {
  num: number
  title: string
  desc: string
  videoLink?: {
    url: string
    label: string
    meta: string
  }
}

// Fact Checklist
export type ReportFactCheck = {
  text: string
  sub: string
}

// Documents
export type ReportDocItem = {
  iconLabel: string
  iconStyle: 'tax' | 'platform'
  title: string
  meta: string
  verified: boolean
}

export type ReportDocGroup = {
  title: string
  count: string
  docs: ReportDocItem[]
}

export type ReportDocumentsSection = {
  groups: ReportDocGroup[]
  coverage: {
    title: string
    years: { year: string; ok: boolean }[]
    note: string
    subNote: string
  }
}

// Payback (interactive)
export type ReportPayback = {
  monthlyNetIncome: number
  monthlyNetLabel: string
  monthlyNetSub: string
  monthlyNetDisplay: string
  sliderMin: number
  sliderMax: number
  sliderStep: number
  defaultValue: number
  defaultNote: string
  learningMonths: number
  learningNote: string
  explain: string
}

// Action
export type ReportAction = {
  title: string
  sub: string
  buttonLabel: string
}

// Legal
export type ReportLegal = {
  disclaimerLabel: string
  disclaimerParagraphs: string[]
}

// Combined Report
export type Report = {
  instructorSlug: string
  hero: ReportHero
  claims: ReportClaimsSection
  businessFinance: ReportBusinessFinance
  process: ReportProcessStep[]
  factChecklist: ReportFactCheck[]
  documents: ReportDocumentsSection
  action: ReportAction
  payback: ReportPayback
  legal: ReportLegal
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
