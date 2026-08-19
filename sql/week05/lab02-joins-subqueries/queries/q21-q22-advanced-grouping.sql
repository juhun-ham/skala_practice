-- Q21. GPA 구간별 인원, 학과별 소계, 전체 총계
WITH student_tiers AS (
    SELECT
        major,
        CASE
            WHEN gpa < 3.0 THEN '3.0 미만'
            WHEN gpa <= 3.5 THEN '3.0~3.5'
            ELSE '3.5 초과'
        END AS gpa_tier
    FROM lab.student
)
SELECT
    CASE
        WHEN GROUPING(major) = 1 THEN '전체'
        ELSE major
    END AS major,
    CASE
        WHEN GROUPING(major) = 1 THEN '전체'
        WHEN GROUPING(gpa_tier) = 1 THEN '소계'
        ELSE gpa_tier
    END AS gpa_tier,
    COUNT(*) AS student_count
FROM student_tiers
GROUP BY ROLLUP (major, gpa_tier)
ORDER BY GROUPING(major), major, GROUPING(gpa_tier), gpa_tier;

-- Q22-1. 재귀 CTE로 직원 계층 조회
-- path_ids를 함께 유지하여 잘못된 순환 참조로 무한 반복되는 것을 막는다.
WITH RECURSIVE employee_tree AS (
    SELECT
        e.emp_id,
        e.name,
        e.manager_id,
        0 AS depth,
        e.name::TEXT AS hierarchy_path,
        ARRAY[e.emp_id] AS path_ids
    FROM lab.emp e
    WHERE e.manager_id IS NULL

    UNION ALL

    SELECT
        child.emp_id,
        child.name,
        child.manager_id,
        parent.depth + 1,
        parent.hierarchy_path || ' > ' || child.name,
        parent.path_ids || child.emp_id
    FROM lab.emp child
    JOIN employee_tree parent ON parent.emp_id = child.manager_id
    WHERE NOT child.emp_id = ANY (parent.path_ids)
)
SELECT emp_id, name, manager_id, depth, hierarchy_path
FROM employee_tree
ORDER BY hierarchy_path;

-- Q22-2. 매니저별 직속 부하 수
SELECT
    manager.emp_id AS manager_id,
    manager.name AS manager_name,
    COUNT(employee.emp_id) AS direct_report_count
FROM lab.emp manager
LEFT JOIN lab.emp employee ON employee.manager_id = manager.emp_id
GROUP BY manager.emp_id, manager.name
HAVING COUNT(employee.emp_id) > 0
ORDER BY direct_report_count DESC, manager.emp_id;
