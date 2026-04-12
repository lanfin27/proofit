import { InstructorSummary, Course } from '@/lib/types'

type RawMockInstructor = Omit<
  InstructorSummary,
  | 'course_count'
  | 'price_avg'
  | 'verification_documents'
  | 'info_updated_at'
  | 'main_categories'
>

const rawInstructors: RawMockInstructor[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    display_name: '재테크하는직장인',
    categories: ['재테크'],
    platforms: ['클래스101', '유튜브'],
    price_min: 89000,
    price_max: 390000,
    youtube_url: 'https://youtube.com/@jaetekjikjangin',
    instagram_url: 'https://instagram.com/jaetekjikjangin',
    thread_url: null,
    is_verified: true,
    verified_at: '2026-04-01T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    verification_count: 47,
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    display_name: '부동산읽어주는남자',
    categories: ['부동산'],
    platforms: ['유튜브', '자체채널'],
    price_min: 150000,
    price_max: 1200000,
    youtube_url: 'https://youtube.com/@budongsan-man',
    instagram_url: null,
    thread_url: null,
    is_verified: true,
    verified_at: '2026-03-15T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    verification_count: 63,
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    display_name: '주식쟁이김프로',
    categories: ['주식'],
    platforms: ['클래스101', '유튜브'],
    price_min: 79000,
    price_max: 290000,
    youtube_url: 'https://youtube.com/@kimpro-stock',
    instagram_url: null,
    thread_url: 'https://threads.net/@kimpro',
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-02T00:00:00Z',
    verification_count: 31,
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    display_name: '월급독립연구소',
    categories: ['재테크', '주식'],
    platforms: ['크몽', '유튜브'],
    price_min: 55000,
    price_max: 180000,
    youtube_url: 'https://youtube.com/@salary-free',
    instagram_url: 'https://instagram.com/salaryfree',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-03T00:00:00Z',
    verification_count: 22,
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    display_name: '아파트연구소장',
    categories: ['부동산'],
    platforms: ['클래스101'],
    price_min: 200000,
    price_max: 890000,
    youtube_url: null,
    instagram_url: 'https://instagram.com/apt-research',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-04T00:00:00Z',
    verification_count: 18,
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    display_name: '경매의신',
    categories: ['부동산'],
    platforms: ['크몽', '유튜브'],
    price_min: 120000,
    price_max: 750000,
    youtube_url: 'https://youtube.com/@auction-god',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-05T00:00:00Z',
    verification_count: 15,
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    display_name: '쿠팡셀러의정석',
    categories: ['이커머스'],
    platforms: ['클래스101', '자체채널'],
    price_min: 99000,
    price_max: 450000,
    youtube_url: null,
    instagram_url: 'https://instagram.com/coupang-master',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-06T00:00:00Z',
    verification_count: 29,
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    display_name: '마케팅천재홍대리',
    categories: ['마케팅'],
    platforms: ['크몽'],
    price_min: 60000,
    price_max: 200000,
    youtube_url: null,
    instagram_url: null,
    thread_url: 'https://threads.net/@hong-marketing',
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-07T00:00:00Z',
    verification_count: 12,
  },
  {
    id: '11111111-1111-1111-1111-111111111109',
    display_name: '파이어족김사장',
    categories: ['재테크'],
    platforms: ['유튜브', '클래스101'],
    price_min: 130000,
    price_max: 590000,
    youtube_url: 'https://youtube.com/@fire-kim',
    instagram_url: 'https://instagram.com/firekim',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-08T00:00:00Z',
    verification_count: 38,
  },
  {
    id: '11111111-1111-1111-1111-111111111110',
    display_name: '배당킹',
    categories: ['주식'],
    platforms: ['유튜브'],
    price_min: 70000,
    price_max: 70000,
    youtube_url: 'https://youtube.com/@dividend-king',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-09T00:00:00Z',
    verification_count: 9,
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    display_name: '스마트스토어로퇴사하기',
    categories: ['이커머스'],
    platforms: ['크몽', '유튜브'],
    price_min: 80000,
    price_max: 350000,
    youtube_url: 'https://youtube.com/@smartstore-quit',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-10T00:00:00Z',
    verification_count: 25,
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    display_name: '재테크언니',
    categories: ['재테크'],
    platforms: ['유튜브', '클래스101'],
    price_min: 95000,
    price_max: 320000,
    youtube_url: 'https://youtube.com/@jaetech-unni',
    instagram_url: 'https://instagram.com/jaetechunni',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-11T00:00:00Z',
    verification_count: 41,
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    display_name: '부동산탐정',
    categories: ['부동산'],
    platforms: ['탈잉', '유튜브'],
    price_min: 100000,
    price_max: 480000,
    youtube_url: 'https://youtube.com/@realestate-detective',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-12T00:00:00Z',
    verification_count: 14,
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    display_name: '차트의마법사',
    categories: ['주식'],
    platforms: ['클래스101'],
    price_min: 190000,
    price_max: 590000,
    youtube_url: null,
    instagram_url: 'https://instagram.com/chart-wizard',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-13T00:00:00Z',
    verification_count: 35,
  },
  {
    id: '11111111-1111-1111-1111-111111111115',
    display_name: '퍼포먼스마케터박과장',
    categories: ['마케팅'],
    platforms: ['크몽', '자체채널'],
    price_min: 75000,
    price_max: 280000,
    youtube_url: null,
    instagram_url: 'https://instagram.com/park-marketer',
    thread_url: 'https://threads.net/@parkmarketer',
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-14T00:00:00Z',
    verification_count: 8,
  },
  {
    id: '11111111-1111-1111-1111-111111111116',
    display_name: '돈이되는경제',
    categories: ['재테크'],
    platforms: ['유튜브'],
    price_min: 50000,
    price_max: 150000,
    youtube_url: 'https://youtube.com/@money-economy',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-15T00:00:00Z',
    verification_count: 19,
  },
  {
    id: '11111111-1111-1111-1111-111111111117',
    display_name: '갭투자의달인',
    categories: ['부동산'],
    platforms: ['클래스101', '유튜브'],
    price_min: 180000,
    price_max: 980000,
    youtube_url: 'https://youtube.com/@gap-invest',
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-16T00:00:00Z',
    verification_count: 27,
  },
  {
    id: '11111111-1111-1111-1111-111111111118',
    display_name: '직장인재테크연구소',
    categories: ['재테크'],
    platforms: ['크몽'],
    price_min: 65000,
    price_max: 65000,
    youtube_url: null,
    instagram_url: null,
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-17T00:00:00Z',
    verification_count: 5,
  },
  {
    id: '11111111-1111-1111-1111-111111111119',
    display_name: '미국주식하는의사',
    categories: ['주식', '재테크'],
    platforms: ['유튜브', '클래스101'],
    price_min: 110000,
    price_max: 490000,
    youtube_url: 'https://youtube.com/@usdoc-stock',
    instagram_url: 'https://instagram.com/usdocstock',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-18T00:00:00Z',
    verification_count: 52,
  },
  {
    id: '11111111-1111-1111-1111-111111111120',
    display_name: '월세로은퇴하기',
    categories: ['부동산', '재테크'],
    platforms: ['탈잉', '자체채널'],
    price_min: 160000,
    price_max: 2000000,
    youtube_url: null,
    instagram_url: 'https://instagram.com/monthly-retire',
    thread_url: null,
    is_verified: false,
    verified_at: null,
    created_at: '2026-03-19T00:00:00Z',
    verification_count: 33,
  },
]

export const mockCourses: Course[] = [
  // 재테크하는직장인
  { id: '22222222-0001-0001-0001-000000000001', instructor_id: '11111111-1111-1111-1111-111111111101', title: '월급쟁이 재테크 올인원 패키지', platform: '클래스101', price: 390000, url: 'https://class101.net/example1', created_at: '2026-03-01T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000002', instructor_id: '11111111-1111-1111-1111-111111111101', title: '직장인 재테크 시작하기', platform: '유튜브', price: 89000, url: 'https://youtube.com/@jaetekjikjangin/membership', created_at: '2026-03-01T00:00:00Z' },
  // 부동산읽어주는남자
  { id: '22222222-0001-0001-0001-000000000003', instructor_id: '11111111-1111-1111-1111-111111111102', title: '부동산 투자 마스터클래스', platform: '자체채널', price: 1200000, url: 'https://example.com/budongsan1', created_at: '2026-03-01T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000004', instructor_id: '11111111-1111-1111-1111-111111111102', title: '아파트 분석 기초', platform: '유튜브', price: 150000, url: 'https://youtube.com/@budongsan-man/membership', created_at: '2026-03-01T00:00:00Z' },
  // 주식쟁이김프로
  { id: '22222222-0001-0001-0001-000000000005', instructor_id: '11111111-1111-1111-1111-111111111103', title: '차트 분석 완전 정복', platform: '클래스101', price: 290000, url: 'https://class101.net/example3', created_at: '2026-03-02T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000006', instructor_id: '11111111-1111-1111-1111-111111111103', title: '주식 초보 탈출기', platform: '유튜브', price: 79000, url: 'https://youtube.com/@kimpro-stock/membership', created_at: '2026-03-02T00:00:00Z' },
  // 월급독립연구소
  { id: '22222222-0001-0001-0001-000000000007', instructor_id: '11111111-1111-1111-1111-111111111104', title: '월급 독립 프로젝트', platform: '크몽', price: 180000, url: 'https://kmong.com/example4', created_at: '2026-03-03T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000008', instructor_id: '11111111-1111-1111-1111-111111111104', title: 'ETF로 월급 만들기', platform: '유튜브', price: 55000, url: 'https://youtube.com/@salary-free/membership', created_at: '2026-03-03T00:00:00Z' },
  // 아파트연구소장
  { id: '22222222-0001-0001-0001-000000000009', instructor_id: '11111111-1111-1111-1111-111111111105', title: '아파트 청약 완전 가이드', platform: '클래스101', price: 200000, url: 'https://class101.net/example5', created_at: '2026-03-04T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000010', instructor_id: '11111111-1111-1111-1111-111111111105', title: '재건축·재개발 투자 전략', platform: '클래스101', price: 890000, url: 'https://class101.net/example5b', created_at: '2026-03-04T00:00:00Z' },
  // 경매의신
  { id: '22222222-0001-0001-0001-000000000011', instructor_id: '11111111-1111-1111-1111-111111111106', title: '경매 입문부터 낙찰까지', platform: '크몽', price: 120000, url: 'https://kmong.com/example6', created_at: '2026-03-05T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000012', instructor_id: '11111111-1111-1111-1111-111111111106', title: '경매 고급 실전반', platform: '유튜브', price: 750000, url: 'https://youtube.com/@auction-god/membership', created_at: '2026-03-05T00:00:00Z' },
  // 쿠팡셀러의정석
  { id: '22222222-0001-0001-0001-000000000013', instructor_id: '11111111-1111-1111-1111-111111111107', title: '쿠팡 셀러 시작하기', platform: '클래스101', price: 99000, url: 'https://class101.net/example7', created_at: '2026-03-06T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000014', instructor_id: '11111111-1111-1111-1111-111111111107', title: '쿠팡 셀러 매출 3배 올리기', platform: '자체채널', price: 450000, url: 'https://example.com/coupang-master', created_at: '2026-03-06T00:00:00Z' },
  // 마케팅천재홍대리
  { id: '22222222-0001-0001-0001-000000000015', instructor_id: '11111111-1111-1111-1111-111111111108', title: '퍼포먼스 마케팅 기초', platform: '크몽', price: 60000, url: 'https://kmong.com/example8', created_at: '2026-03-07T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000016', instructor_id: '11111111-1111-1111-1111-111111111108', title: 'SNS 광고 ROI 극대화', platform: '크몽', price: 200000, url: 'https://kmong.com/example8b', created_at: '2026-03-07T00:00:00Z' },
  // 파이어족김사장
  { id: '22222222-0001-0001-0001-000000000017', instructor_id: '11111111-1111-1111-1111-111111111109', title: '파이어족 로드맵', platform: '클래스101', price: 590000, url: 'https://class101.net/example9', created_at: '2026-03-08T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000018', instructor_id: '11111111-1111-1111-1111-111111111109', title: '30대 조기 은퇴 전략', platform: '유튜브', price: 130000, url: 'https://youtube.com/@fire-kim/membership', created_at: '2026-03-08T00:00:00Z' },
  // 배당킹
  { id: '22222222-0001-0001-0001-000000000019', instructor_id: '11111111-1111-1111-1111-111111111110', title: '배당주 투자 입문', platform: '유튜브', price: 70000, url: 'https://youtube.com/@dividend-king/membership', created_at: '2026-03-09T00:00:00Z' },
  // 스마트스토어로퇴사하기
  { id: '22222222-0001-0001-0001-000000000020', instructor_id: '11111111-1111-1111-1111-111111111111', title: '스마트스토어 창업 A to Z', platform: '크몽', price: 80000, url: 'https://kmong.com/example11', created_at: '2026-03-10T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000021', instructor_id: '11111111-1111-1111-1111-111111111111', title: '스마트스토어 매출 1억 달성기', platform: '유튜브', price: 350000, url: 'https://youtube.com/@smartstore-quit/membership', created_at: '2026-03-10T00:00:00Z' },
  // 재테크언니
  { id: '22222222-0001-0001-0001-000000000022', instructor_id: '11111111-1111-1111-1111-111111111112', title: '2030 여성 재테크', platform: '클래스101', price: 320000, url: 'https://class101.net/example12', created_at: '2026-03-11T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000023', instructor_id: '11111111-1111-1111-1111-111111111112', title: '재테크 습관 만들기', platform: '유튜브', price: 95000, url: 'https://youtube.com/@jaetech-unni/membership', created_at: '2026-03-11T00:00:00Z' },
  // 부동산탐정
  { id: '22222222-0001-0001-0001-000000000024', instructor_id: '11111111-1111-1111-1111-111111111113', title: '부동산 시세 분석법', platform: '탈잉', price: 100000, url: 'https://taling.me/example13', created_at: '2026-03-12T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000025', instructor_id: '11111111-1111-1111-1111-111111111113', title: '지역분석 마스터', platform: '유튜브', price: 480000, url: 'https://youtube.com/@realestate-detective/membership', created_at: '2026-03-12T00:00:00Z' },
  // 차트의마법사
  { id: '22222222-0001-0001-0001-000000000026', instructor_id: '11111111-1111-1111-1111-111111111114', title: '기술적 분석 완벽 가이드', platform: '클래스101', price: 590000, url: 'https://class101.net/example14', created_at: '2026-03-13T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000027', instructor_id: '11111111-1111-1111-1111-111111111114', title: '캔들 차트 읽는 법', platform: '클래스101', price: 190000, url: 'https://class101.net/example14b', created_at: '2026-03-13T00:00:00Z' },
  // 퍼포먼스마케터박과장
  { id: '22222222-0001-0001-0001-000000000028', instructor_id: '11111111-1111-1111-1111-111111111115', title: '구글 광고 마스터', platform: '크몽', price: 75000, url: 'https://kmong.com/example15', created_at: '2026-03-14T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000029', instructor_id: '11111111-1111-1111-1111-111111111115', title: '메타 광고 실전 전략', platform: '자체채널', price: 280000, url: 'https://example.com/park-marketer', created_at: '2026-03-14T00:00:00Z' },
  // 돈이되는경제
  { id: '22222222-0001-0001-0001-000000000030', instructor_id: '11111111-1111-1111-1111-111111111116', title: '경제 뉴스 읽는 법', platform: '유튜브', price: 50000, url: 'https://youtube.com/@money-economy/membership', created_at: '2026-03-15T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000031', instructor_id: '11111111-1111-1111-1111-111111111116', title: '인플레이션 시대 재테크', platform: '유튜브', price: 150000, url: 'https://youtube.com/@money-economy/course2', created_at: '2026-03-15T00:00:00Z' },
  // 갭투자의달인
  { id: '22222222-0001-0001-0001-000000000032', instructor_id: '11111111-1111-1111-1111-111111111117', title: '갭투자 실전 가이드', platform: '클래스101', price: 980000, url: 'https://class101.net/example17', created_at: '2026-03-16T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000033', instructor_id: '11111111-1111-1111-1111-111111111117', title: '전세 레버리지 전략', platform: '유튜브', price: 180000, url: 'https://youtube.com/@gap-invest/membership', created_at: '2026-03-16T00:00:00Z' },
  // 직장인재테크연구소
  { id: '22222222-0001-0001-0001-000000000034', instructor_id: '11111111-1111-1111-1111-111111111118', title: '직장인 목돈 만들기', platform: '크몽', price: 65000, url: 'https://kmong.com/example18', created_at: '2026-03-17T00:00:00Z' },
  // 미국주식하는의사
  { id: '22222222-0001-0001-0001-000000000035', instructor_id: '11111111-1111-1111-1111-111111111119', title: '미국 주식 입문', platform: '클래스101', price: 490000, url: 'https://class101.net/example19', created_at: '2026-03-18T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000036', instructor_id: '11111111-1111-1111-1111-111111111119', title: 'S&P500 장기투자 전략', platform: '유튜브', price: 110000, url: 'https://youtube.com/@usdoc-stock/membership', created_at: '2026-03-18T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000037', instructor_id: '11111111-1111-1111-1111-111111111119', title: '미국 ETF 포트폴리오', platform: '클래스101', price: 390000, url: 'https://class101.net/example19b', created_at: '2026-03-18T00:00:00Z' },
  // 월세로은퇴하기
  { id: '22222222-0001-0001-0001-000000000038', instructor_id: '11111111-1111-1111-1111-111111111120', title: '월세 수익형 부동산', platform: '탈잉', price: 160000, url: 'https://taling.me/example20', created_at: '2026-03-19T00:00:00Z' },
  { id: '22222222-0001-0001-0001-000000000039', instructor_id: '11111111-1111-1111-1111-111111111120', title: '임대사업자 절세 전략', platform: '자체채널', price: 2000000, url: 'https://example.com/monthly-retire', created_at: '2026-03-19T00:00:00Z' },
]

// mockInstructors: InstructorSummary 형태로 course_count와 price_avg를 계산해서 export
export const mockInstructors: InstructorSummary[] = rawInstructors.map((inst) => {
  const courses = mockCourses.filter((c) => c.instructor_id === inst.id)
  const prices = courses.map((c) => c.price)
  const courseCount = courses.length
  const priceAvg =
    prices.length > 0
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : null
  // 첫 카테고리를 기반으로 대카테고리 추론 (mock 전용)
  const toMainCategory = (categories: string[]): string => {
    const first = categories[0] ?? '기타'
    if (['재테크', '부동산', '주식'].includes(first)) return '재테크'
    if (['이커머스', '스마트스토어', '쿠팡', '전자책'].includes(first))
      return '이커머스'
    if (['마케팅', '유튜브', '블로그', '인스타그램', '틱톡'].includes(first))
      return '콘텐츠수익화'
    if (['워드프레스', 'AI'].includes(first)) return 'AI수익화'
    return '기타'
  }

  return {
    ...inst,
    main_categories: [toMainCategory(inst.categories)],
    course_count: courseCount,
    price_avg: priceAvg,
    verification_documents: inst.is_verified
      ? ['소득금액증명원', '부가세신고서']
      : [],
    info_updated_at: '2026-04-11T00:00:00Z',
  }
})
