-- notion_id 컬럼 추가: 노션 동기화 시 upsert 키로 사용
ALTER TABLE public.instructors
  ADD COLUMN IF NOT EXISTS notion_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_instructors_notion_id ON public.instructors(notion_id);
