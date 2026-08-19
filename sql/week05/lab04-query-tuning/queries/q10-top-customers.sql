-- Q10. 누적매출 상위 1% 고객의 최근 60일 매출

-- Baseline: 전체 누적매출과 최근 60일 매출을 별도로 계산한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH customer_total_sales AS (
    SELECT
        c.customer_id,
        c.full_name,
        COALESCE(SUM(oi.line_total), 0) AS total_sales
    FROM ecom.customers c
    LEFT JOIN ecom.orders o
      ON o.customer_id = c.customer_id
     AND o.order_status IN ('paid', 'shipped', 'delivered')
    LEFT JOIN ecom.order_items oi ON oi.order_id = o.order_id
    GROUP BY c.customer_id, c.full_name
),
ranked_customers AS (
    SELECT
        customer_id,
        full_name,
        total_sales,
        ROW_NUMBER() OVER (ORDER BY total_sales DESC, customer_id) AS sales_rank,
        COUNT(*) OVER () AS total_customers
    FROM customer_total_sales
),
top_customers AS (
    SELECT customer_id, full_name, total_sales, sales_rank
    FROM ranked_customers
    WHERE sales_rank <= CEIL(total_customers * 0.01)
),
recent_sales AS (
    SELECT o.customer_id, SUM(oi.line_total) AS recent_60_sales
    FROM ecom.orders o
    JOIN ecom.order_items oi ON oi.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
      AND o.order_ts >= NOW() - INTERVAL '60 days'
    GROUP BY o.customer_id
)
SELECT
    tc.sales_rank,
    tc.customer_id,
    tc.full_name,
    ROUND(tc.total_sales, 2) AS total_sales,
    ROUND(COALESCE(rs.recent_60_sales, 0), 2) AS recent_60_sales
FROM top_customers tc
LEFT JOIN recent_sales rs ON rs.customer_id = tc.customer_id
ORDER BY recent_60_sales DESC, tc.customer_id;

-- Tuned: 주문 단위 결제금액을 한 번 읽고 조건부 집계로 두 기간을 계산한다.
-- Baseline은 order_items를 전체 누적매출과 최근 매출 계산에서 각각 읽어
-- 평균 36.351ms, 버퍼 895개가 필요했다.
EXPLAIN (ANALYZE, BUFFERS)
WITH sales_by_customer AS (
    SELECT
        o.customer_id,
        SUM(p.amount) AS total_sales,
        SUM(p.amount) FILTER (
            WHERE o.order_ts >= NOW() - INTERVAL '60 days'
        ) AS recent_60_sales
    FROM ecom.orders o
    JOIN ecom.payments p ON p.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY o.customer_id
),
customer_sales AS (
    SELECT
        c.customer_id,
        c.full_name,
        COALESCE(s.total_sales, 0) AS total_sales,
        COALESCE(s.recent_60_sales, 0) AS recent_60_sales
    FROM ecom.customers c
    LEFT JOIN sales_by_customer s ON s.customer_id = c.customer_id
),
ranked_customers AS (
    SELECT
        customer_id,
        full_name,
        total_sales,
        recent_60_sales,
        ROW_NUMBER() OVER (ORDER BY total_sales DESC, customer_id) AS sales_rank,
        COUNT(*) OVER () AS total_customers
    FROM customer_sales
)
SELECT
    sales_rank,
    customer_id,
    full_name,
    ROUND(total_sales, 2) AS total_sales,
    ROUND(recent_60_sales, 2) AS recent_60_sales
FROM ranked_customers
WHERE sales_rank <= CEIL(total_customers * 0.01)
ORDER BY recent_60_sales DESC, customer_id;
