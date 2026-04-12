-- 강사 정보의 최종 업데이트 일자
-- 노션의 "정보업데이트일자" date 속성에 매핑됨
-- 강사 상세 페이지 맨 하단에 표시용

ALTER TABLE public.instructors
  ADD COLUMN IF NOT EXISTS info_updated_at TIMESTAMPTZ;
