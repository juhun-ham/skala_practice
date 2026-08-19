-- Q5. 부서가 10이거나 직무가 3, 4, 5인 직원 검색

-- Baseline: 두 조건에 인덱스가 없으면 전체 테이블을 확인한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, department_id, job_id
FROM hr.employees
WHERE department_id = 10
   OR job_id IN (3, 4, 5);

-- 각 OR 조건에 독립적으로 사용할 수 있는 인덱스를 생성한다.
CREATE INDEX IF NOT EXISTS idx_employees_department_id
ON hr.employees (department_id);

CREATE INDEX IF NOT EXISTS idx_employees_job_id
ON hr.employees (job_id);

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, department_id, job_id
FROM hr.employees
WHERE department_id = 10
   OR job_id IN (3, 4, 5);

-- PostgreSQL은 두 Bitmap Index Scan을 BitmapOr로 합친다.
-- 실습 결과: 7.938ms → 2.026ms.

-- Anti-pattern: 숫자 컬럼을 TEXT로 변환하면 위의 정수형 인덱스를 이용하지 못한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, department_id, job_id
FROM hr.employees
WHERE department_id::TEXT = '10'
   OR job_id::TEXT IN ('3', '4', '5');

-- 기존 쿼리를 변경할 수 없을 때만 고려할 표현식 인덱스
CREATE INDEX IF NOT EXISTS idx_employees_department_text
ON hr.employees ((department_id::TEXT));

CREATE INDEX IF NOT EXISTS idx_employees_job_text
ON hr.employees ((job_id::TEXT));

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, department_id, job_id
FROM hr.employees
WHERE department_id::TEXT = '10'
   OR job_id::TEXT IN ('3', '4', '5');

-- 실습 결과: 15.503ms → 2.182ms.
-- 쿼리를 바꿀 수 있다면 형변환을 제거하고 일반 정수형 인덱스를 쓰는 편이 낫다.
