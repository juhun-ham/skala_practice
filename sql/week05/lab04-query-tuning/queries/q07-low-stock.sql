-- Q7. 재고가 임계치보다 낮은 상품

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    p.product_id,
    p.sku,
    p.product_name,
    i.qty_on_hand,
    i.reorder_point,
    i.reorder_point - i.qty_on_hand AS shortage_qty
FROM ecom.inventory i
JOIN ecom.products p ON p.product_id = i.product_id
WHERE i.qty_on_hand < i.reorder_point
ORDER BY shortage_qty DESC, p.product_id;

-- 부분 인덱스 실험. 현재 데이터는 각 테이블이 600건으로 작아
-- 옵티마이저가 인덱스 대신 Seq Scan을 유지했다.
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock
ON ecom.inventory (product_id)
INCLUDE (qty_on_hand, reorder_point)
WHERE qty_on_hand < reorder_point;

ANALYZE ecom.inventory;

EXPLAIN (ANALYZE, BUFFERS)
SELECT
    p.product_id,
    p.sku,
    p.product_name,
    i.qty_on_hand,
    i.reorder_point,
    i.reorder_point - i.qty_on_hand AS shortage_qty
FROM ecom.inventory i
JOIN ecom.products p ON p.product_id = i.product_id
WHERE i.qty_on_hand < i.reorder_point
ORDER BY shortage_qty DESC, p.product_id;
