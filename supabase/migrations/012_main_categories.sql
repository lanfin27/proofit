-- 대카테고리 컬럼 추가
-- 노션 "대카테고리" multi_select 속성에 매핑됨
-- 예: ["재테크", "이커머스", "콘텐츠수익화", "AI수익화", "기타"]

ALTER TABLE public.instructors
  ADD COLUMN IF NOT EXISTS main_categories TEXT[] NOT NULL DEFAULT '{}';
