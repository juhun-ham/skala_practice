-- Q5. 고객별 RFM(최근성, 빈도, 금액)

-- Baseline: 주문상품 단위 26,290건을 고객과 조인하고 DISTINCT 집계한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    c.customer_id,
    c.full_name,
    MAX(o.order_ts) AS last_order_ts,
    CURRENT_DATE - MAX(o.order_ts)::date AS recency_days,
    COUNT(DISTINCT o.order_id) AS frequency,
    ROUND(SUM(oi.line_total), 2) AS monetary
FROM ecom.customers c
JOIN ecom.orders o ON o.customer_id = c.customer_id
JOIN ecom.order_items oi ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
GROUP BY c.customer_id, c.full_name
ORDER BY c.customer_id;

-- 데이터 전제 확인: payment_rows와 payment_orders가 같아야 주문당 결제 1건이다.
SELECT COUNT(*) AS payment_rows, COUNT(DISTINCT order_id) AS payment_orders
FROM ecom.payments;

-- Tuned: 주문 단위 결제금액을 사용하고 고객별로 먼저 집계한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH customer_rfm AS (
    SELECT
        o.customer_id,
        MAX(o.order_ts) AS last_order_ts,
        COUNT(*) AS frequency,
        SUM(p.amount) AS monetary
    FROM ecom.orders o
    JOIN ecom.payments p ON p.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY o.customer_id
)
SELECT
    c.customer_id,
    c.full_name,
    r.last_order_ts,
    CURRENT_DATE - r.last_order_ts::date AS recency_days,
    r.frequency,
    ROUND(r.monetary, 2) AS monetary
FROM customer_rfm r
JOIN ecom.customers c ON c.customer_id = r.customer_id
ORDER BY c.customer_id;
