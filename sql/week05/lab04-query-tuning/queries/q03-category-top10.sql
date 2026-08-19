-- Q3. 최근 90일 카테고리 매출 Top 10

-- Baseline: 주문상품 20,086건을 상품과 카테고리에 연결한 뒤 집계한다.
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    c.category_id,
    c.category_name,
    ROUND(SUM(oi.line_total), 2) AS total_sales_amount
FROM ecom.orders o
JOIN ecom.order_items oi ON oi.order_id = o.order_id
JOIN ecom.products p ON p.product_id = oi.product_id
JOIN ecom.categories c ON c.category_id = p.category_id
WHERE o.order_status IN ('paid', 'shipped', 'delivered')
  AND o.order_ts >= NOW() - INTERVAL '90 days'
GROUP BY c.category_id, c.category_name
ORDER BY total_sales_amount DESC
LIMIT 10;

-- Tuned: product_id별 선집계로 이후 조인 입력을 최대 600건으로 줄인다.
EXPLAIN (ANALYZE, BUFFERS)
WITH product_sales AS (
    SELECT oi.product_id, SUM(oi.line_total) AS sales_amount
    FROM ecom.orders o
    JOIN ecom.order_items oi ON oi.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
      AND o.order_ts >= NOW() - INTERVAL '90 days'
    GROUP BY oi.product_id
)
SELECT
    c.category_id,
    c.category_name,
    ROUND(SUM(ps.sales_amount), 2) AS total_sales_amount
FROM product_sales ps
JOIN ecom.products p ON p.product_id = ps.product_id
JOIN ecom.categories c ON c.category_id = p.category_id
GROUP BY c.category_id, c.category_name
ORDER BY total_sales_amount DESC
LIMIT 10;
