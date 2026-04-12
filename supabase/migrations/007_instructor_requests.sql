-- 강사 확인 요청 (수강생이 "이 강사도 확인해주세요"라고 신청)
CREATE TABLE IF NOT EXISTS public.instructor_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  instructor_name TEXT NOT NULL,
  course_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ir_user ON public.instructor_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ir_created ON public.instructor_requests(created_at DESC);

ALTER TABLE public.instructor_requests ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 (관리자 페이지에서 anon으로 조회 가능하도록; 실제 노출 제어는 layout 인증으로 처리)
CREATE POLICY "ir_select" ON public.instructor_requests
  FOR SELECT USING (true);

-- 인증된 사용자만 자신 명의로 삽입
CREATE POLICY "ir_insert" ON public.instructor_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
