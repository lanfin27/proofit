-- 인증 시 확인된 증빙 서류 목록
-- 노션의 "확인완료" multi_select에 매핑됨
-- 예: ["소득금액증명원", "부가세신고서"]

ALTER TABLE public.instructors
  ADD COLUMN IF NOT EXISTS verification_documents TEXT[] NOT NULL DEFAULT '{}';
