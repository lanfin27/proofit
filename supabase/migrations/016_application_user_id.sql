-- 강사 수익확인 신청에 신청자 계정 정보 추가
-- 비로그인 신청은 null, 로그인 신청은 user_id/user_email 저장

ALTER TABLE public.instructor_applications
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS user_email TEXT;
