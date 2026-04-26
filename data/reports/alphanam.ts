import type { Instructor, Report } from '@/lib/report-types'

export const alphanamInstructor: Instructor = {
  slug: 'alphanam',
  privateSlug: 'alphanam-preview-zyfjrewz',
  supabaseId: '1029ddf5-0646-46a4-9a87-4977f35638ed',
  name: '알파남',
  initial: '알',
  profileImage: '/instructors/alphanam.png',
  subject: '애드센스 광고수입 수익화 강의',
  tags: ['애드센스', '블로그', '워드프레스'],
  status: 'draft',
  reportVersion: 'v1.0',
  reportCompletedAt: '2026.04.23',
}

export const alphanamReport: Report = {
  instructorSlug: 'alphanam',
  hero: {
    videoUrl: 'https://youtube.com/...',
    videoDurationLabel: '1분 12초',
    cumulativeAdRevenue: {
      label: '누적 광고수입',
      valueNumber: '약 39.7',
      valueUnit: '억 원',
      sub: '2020~2026 · 국세청 × 플랫폼 증빙 교차 확인',
    },
    stats: {
      taxDocs: ['소득금액증명원', '부가세 과표증명'],
      cumulativeNetProfit: '약 29.2억',
      platformDocs: ['애드센스', '타불라'],
    },
  },
  claims: {
    ringTitle: '강사 주장 3건 모두 증빙 부합',
    ringSub: '누적 · 월 최고 · 일 최고 모두 규모 일치',
    claims: [
      {
        topic: '애드센스 누적 수익',
        status: 'matched',
        statusLabel: '증빙 확인',
        claim: '애드센스 누적 수익 $2,500,000 (약 35억 원)',
        detail: '강사 주장 35억과 환율 환산 오차 범위 내 정합.',
        sourceUrl: 'https://adsensefarm.kr/alphamale_2025/',
        sourceLabel: '확인 출처: 강사 강의 랜딩페이지 · 2026.04.20',
      },
      {
        topic: '월 최고 수익',
        status: 'matched',
        statusLabel: '증빙 확인',
        claim: '월 최고 수익 $530,000 (약 7억 8천만 원)',
        detail: '플랫폼 증빙 검토 결과 환율 환산 오차 범위 내 정합.',
        sourceUrl: 'https://adsensefarm.kr/alphamale_2025/',
        sourceLabel: '확인 출처: 강사 강의 랜딩페이지 · 2026.04.20',
      },
      {
        topic: '일 최고 수익',
        status: 'matched',
        statusLabel: '증빙 확인',
        claim: '일 최고 수익 $23,000 (약 3,200만 원)',
        detail: '플랫폼 증빙 검토 결과 환율 환산 오차 범위 내 정합.',
        sourceUrl: 'https://adsensefarm.kr/alphamale_2025/',
        sourceLabel: '확인 출처: 강사 강의 랜딩페이지 · 2026.04.20',
      },
    ],
    footnote:
      'Proofit은 강사가 공개 자료에서 언급한 수치 주장을 증빙과 대조합니다. 전체 주장을 망라하지 않습니다.',
  },
  businessFinance: {
    triad: [
      {
        label: '광고수입',
        sublabel: '플랫폼 증빙',
        period: '2020~2026.3 누적',
        valueNumber: '약 39.7',
        valueUnit: '억',
      },
      {
        label: '전체 사업수입',
        sublabel: '소득금액증명원',
        period: '2020~2024 누적',
        valueNumber: '약 56.0',
        valueUnit: '억',
      },
      {
        label: '사업 순이익',
        sublabel: '소득금액증명원',
        period: '2020~2024 누적',
        valueNumber: '약 29.2',
        valueUnit: '억',
      },
    ],
    ratio: {
      title: '광고수입 비중',
      pct: '약 70%',
      rows: [
        {
          label: '광고수입',
          barWidth: 70,
          barType: 'primary',
          val: '약 39.7억',
        },
        {
          label: '전체 사업',
          barWidth: 100,
          barType: 'total',
          val: '약 56.0억',
        },
      ],
    },
    evidence: {
      title: '연도별 확인 근거',
      rows: [
        {
          year: '2020~2024',
          src: '소득금액증명원 × 부가세 과세표준증명 × 플랫폼 증빙',
        },
        {
          year: '2025',
          hasMark: true,
          src: '부가세 과세표준증명 × 플랫폼 증빙',
        },
        {
          year: '2026.1~3',
          hasMark: true,
          src: '플랫폼 증빙',
        },
      ],
      fxNote:
        '해당 연도 신고 완료 후 발급 가능한 자료로 확인 시점 기준 발급되지 않았습니다',
      methodLabel: '환율 적용',
      methodValue: '서울외국환중개 월평균 기간별 매매기준율',
    },
  },
  process: [
    {
      num: 1,
      title: '국세청 증빙 진위확인',
      desc: '소득금액증명원·부가세 과세표준증명 홈택스 발급번호 검증',
      videoLink: {
        url: 'https://youtube.com/...',
        label: '진위확인 영상 보기',
        meta: '· 1분 12초',
      },
    },
    {
      num: 2,
      title: '플랫폼 증빙 교차 대조',
      desc: '애드센스·타불라 연도별 합산을 국세청 신고와 대조',
    },
    {
      num: 3,
      title: '표준 체크리스트 적용',
      desc: 'Proofit 7-Fact · 증빙 교차 확인',
    },
  ],
  factChecklist: [
    {
      text: '개인 소득금액증명원 진위확인',
      sub: '2020~2024 귀속 · 홈택스 통과',
    },
    {
      text: '개인사업자 부가세 과세표준증명 진위확인',
      sub: '2020~2025 과세기간 · 홈택스 통과',
    },
    {
      text: '플랫폼 증빙 × 국세청 신고 연도별 대조',
      sub: '애드센스 · 타불라 증빙이 국세청 신고와 정합 범위 내',
    },
    {
      text: '순이익 확인',
      sub: '소득금액증명원상 사업 순이익(필요경비 차감) 검증',
    },
    {
      text: '공개 주장 × 증빙 교차 확인',
      sub: '강사 주장 3건 모두 규모 부합',
    },
    {
      text: '강의 주제와 확인 자료 일치',
      sub: '강의 주제(애드센스) = 확인 자료',
    },
    {
      text: '본인 명의 수입 확인',
      sub: '플랫폼 광고 수입이 강사 본인 소득금액증명원에 신고됨',
    },
  ],
  documents: {
    groups: [
      {
        title: '국세청 증빙',
        count: '2종',
        docs: [
          {
            iconLabel: '국세청',
            iconStyle: 'tax',
            title: '개인 소득금액증명원',
            meta: '2020~2024 귀속 · 발급 2026.04.20',
            verified: true,
          },
          {
            iconLabel: '국세청',
            iconStyle: 'tax',
            title: '개인사업자 부가세 과세표준증명',
            meta: '2020~2025 과세기간 · 발급 2026.04.20',
            verified: true,
          },
        ],
      },
      {
        title: '플랫폼 증빙',
        count: '2종',
        docs: [
          {
            iconLabel: '플랫폼',
            iconStyle: 'platform',
            title: '애드센스',
            meta: 'Google AdSense · 2020~2026',
            verified: false,
          },
          {
            iconLabel: '플랫폼',
            iconStyle: 'platform',
            title: '타불라',
            meta: 'Taboola · 2022~2026',
            verified: false,
          },
        ],
      },
    ],
    coverage: {
      title: '연도별 확인 커버리지',
      years: [
        { year: '2020', ok: true },
        { year: '2021', ok: true },
        { year: '2022', ok: true },
        { year: '2023', ok: true },
        { year: '2024', ok: true },
        { year: '2025', ok: true },
      ],
      note: '모든 연도 국세청 증빙(소득금액증명원 또는 부가세 과세표준증명)과 플랫폼 증빙 교차 대조 완료.',
      subNote:
        '2025년분은 소득금액증명원 발급 시점 이전으로 부가세 과세표준증명 기준으로 확인. 2026년 6월경 소득금액증명원 재확인 예정.',
    },
  },
  action: {
    title: '확인하고 싶은 강사가 있나요?',
    sub: '누구나 요청할 수 있습니다',
    buttonLabel: '강사 확인 요청하기',
  },
  payback: {
    monthlyNetIncome: 4867,
    monthlyNetLabel: '강사 월평균 사업 순이익',
    monthlyNetSub: '5개년 사업 순이익 평균 약 5.84억 ÷ 12개월',
    monthlyNetDisplay: '약 4,867만 원',
    sliderMin: 0,
    sliderMax: 2500,
    sliderStep: 1,
    defaultValue: 111,
    defaultNote:
      '기본값은 Proofit 전체 강사 평균 강의료 1,109,489원 기준입니다.',
    learningMonths: 3,
    learningNote: '※ 강의 수강 후 3개월 학습 기간 가정',
    explain:
      '수강생이 강사의 <strong>월평균 사업 순이익 수준</strong>에 도달한다고 가정한 계산. <strong>강의 수강 후 약 3개월 학습 기간</strong>을 가정합니다. 강사 수준 도달은 <strong>수강생의 재현 영역</strong>이며, 수강 여부 자체로 보장되지 않습니다. Proofit은 강의료 자체를 검증하지 않으며, 강의료 정보는 수강생 본인이 확인해야 합니다.',
  },
  legal: {
    disclaimerLabel: '면책 사항',
    disclaimerParagraphs: [
      '본 리포트는 수강생이 강사의 수익 수준을 확인할 수 있도록 강사가 제공한 증빙 자료 및 강사 공개 자료에 기초하여 분석한 자료입니다.',
      '소득금액증명원·부가세 과세표준증명 등 국세청 공식 발급 서류를 분석 기준으로 삼았습니다.',
      '플랫폼 증빙(외화)의 원화 환산은 서울외국환중개 월평균 기간별 매매기준율을 적용했습니다.',
      '본 리포트의 확인 대상은 강의 주제에 해당하는 수입원에 한정됩니다.',
      '본 리포트의 강사 주장은 Proofit 확인일 기준 강사 운영 공개 자료에서 확인된 내용이며, 원본 자료는 Proofit이 보관합니다.',
      '본 리포트는 수강생의 강의 수강 결정 참고를 위한 것으로, 그 외 용도로는 이용할 수 없습니다.',
      '강사의 미래 수익이나 수강생의 수익 실현을 보증하지 않으며, 강의료 적정성·수강 결정은 수강생의 자율 판단과 책임 하에 이루어집니다.',
    ],
  },
}
