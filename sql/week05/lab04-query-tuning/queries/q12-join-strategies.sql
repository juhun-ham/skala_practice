-- Q12. 동일한 쿼리로 PostgreSQL의 세 가지 조인 전략 비교
-- 아래 SET은 현재 세션의 플래너 설정을 바꾸므로 각 실험 뒤 반드시 RESET한다.

-- 1) Hash Join: 7.914ms, shared hit=348
SET enable_hashjoin = ON;
SET enable_nestloop = OFF;
SET enable_mergejoin = OFF;

EXPLAIN (ANALYZE, BUFFERS)
SELECT COALESCE(SUM(oi.line_total), 0) AS total_sales_amount
FROM ecom.orders o
JOIN ecom.order_items oi ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
  AND o.order_ts >= NOW() - INTERVAL '1 month';

RESET enable_hashjoin;
RESET enable_nestloop;
RESET enable_mergejoin;

-- 2) Nested Loop: 7.639ms, shared hit=7,589
SET enable_hashjoin = OFF;
SET enable_nestloop = ON;
SET enable_mergejoin = OFF;

EXPLAIN (ANALYZE, BUFFERS)
SELECT COALESCE(SUM(oi.line_total), 0) AS total_sales_amount
FROM ecom.orders o
JOIN ecom.order_items oi ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
  AND o.order_ts >= NOW() - INTERVAL '1 month';

RESET enable_hashjoin;
RESET enable_nestloop;
RESET enable_mergejoin;

-- 3) Merge Join: 10.035ms, shared hit=417
SET enable_hashjoin = OFF;
SET enable_nestloop = OFF;
SET enable_mergejoin = ON;

EXPLAIN (ANALYZE, BUFFERS)
SELECT COALESCE(SUM(oi.line_total), 0) AS total_sales_amount
FROM ecom.orders o
JOIN ecom.order_items oi ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
  AND o.order_ts >= NOW() - INTERVAL '1 month';

RESET enable_hashjoin;
RESET enable_nestloop;
RESET enable_mergejoin;

-- Nested Loop가 근소하게 빨랐지만 편차 수준의 차이였고 버퍼 접근은 가장 많았다.
-- 현재 데이터에서는 PostgreSQL이 기본 선택한 Hash Join이 안정적이었다.
