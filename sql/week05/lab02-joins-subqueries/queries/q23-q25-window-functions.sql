-- Q23. 학과별 GPA 상위 3명
-- ROW_NUMBER는 정확히 3명을 선택하고, RANK/DENSE_RANK는 동점 처리 차이를 보여준다.
WITH ranked_students AS (
    SELECT
        s.student_id,
        s.name,
        s.major,
        s.gpa,
        ROW_NUMBER() OVER (
            PARTITION BY s.major
            ORDER BY s.gpa DESC, s.student_id
        ) AS row_num,
        RANK() OVER (
            PARTITION BY s.major
            ORDER BY s.gpa DESC
        ) AS gpa_rank,
        DENSE_RANK() OVER (
            PARTITION BY s.major
            ORDER BY s.gpa DESC
        ) AS gpa_dense_rank,
        COUNT(*) OVER (PARTITION BY s.major) AS major_student_count
    FROM lab.student s
)
SELECT
    student_id,
    name,
    major,
    gpa,
    row_num,
    gpa_rank,
    gpa_dense_rank,
    major_student_count
FROM ranked_students
WHERE row_num <= 3
ORDER BY major, row_num;

-- Q24. 이전 과목 대비 성적 변화와 학생별 점수 범위
WITH scored_enrollments AS (
    SELECT
        e.student_id,
        e.course,
        e.grade,
        CASE e.grade
            WHEN 'A' THEN 4
            WHEN 'B' THEN 3
            WHEN 'C' THEN 2
            WHEN 'D' THEN 1
        END AS score
    FROM lab.enroll e
),
score_metrics AS (
    SELECT
        se.*,
        LAG(score) OVER (
            PARTITION BY student_id
            ORDER BY course
        ) AS previous_score,
        MAX(score) OVER (PARTITION BY student_id)
            - MIN(score) OVER (PARTITION BY student_id) AS score_range
    FROM scored_enrollments se
)
SELECT
    student_id,
    course,
    grade,
    score,
    previous_score,
    score - previous_score AS score_difference,
    CASE
        WHEN previous_score IS NULL THEN '첫 수강'
        WHEN score > previous_score THEN '상승'
        WHEN score = previous_score THEN '유지'
        ELSE '하락'
    END AS score_change,
    score_range
FROM score_metrics
ORDER BY student_id, course
LIMIT 5;

-- Q25. 주문 누적금액, 최근 3개 주문 이동평균, 고객별 누적금액,
-- 전체 누적금액이 총액의 50%를 처음 초과하는 주문번호
WITH order_metrics AS (
    SELECT
        o.order_id,
        o.customer_id,
        o.amount,
        SUM(o.amount) OVER (
            ORDER BY o.order_id
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS running_total,
        AVG(o.amount) OVER (
            ORDER BY o.order_id
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) AS moving_avg_3,
        SUM(o.amount) OVER (
            PARTITION BY o.customer_id
            ORDER BY o.order_id
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS customer_running_total,
        SUM(o.amount) OVER () AS grand_total
    FROM lab.orders o
)
SELECT
    order_id,
    customer_id,
    amount,
    running_total,
    ROUND(moving_avg_3, 2) AS moving_avg_3,
    customer_running_total,
    ROUND(running_total * 100.0 / NULLIF(grand_total, 0), 2)
        AS cumulative_percent,
    MIN(
        CASE WHEN running_total > grand_total * 0.5 THEN order_id END
    ) OVER () AS first_order_over_50_percent
FROM order_metrics
ORDER BY order_id
LIMIT 20;
