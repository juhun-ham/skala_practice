-- Q4. 최근 365일 이내 입사한 재직자 중 연봉 Top 100

-- Baseline: 50,000건을 Seq Scan하고 조건을 통과한 9,565건을 정렬한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, hire_date, salary, status
FROM hr.employees
WHERE status = 'ACTIVE'
  AND hire_date >= CURRENT_DATE - INTERVAL '365 days'
ORDER BY salary DESC
LIMIT 100;

-- 필터 시작점과 정렬 순서를 고려한 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_employees_status_salary_hire
ON hr.employees (status, salary DESC, hire_date);

EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, hire_date, salary, status
FROM hr.employees
WHERE status = 'ACTIVE'
  AND hire_date >= CURRENT_DATE - INTERVAL '365 days'
ORDER BY salary DESC
LIMIT 100;

-- 실습 결과: 18.924ms → 0.176ms.
-- salary 순서로 읽으면서 hire_date를 확인하고 100건을 찾으면 탐색을 멈춘다.

-- Anti-pattern: 결과에 순위가 필요하지 않은데 모든 대상에 ROW_NUMBER()를 계산한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH ranked_employees AS (
    SELECT
        employee_id,
        first_name,
        last_name,
        hire_date,
        salary,
        status,
        ROW_NUMBER() OVER (ORDER BY salary DESC) AS salary_rank
    FROM hr.employees
    WHERE status = 'ACTIVE'
      AND hire_date >= CURRENT_DATE - INTERVAL '365 days'
)
SELECT employee_id, first_name, last_name, hire_date, salary, status
FROM ranked_employees
WHERE salary_rank <= 100
ORDER BY salary_rank;

-- 쿼리 구조만 개선하는 방법: WindowAgg를 제거하고 Top-N 정렬을 허용한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT employee_id, first_name, last_name, hire_date, salary, status
FROM hr.employees
WHERE status = 'ACTIVE'
  AND hire_date >= CURRENT_DATE - INTERVAL '365 days'
ORDER BY salary DESC
FETCH FIRST 100 ROWS ONLY;

-- 인덱스를 추가하지 않은 비교에서 17.707ms → 14.330ms로 개선됐다.
-- 조회가 잦다면 단순화한 쿼리와 복합 인덱스를 함께 사용하는 편이 효과적이다.
