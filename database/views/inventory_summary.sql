CREATE OR REPLACE VIEW inventory_summary AS
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
  (i.quantity * p.retail_price) AS stock_value,
  CASE
    WHEN (i.quantity - i.reserved_quantity) <= i.reorder_point THEN 'low_stock'
    WHEN i.quantity = 0 THEN 'out_of_stock'
    ELSE 'in_stock'
  END AS stock_status
FROM inventory_items i
JOIN products p ON p.id = i.product_id
JOIN branches b ON b.id = i.branch_id
WHERE i.deleted_at IS NULL AND p.deleted_at IS NULL;
