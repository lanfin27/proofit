-- instructor_summary: 강사 정보 + 강의 통계 + 확인 요청 수를 한 번에 조회
CREATE OR REPLACE VIEW public.instructor_summary AS
SELECT
  i.id,
  i.display_name,
  i.categories,
  i.platforms,
  i.youtube_url,
  i.instagram_url,
  i.thread_url,
  i.is_verified,
  i.verified_at,
  i.created_at,
  COALESCE(c.course_count, 0)::int AS course_count,
  c.price_min,
  c.price_max,
  c.price_avg,
  COALESCE(v.verification_count, 0)::int AS verification_count
FROM public.instructors i
LEFT JOIN (
  SELECT
    instructor_id,
    COUNT(*)::int AS course_count,
    MIN(price)::int AS price_min,
    MAX(price)::int AS price_max,
    ROUND(AVG(price))::int AS price_avg
  FROM public.courses
  GROUP BY instructor_id
) c ON i.id = c.instructor_id
LEFT JOIN (
  SELECT
    instructor_id,
    COUNT(*)::int AS verification_count
  FROM public.verification_requests
  GROUP BY instructor_id
) v ON i.id = v.instructor_id;

-- View에 RLS 적용을 위해 security_invoker 설정
ALTER VIEW public.instructor_summary SET (security_invoker = on);
