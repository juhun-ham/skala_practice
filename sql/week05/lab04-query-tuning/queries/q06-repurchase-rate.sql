-- Q6. 첫 구매 후 30일 이내 재구매율

-- Baseline: 첫 구매 고객과 전체 유효 주문을 조인한 뒤 기간 조건을 적용한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH valid_orders AS (
    SELECT customer_id, order_id, order_ts
    FROM ecom.orders
    WHERE order_status IN ('paid', 'shipped', 'delivered')
),
first_purchase AS (
    SELECT customer_id, MIN(order_ts) AS first_order_ts
    FROM valid_orders
    GROUP BY customer_id
)
SELECT
    COUNT(DISTINCT fp.customer_id) AS first_purchase_customers,
    COUNT(DISTINCT CASE WHEN vo.order_id IS NOT NULL THEN fp.customer_id END)
        AS repurchase_customers,
    ROUND(
        COUNT(DISTINCT CASE WHEN vo.order_id IS NOT NULL THEN fp.customer_id END)
        * 100.0 / NULLIF(COUNT(DISTINCT fp.customer_id), 0),
        2
    ) AS repurchase_rate
FROM first_purchase fp
LEFT JOIN valid_orders vo
  ON vo.customer_id = fp.customer_id
 AND vo.order_ts > fp.first_order_ts
 AND vo.order_ts <= fp.first_order_ts + INTERVAL '30 days';

-- 고객별 날짜 범위 탐색을 위한 부분 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_rfm_customer_ts
ON ecom.orders (customer_id, order_ts DESC)
INCLUDE (order_id)
WHERE order_status IN ('paid', 'shipped', 'delivered');

ANALYZE ecom.orders;

-- Tuned: 재구매 한 건을 찾으면 멈추는 EXISTS를 사용한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH first_purchase AS (
    SELECT customer_id, MIN(order_ts) AS first_order_ts
    FROM ecom.orders
    WHERE order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY customer_id
),
repurchase_counts AS (
    SELECT
        COUNT(*) AS first_purchase_customers,
        COUNT(*) FILTER (
            WHERE EXISTS (
                SELECT 1
                FROM ecom.orders o2
                WHERE o2.customer_id = fp.customer_id
                  AND o2.order_status IN ('paid', 'shipped', 'delivered')
                  AND o2.order_ts > fp.first_order_ts
                  AND o2.order_ts <= fp.first_order_ts + INTERVAL '30 days'
            )
        ) AS repurchase_customers
    FROM first_purchase fp
)
SELECT
    first_purchase_customers,
    repurchase_customers,
    ROUND(repurchase_customers * 100.0 / NULLIF(first_purchase_customers, 0), 2)
        AS repurchase_rate
FROM repurchase_counts;
