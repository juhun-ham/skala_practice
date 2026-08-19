-- Q4. 상품별 누적매출 순위 Top 20

-- Baseline: 상품명을 먼저 연결한 뒤 상품별로 집계한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH product_sales AS (
    SELECT
        p.product_id,
        p.product_name,
        SUM(oi.line_total) AS total_sales_amount
    FROM ecom.orders o
    JOIN ecom.order_items oi ON oi.order_id = o.order_id
    JOIN ecom.products p ON p.product_id = oi.product_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY p.product_id, p.product_name
),
ranked_products AS (
    SELECT *, RANK() OVER (ORDER BY total_sales_amount DESC) AS sales_rank
    FROM product_sales
)
SELECT sales_rank, product_id, product_name, ROUND(total_sales_amount, 2)
FROM ranked_products
WHERE sales_rank <= 20
ORDER BY sales_rank, product_id;

-- Tuned: 상품별 선집계 후 600건만 products와 조인한다.
EXPLAIN (ANALYZE, BUFFERS)
WITH product_sales AS (
    SELECT oi.product_id, SUM(oi.line_total) AS total_sales_amount
    FROM ecom.orders o
    JOIN ecom.order_items oi ON oi.order_id = o.order_id
    WHERE o.order_status IN ('paid', 'shipped', 'delivered')
    GROUP BY oi.product_id
),
ranked_products AS (
    SELECT
        ps.product_id,
        p.product_name,
        ps.total_sales_amount,
        RANK() OVER (ORDER BY ps.total_sales_amount DESC) AS sales_rank
    FROM product_sales ps
    JOIN ecom.products p ON p.product_id = ps.product_id
)
SELECT sales_rank, product_id, product_name, ROUND(total_sales_amount, 2)
FROM ranked_products
WHERE sales_rank <= 20
ORDER BY sales_rank, product_id;
