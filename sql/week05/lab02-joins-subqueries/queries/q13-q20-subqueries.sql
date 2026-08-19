-- Q13. 학생별 미수강 과목 추천 후보
WITH courses AS (
    SELECT DISTINCT course
    FROM lab.enroll
)
SELECT s.student_id, s.name, c.course AS recommended_course
FROM lab.student s
CROSS JOIN courses c
WHERE NOT EXISTS (
    SELECT 1
    FROM lab.enroll e
    WHERE e.student_id = s.student_id
      AND e.course = c.course
)
ORDER BY s.student_id, c.course
LIMIT 100;

-- Q14. 스칼라 서브쿼리로 학생과 소속 학과명 조회
SELECT
    s.student_id,
    s.name,
    (
        SELECT s2.major
        FROM lab.student s2
        WHERE s2.student_id = s.student_id
    ) AS department_name
FROM lab.student s
ORDER BY s.student_id
LIMIT 5;

-- Q15. 전체 평균 GPA보다 높은 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE s.gpa > (SELECT AVG(gpa) FROM lab.student)
ORDER BY s.gpa DESC, s.student_id
LIMIT 5;

-- Q16. 소속 학과 평균 GPA보다 높은 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE s.gpa > (
    SELECT AVG(peer.gpa)
    FROM lab.student peer
    WHERE peer.major = s.major
)
ORDER BY s.gpa DESC, s.student_id
LIMIT 5;

-- Q17. 수강 기록이 있는 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE EXISTS (
    SELECT 1
    FROM lab.enroll e
    WHERE e.student_id = s.student_id
)
ORDER BY s.student_id
LIMIT 5;

-- Q18. 수강 기록이 없는 학생
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE NOT EXISTS (
    SELECT 1
    FROM lab.enroll e
    WHERE e.student_id = s.student_id
)
ORDER BY s.student_id
LIMIT 5;

-- Q19. HR 학과 학생 중 한 명 이상보다 GPA가 높은 학생
-- > ANY는 HR 학생 GPA의 최솟값보다 큰지 확인하는 것과 같은 의미다.
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE s.gpa > ANY (
    SELECT hr_student.gpa
    FROM lab.student hr_student
    WHERE hr_student.major = 'HR'
)
ORDER BY s.gpa DESC, s.student_id
LIMIT 5;

-- Q20. CS 학과 학생 또는 DB 과목 수강 학생
-- UNION은 두 조건에 모두 해당하는 학생의 중복을 제거한다.
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
WHERE s.major = 'CS'
UNION
SELECT s.student_id, s.name, s.major, s.gpa
FROM lab.student s
JOIN lab.enroll e ON e.student_id = s.student_id
WHERE e.course = 'DB'
ORDER BY student_id
LIMIT 5;
