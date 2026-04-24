import type { Report, ReportInstructor } from '@/lib/report-types'

export const alphanamInstructor: ReportInstructor = {
  slug: 'alphanam',
  name: '알파남',
  tags: ['애드센스', '블로그', '워드프레스'],
  status: 'draft',
  reportCompletedAt: '2026-04-23',
}

export const alphanamReport: Report = {
  instructorSlug: 'alphanam',
  profile: {
    name: '알파남',
    initial: '알',
    subject: '애드센스 광고수입 수익화 강의',
  },
  badges: [
    { label: '확인 완료', type: 'confirmed' },
    { label: '애드센스', type: 'tag' },
    { label: '블로그', type: 'tag' },
    { label: '워드프레스', type: 'tag' },
  ],
  video: {
    title: '진위확인 영상',
    desc: '국세청 홈택스 실시간 조회 · 1분 12초',
    href: 'https://youtube.com/...',
  },
  heroNumber: {
    label: '누적 광고수입',
    value: '약 39',
    unit: '억 원',
    sub: '2020~2025 · 국세청 × 플랫폼 증빙 교차 확인',
  },
  heroStats: [
    { label: '5개년 사업수입', value: '약 56억' },
    { label: '연평균 광고수입', value: '약 6.6억' },
    { label: '팩트 확인', value: '7 / 7' },
  ],
  claims: {
    sectionTitle: '강사 주장 확인',
    sectionSub: '공개 자료의 수익 주장을 증빙과 교차 대조',
    ringScore: '2 / 2',
    ringTitle: '강의 주제 주장 2건 부합',
    ringSub: '애드센스 누적 · 일 최고 모두 규모 일치',
    items: [
      {
        topic: '애드센스 누적 수익',
        status: '실현 확인',
        statusType: 'matched',
        claim: '애드센스 누적 수익 $2,500,000 (약 35억 원)',
        detail:
          '애드센스 <strong>플랫폼 증빙 2계정 누적</strong>이 국세청 소득금액증명상 <strong>5개년 사업수입 약 56억 원</strong>과 정합 범위 내로 확인.',
      },
      {
        topic: '일 최대 수익',
        status: '실현 확인',
        statusType: 'matched',
        claim: '일 최대 수익 $23,000 (약 3,200만 원)',
        detail:
          '2022년 Peak 구간 <strong>플랫폼 증빙 일별 기록</strong>에서 주장 수준 근접 일자 확인. 타불라 기준 <strong>일 PV 368만 건</strong> 기록.',
      },
      {
        topic: '월 최대 수익',
        status: '스코프 외',
        statusType: 'scope',
        claim: '월 최대 순수익 9억 원',
        detail:
          '애드센스·타불라 기준 월 약 7.5억 원까지 확인. 9억 원 주장은 강의 주제 외 수입원 포함으로 추정되며, <strong>본 리포트 확인 범위(애드센스)를 벗어남</strong>.',
        outOfScope: true,
      },
    ],
  },
  process: {
    sectionTitle: '확인 과정',
    sectionSub: '표준 3단계 절차',
    steps: [
      {
        num: 1,
        title: '국세청 증빙 진위확인',
        desc: '소득금액증명원·부가세 과세표준증명 홈택스 발급번호 검증',
        videoLink: {
          href: 'https://youtube.com/...',
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
        desc: '모든 강사에 동일 적용 · 팩트 7개 + 판단 포인트 14개',
      },
    ],
  },
  checklist: {
    sectionTitle: '팩트 확인',
    sectionSub: '표준 7개 항목 모두 통과',
    items: [
      {
        text: '개인 소득금액증명원 진위확인',
        sub: '2020~2024 귀속 · 홈택스 통과',
      },
      {
        text: '개인사업자 부가세 과세표준증명 진위확인',
        sub: '2020~2025 과세기간 · 홈택스 통과',
      },
      {
        text: '플랫폼 증빙 수령',
        sub: '애드센스 2계정 + 타불라 5채널',
      },
      {
        text: '플랫폼 증빙 × 국세청 신고 연도별 대조',
        sub: '5개년 모두 정합 범위 내',
      },
      {
        text: '공개 주장 × 증빙 교차 확인',
        sub: '강의 주제 주장 2건 규모 부합',
      },
      {
        text: '강의 주제와 확인 자료 일치',
        sub: '강의 주제(애드센스) = 확인 자료',
      },
      {
        text: '수익 신고 주체 일치성',
        sub: '애드센스·타불라 수입이 개인 소득금액증명원에 포함',
      },
    ],
  },
  consistency: {
    sectionTitle: '연도별 정합 상태',
    sectionSub: '국세청 신고 × 플랫폼 증빙 대조',
    verdictTitle: '5개년 모두 정합 범위 내',
    verdictSub: '환율 환산 ±30% 오차 허용 기준',
    years: [
      { year: '2020', govWidth: '100%', platformWidth: '40%' },
      { year: '2021', govWidth: '100%', platformWidth: '62%' },
      {
        year: '2022',
        govWidth: '92%',
        platformWidth: '100%',
        note: '환율 오차 범위 내 역전',
      },
      { year: '2023', govWidth: '100%', platformWidth: '81%' },
      { year: '2024', govWidth: '100%', platformWidth: '19%' },
    ],
    foot: '각 연도 국세청 신고를 기준(100%)으로 정규화한 상대 비율. 절대값은 강사 동의 범위 내 비공개.',
  },
  payback: {
    sectionTitle: '강의료 참고 맥락',
    sectionSub: '강사 수익 수준 도달 시 회수 기간',
    premise:
      '수강생이 강사의 <strong>확인된 월평균 광고수입 수준</strong>에 도달한다고 가정한 단순 계산.',
    monthlyLabel: '강사 월평균 광고수입',
    monthlyValue: '약 5,500',
    monthlyUnit: '만 원',
    monthlySub: '연평균 6.6억 ÷ 12개월',
    tableHeaders: ['강의료', '회수 기간'],
    rows: [
      { fee: '150만 원', days: '약 0.8일' },
      { fee: '500만 원', days: '약 2.7일' },
      { fee: '990만 원', days: '약 5.4일' },
    ],
    warning:
      '<strong>해석 주의.</strong> 수강만으로 강사 수준 도달을 보장하지 않으며, 재현 가능성 판단은 수강생의 영역입니다.',
  },
  judgment: {
    sectionTitle: '판단 포인트',
    sectionSub: '표준 14개 항목 중 해당 사항',
    checkedCount: '9',
    totalCount: '14',
    groups: [
      {
        title: 'A. 수익 주장 정확성',
        count: '3 / 5',
        items: [
          { label: '매출 · 순이익 개념 혼용', checked: true },
          { label: 'Peak 시점 수치를 현재형으로 표기', checked: true },
          { label: '특정 월/일 극값을 상시값처럼 표기', checked: true },
          { label: '세전 · 세후 개념 혼용', checked: false },
          { label: '환율 · 환산 기준 미명시', checked: false },
        ],
      },
      {
        title: 'B. 수익 구조 투명성',
        count: '4 / 4',
        items: [
          { label: '주 수입원 단일 채널 집중 (80% 초과)', checked: true },
          { label: '최근 3년 내 사업모델 전환 이력', checked: true },
          { label: '알고리즘 · 플랫폼 정책 의존도 높음', checked: true },
          {
            label: '현재 수익이 Peak 시점 대비 50% 이하',
            checked: true,
          },
        ],
      },
      {
        title: 'C. 재현 가능성',
        count: '2 / 5',
        items: [
          { label: '초기 진입 타이밍이 수익의 핵심 요인', checked: true },
          { label: '개인 브랜드 · 인지도 기반 수익', checked: false },
          { label: '법적 · 규제 변화 영향 큰 영역', checked: false },
          { label: '경쟁 진입 장벽 낮음', checked: true },
          { label: '대량 자본 · 인프라 투입 필요', checked: false },
        ],
      },
    ],
  },
  documents: {
    sectionTitle: '확인 자료',
    sectionSub: '강의 주제 관련 자료 4종',
    items: [
      {
        iconLabel: '국세청',
        iconType: 'official',
        title: '개인 소득금액증명원',
        meta: '2020~2024 귀속 · 발급 2026.04.20',
        verified: true,
      },
      {
        iconLabel: '국세청',
        iconType: 'official',
        title: '개인사업자 부가세 과세표준증명',
        meta: '2020~2025 과세기간 · 발급 2026.04.20',
        verified: true,
      },
      {
        iconLabel: '플랫폼',
        iconType: 'platform',
        title: '애드센스 플랫폼 증빙',
        meta: 'Google AdSense · 계정 2개 · 2020~2026',
      },
      {
        iconLabel: '플랫폼',
        iconType: 'platform',
        title: '타불라 플랫폼 증빙',
        meta: 'Taboola · 채널 5개 · 2022~2026',
      },
    ],
    coverage: {
      title: '연도별 확인 커버리지',
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      note: '모든 연도 국세청 증빙(소득금액증명원 또는 부가세 과세표준증명)과 플랫폼 증빙 교차 대조 완료.',
    },
  },
  action: {
    title: '확인받고 싶은 강사가 있나요?',
    sub: '누구나 요청할 수 있습니다',
    buttonText: '강사 확인 요청하기',
  },
  disclaimer:
    '<strong>확인 범위와 한계.</strong> 본 리포트는 강사 본인이 제공한 자료와 국세청 등 공식 발급 증빙을 기반으로 Proofit이 수행한 업무상 참고 분석입니다. <strong>공인회계사법상 인증업무(assurance engagement)가 아니며</strong>, 법적 효력이 없습니다. 플랫폼 증빙은 제3자 진위확인 불가한 자료임을 명시합니다. 확인 대상은 강의 주제(애드센스)에 해당하는 수입원에 한정됩니다. 강사의 미래 수익이나 수강생의 수익 실현을 보증하지 않으며, 강의료 적정성·수강 결정은 수강생의 자율 판단에 따릅니다.',
  meta: {
    version: '리포트 v1.0 · 2026.04.23',
    date: '2026.04.23',
    correctionLabel: '정보 수정 요청',
  },
}
