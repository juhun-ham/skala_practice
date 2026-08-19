-- Q13. 반복되는 일별 매출 집계를 Materialized View로 저장

CREATE MATERIALIZED VIEW IF NOT EXISTS ecom.mv_daily_gmv AS
SELECT
    DATE_TRUNC('day', o.order_ts) AS day,
    SUM(oi.line_total) AS gmv
FROM ecom.orders o
JOIN ecom.order_items oi ON oi.order_id = o.order_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
GROUP BY 1;

-- Materialized View는 원본 데이터 변경 시 자동 갱신되지 않는다.
REFRESH MATERIALIZED VIEW ecom.mv_daily_gmv;

SELECT day, gmv
FROM ecom.mv_daily_gmv
ORDER BY day DESC
LIMIT 20;

-- 동시 갱신이 필요하면 day의 유일성이 보장되는지 확인한 뒤
-- UNIQUE 인덱스를 만들고 REFRESH ... CONCURRENTLY를 사용할 수 있다.
