CREATE OR REPLACE VIEW stock_alerts AS
SELECT
  i.branch_id,
  b.name AS branch_name,
  i.product_id,
  p.name AS product_name,
  p.sku,
  i.quantity,
  i.reserved_quantity,
  (i.quantity - i.reserved_quantity) AS available_quantity,
  i.reorder_point,
  i.min_stock_level,
  p.retail_price,
  p.cost_price,
  (i.quantity * p.cost_price) AS stock_cost_value,
  CASE
    WHEN i.quantity = 0 THEN 'out_of_stock'
    WHEN (i.quantity - i.reserved_quantity) <= 0 AND i.quantity > 0 THEN 'all_reserved'
    WHEN (i.quantity - i.reserved_quantity) <= i.reorder_point
      AND (i.quantity - i.reserved_quantity) > 0 THEN 'low_stock'
    WHEN i.quantity > (i.reorder_point * 3) AND i.reorder_point > 0 THEN 'overstock'
    ELSE 'ok'
  END AS alert_type,
  CASE
    WHEN i.quantity = 0 THEN 'CRITICAL: Product is out of stock'
    WHEN (i.quantity - i.reserved_quantity) <= 0 AND i.quantity > 0
      THEN 'WARNING: All available stock is reserved'
    WHEN (i.quantity - i.reserved_quantity) <= i.reorder_point
      AND (i.quantity - i.reserved_quantity) > 0
      THEN 'LOW STOCK: Available quantity (' || (i.quantity - i.reserved_quantity)
        || ') is at or below reorder point (' || i.reorder_point || ')'
    WHEN i.quantity > (i.reorder_point * 3) AND i.reorder_point > 0
      THEN 'OVERSTOCK: Current quantity (' || i.quantity
        || ') exceeds 3x reorder point (' || (i.reorder_point * 3) || ')'
    ELSE 'Stock level is adequate'
  END AS alert_message,
  CASE
    WHEN i.quantity = 0 THEN 1
    WHEN (i.quantity - i.reserved_quantity) <= i.reorder_point THEN 2
    WHEN i.quantity > (i.reorder_point * 3) AND i.reorder_point > 0 THEN 3
    ELSE 4
  END AS priority
FROM inventory_items i
JOIN products p ON p.id = i.product_id AND p.deleted_at IS NULL
JOIN branches b ON b.id = i.branch_id AND b.deleted_at IS NULL
WHERE i.deleted_at IS NULL
  AND (
    i.quantity = 0
    OR (i.quantity - i.reserved_quantity) <= i.reorder_point
    OR (i.quantity > (i.reorder_point * 3) AND i.reorder_point > 0)
  )
ORDER BY priority, branch_name, product_name;
