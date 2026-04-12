-- display_name에 UNIQUE 제약 추가
-- 노션 동기화 시 display_name 기준으로 upsert하기 위함
-- 주의: 기존 중복 데이터가 있으면 ALTER가 실패한다.
-- 실행 전 중복 정리 필요:
--   SELECT display_name, COUNT(*) FROM instructors GROUP BY display_name HAVING COUNT(*) > 1;
--   DELETE FROM instructors a USING instructors b
--     WHERE a.id > b.id AND a.display_name = b.display_name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_instructors_display_name
  ON public.instructors(display_name);
