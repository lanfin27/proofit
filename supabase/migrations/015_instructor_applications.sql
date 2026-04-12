-- 강사 수익확인 신청 테이블
-- 강사가 직접 수익확인을 신청할 때 사용

CREATE TABLE IF NOT EXISTS public.instructor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  course_link TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ia_created ON public.instructor_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ia_status ON public.instructor_applications(status);

ALTER TABLE public.instructor_applications ENABLE ROW LEVEL SECURITY;

-- 누구나 삽입 가능 (로그인 불필요 — 강사 본인이 신청)
CREATE POLICY "ia_insert" ON public.instructor_applications
  FOR INSERT WITH CHECK (true);

-- 읽기는 관리자만 (서버 사이드에서 admin 체크)
CREATE POLICY "ia_select" ON public.instructor_applications
  FOR SELECT USING (true);
