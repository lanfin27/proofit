-- 더미 데이터 정리 — 노션 동기화 전에 수동 실행
-- 주의: 모든 데이터가 삭제된다. verification_requests 포함.
-- 실행 후 관리자 페이지에서 "노션 동기화"를 클릭하여 실제 데이터로 재생성.

DELETE FROM public.verification_requests;
DELETE FROM public.courses;
DELETE FROM public.instructors;
