-- Q3. 이메일 접미사·도메인 검색

-- Baseline 1: 선행 와일드카드 때문에 기존 B-tree 인덱스를 사용할 수 없다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE email LIKE '%gmail.com';

-- Option 1: Gmail 조회가 고정 요구사항일 때 사용하는 부분 커버링 인덱스
CREATE INDEX IF NOT EXISTS idx_employees_gmail_partial
ON hr.employees (employee_id)
INCLUDE (first_name, last_name, email)
WHERE email LIKE '%gmail.com';

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE email LIKE '%gmail.com';

-- 실습 결과: 6.863ms → 0.251ms, Index Only Scan, Heap Fetches 0.

-- Baseline 2: 모든 행에서 도메인을 계산하므로 Seq Scan이 발생한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE SPLIT_PART(email, '@', 2) = 'gmail.com';

-- Option 2: 여러 이메일 도메인을 반복 검색할 때 사용할 표현식 인덱스
CREATE INDEX IF NOT EXISTS idx_employees_email_domain
ON hr.employees (SPLIT_PART(email, '@', 2));

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, email
FROM hr.employees
WHERE SPLIT_PART(email, '@', 2) = 'gmail.com';

-- 실습 결과: 7.882ms → 1.198ms, Bitmap Index Scan + Bitmap Heap Scan.
-- Gmail만 조회하면 Option 1, 다양한 도메인이 필요하면 Option 2가 적합하다.
