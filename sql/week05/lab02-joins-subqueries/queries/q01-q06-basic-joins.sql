-- Q1. INNER JOIN: 학생 정보와 수강 기록이 모두 존재하는 행
SELECT s.student_id, s.name, e.course, e.grade
FROM lab.student s
JOIN lab.enroll e ON e.student_id = s.student_id
ORDER BY s.student_id, e.course
LIMIT 5;

-- Q2. LEFT JOIN: 수강하지 않은 학생도 포함
SELECT s.student_id, s.name, e.course, e.grade
FROM lab.student s
LEFT JOIN lab.enroll e ON e.student_id = s.student_id
ORDER BY s.student_id, e.course NULLS LAST
LIMIT 5;

-- Q3. RIGHT JOIN: 학생 정보가 없는 수강 기록도 포함
SELECT e.student_id, s.name, e.course, e.grade
FROM lab.student s
RIGHT JOIN lab.enroll e ON e.student_id = s.student_id
ORDER BY e.student_id, e.course
LIMIT 5;

-- Q4. FULL OUTER JOIN: 양쪽의 일치하지 않는 행까지 모두 포함
SELECT
    COALESCE(s.student_id, e.student_id) AS student_id,
    s.name,
    e.course,
    e.grade
FROM lab.student s
FULL OUTER JOIN lab.enroll e ON e.student_id = s.student_id
ORDER BY student_id, e.course NULLS LAST
LIMIT 5;

-- Q5. 한 번도 수강하지 않은 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
LEFT JOIN lab.enroll e ON e.student_id = s.student_id
WHERE e.student_id IS NULL
ORDER BY s.student_id
LIMIT 5;

-- Q6. 한 과목 이상 수강한 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE EXISTS (
    SELECT 1
    FROM lab.enroll e
    WHERE e.student_id = s.student_id
)
ORDER BY s.student_id
LIMIT 5;
