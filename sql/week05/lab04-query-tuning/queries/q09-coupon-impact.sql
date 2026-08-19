-- Q9. 쿠폰 사용 여부에 따른 평균 주문금액 비교

-- Baseline: 주문상품을 주문별로 다시 집계한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH order_totals AS (
    SELECT
        o.order_id,
        CASE WHEN o.coupon_code IS NOT NULL THEN 'coupon_used' ELSE 'no_coupon' END
            AS coupon_usage,
        SUM(oi.line_total) AS order_amount
    FROM ecom.orders o
    JOIN ecom.order_items oi ON oi.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY o.order_id, o.coupon_code
)
SELECT coupon_usage, COUNT(*) AS order_count, ROUND(AVG(order_amount), 2)
    AS avg_order_amount
FROM order_totals
GROUP BY coupon_usage
ORDER BY coupon_usage;

-- Tuned: 이미 주문 단위로 저장된 결제금액을 사용한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    CASE WHEN o.coupon_code IS NOT NULL THEN 'coupon_used' ELSE 'no_coupon' END
        AS coupon_usage,
    COUNT(*) AS order_count,
    ROUND(AVG(p.amount), 2) AS avg_order_amount
FROM ecom.orders o
JOIN ecom.payments p ON p.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
GROUP BY CASE WHEN o.coupon_code IS NOT NULL THEN 'coupon_used' ELSE 'no_coupon' END
ORDER BY coupon_usage;
