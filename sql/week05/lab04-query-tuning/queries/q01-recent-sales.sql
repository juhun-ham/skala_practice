-- Q1. 최근 한 달간 실제 판매된 총금액
-- 부분 인덱스 적용 후 orders가 Index Only Scan으로 바뀌었고,
-- 평균 실행시간은 9.763ms에서 5.835ms로 감소했다.

CREATE INDEX IF NOT EXISTS idx_orders_sales_ts_id
ON ecom.orders (order_ts, order_id)
WHERE order_status IN ('paid', 'shipped', 'delivered');

ANALYZE ecom.orders;

EXPLAIN (ANALYZE, BUFFERS)
SELECT COALESCE(SUM(oi.line_total), 0) AS total_sales_amount
FROM ecom.orders o
JOIN ecom.order_items oi
  ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
  AND o.order_ts >= NOW() - INTERVAL '1 month';
