-- Q8. 평균 평점 4.5 이상, 리뷰 50개 이상 상품

-- Baseline: 현재 규모에서는 이 쿼리가 더 단순하고 근소하게 빨랐다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    p.product_id,
    p.product_name,
    COUNT(*) AS review_count,
    ROUND(AVG(r.rating), 2) AS avg_rating
FROM ecom.products p
JOIN ecom.reviews r ON r.product_id = p.product_id
GROUP BY p.product_id, p.product_name
HAVING AVG(r.rating) >= 4.5
   AND COUNT(*) >= 50
ORDER BY avg_rating DESC, review_count DESC, p.product_id;

-- Experiment: 리뷰를 먼저 집계하면 조인 입력은 줄지만,
-- 작은 데이터에서는 0.905ms에서 0.936ms로 오히려 소폭 증가했다.
EXPLAIN (ANALYZE, BUFFERS)
WITH review_stats AS (
    SELECT product_id, COUNT(*) AS review_count, AVG(rating) AS avg_rating
    FROM ecom.reviews
    GROUP BY product_id
    HAVING AVG(rating) >= 4.5
       AND COUNT(*) >= 50
)
SELECT
    p.product_id,
    p.product_name,
    rs.review_count,
    ROUND(rs.avg_rating, 2) AS avg_rating
FROM review_stats rs
JOIN ecom.products p ON p.product_id = rs.product_id
ORDER BY rs.avg_rating DESC, rs.review_count DESC, p.product_id;
