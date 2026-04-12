-- instructors 테이블
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  price_min INTEGER,
  price_max INTEGER,
  youtube_url TEXT,
  instagram_url TEXT,
  thread_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- courses 테이블
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  price INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- verification_requests 테이블
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(instructor_id, user_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_vr_instructor ON public.verification_requests(instructor_id);
CREATE INDEX IF NOT EXISTS idx_vr_user ON public.verification_requests(user_id);

-- RLS 활성화
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- instructors: 누구나 읽기
CREATE POLICY "instructors_select" ON public.instructors
  FOR SELECT USING (true);

-- courses: 누구나 읽기
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT USING (true);

-- verification_requests: 누구나 읽기 (카운트 표시용)
CREATE POLICY "vr_select" ON public.verification_requests
  FOR SELECT USING (true);

-- verification_requests: 인증된 사용자만 삽입
CREATE POLICY "vr_insert" ON public.verification_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
