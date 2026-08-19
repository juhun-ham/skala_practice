-- Q2. 대소문자를 무시한 정확한 이메일 검색

-- Baseline 1: 컬럼에 LOWER()를 적용해 일반 email 인덱스를 사용하지 못한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE LOWER(email) = 'user1234@example.com';

-- Option 1: 쿼리 표현식과 동일한 인덱스를 만든다.
-- 대소문자가 혼합되어 저장될 수 있을 때 적합하다.
CREATE INDEX IF NOT EXISTS idx_employees_lower_email
ON hr.employees (LOWER(email));

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE LOWER(email) = 'user1234@example.com';

-- Baseline 2: ILIKE도 기존 대소문자 구분 B-tree 인덱스를 활용하지 못했다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE email ILIKE 'user1234@example.com';

-- Option 2: 이메일이 항상 소문자로 저장된다는 규칙이 보장된다면
-- 컬럼 대신 입력값만 정규화하여 기존 employees_email_key를 재사용한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE email = LOWER('USER1234@EXAMPLE.COM');

-- 실습 결과: 26.420ms → 0.047ms, shared hit 786 → 4.
-- 저장 규칙이 보장된다면 추가 인덱스가 필요 없는 Option 2가 우선이다.
