-- Q2. 월별 주문 수, 총매출, 평균 주문금액

-- Baseline: 주문상품 조인으로 행이 늘어나 COUNT(DISTINCT)가 필요하다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    DATE_TRUNC('month', o.order_ts)::date AS sales_month,
    COUNT(DISTINCT o.order_id) AS order_count,
    ROUND(SUM(oi.line_total), 2) AS total_sales_amount,
    ROUND(SUM(oi.line_total) / NULLIF(COUNT(DISTINCT o.order_id), 0), 2)
        AS avg_order_amount
FROM ecom.orders o
JOIN ecom.order_items oi
  ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
GROUP BY DATE_TRUNC('month', o.order_ts)::date
ORDER BY sales_month;

-- Tuned: order_items를 주문별로 먼저 합쳐 주문당 한 행으로 만든다.
-- 실제 실습 쿼리는 payments가 아니라 이 선집계 방식을 사용했다.
EXPLAIN (ANALYZE, BUFFERS)
WITH order_totals AS (
    SELECT order_id, SUM(line_total) AS order_total
    FROM ecom.order_items
    GROUP BY order_id
)
SELECT
    DATE_TRUNC('month', o.order_ts)::date AS sales_month,
    COUNT(*) AS order_count,
    ROUND(SUM(ot.order_total), 2) AS total_sales_amount,
    ROUND(AVG(ot.order_total), 2) AS avg_order_amount
FROM ecom.orders o
JOIN order_totals ot
  ON ot.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
GROUP BY DATE_TRUNC('month', o.order_ts)::date
ORDER BY sales_month;
