-- Q7. 고객별 주문 건수와 총액
SELECT
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS order_count,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM lab.customers c
LEFT JOIN lab.orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY c.customer_id
LIMIT 5;

-- Q8. 주문 총액 상위 10명
SELECT
    c.customer_id,
    c.customer_name,
    SUM(o.amount) AS total_amount
FROM lab.customers c
JOIN lab.orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY total_amount DESC, c.customer_id
LIMIT 10;

-- Q9. 직원과 직속 매니저 이름: CEO도 포함하기 위해 LEFT JOIN 사용
SELECT
    employee.emp_id,
    employee.name AS employee_name,
    manager.name AS manager_name
FROM lab.emp employee
LEFT JOIN lab.emp manager ON manager.emp_id = employee.manager_id
ORDER BY employee.emp_id;

-- Q10. 모든 학생의 수강 과목 수
SELECT
    s.student_id,
    s.name,
    COUNT(e.course) AS course_count
FROM lab.student s
LEFT JOIN lab.enroll e ON e.student_id = s.student_id
GROUP BY s.student_id, s.name
ORDER BY s.student_id
LIMIT 5;

-- Q11. DB 과목을 수강하지 않은 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE NOT EXISTS (
    SELECT 1
    FROM lab.enroll e
    WHERE e.student_id = s.student_id
      AND e.course = 'DB'
)
ORDER BY s.student_id
LIMIT 5;

-- Q12. 과목별 담당 매니저 목록
-- 보고서 설명을 바탕으로 고유 과목을 10명의 매니저(emp_id 2~11)에게 순환 배정한다.
CREATE TABLE IF NOT EXISTS lab.course_manager (
    course VARCHAR(50) PRIMARY KEY,
    manager_id INT NOT NULL REFERENCES lab.emp(emp_id)
);

INSERT INTO lab.course_manager (course, manager_id)
SELECT
    course,
    2 + ((ROW_NUMBER() OVER (ORDER BY course) - 1) % 10)::INT AS manager_id
FROM (SELECT DISTINCT course FROM lab.enroll) courses
ON CONFLICT (course) DO UPDATE
SET manager_id = EXCLUDED.manager_id;

SELECT
    cm.course,
    manager.name AS manager_name,
    COUNT(e.student_id) AS student_count
FROM lab.course_manager cm
JOIN lab.emp manager ON manager.emp_id = cm.manager_id
LEFT JOIN lab.enroll e ON e.course = cm.course
GROUP BY cm.course, manager.emp_id, manager.name
ORDER BY student_count DESC, cm.course
LIMIT 5;
