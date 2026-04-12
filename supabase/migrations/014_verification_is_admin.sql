-- 확인 요청에 관리자 구분 추가 + 일반 유저만 강사당 1회 제한

-- 1) is_admin 컬럼 추가
ALTER TABLE public.verification_requests
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- 2) 기존 column-level UNIQUE 제약 제거
-- (UNIQUE(instructor_id, user_id) — Postgres 자동 이름: verification_requests_instructor_id_user_id_key)
ALTER TABLE public.verification_requests
  DROP CONSTRAINT IF EXISTS verification_requests_instructor_id_user_id_key;

-- 3) 부분 UNIQUE 인덱스: 일반 유저(is_admin=false)만 강사당 1회 제한
-- 관리자는 여러 번 INSERT 가능
CREATE UNIQUE INDEX IF NOT EXISTS idx_vr_unique_non_admin
  ON public.verification_requests(instructor_id, user_id)
  WHERE is_admin = false;
