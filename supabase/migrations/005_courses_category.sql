-- courses 테이블에 category 컬럼 추가
-- 같은 강사가 여러 카테고리의 강의를 가질 수 있으므로 강의별로 카테고리를 저장한다
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS category TEXT;
