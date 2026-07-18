CREATE OR REPLACE VIEW top_products AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  p.category_id,
  c.name AS category_name,
  COALESCE(SUM(si.quantity), 0) AS total_quantity_sold,
  COALESCE(SUM(si.total_price), 0) AS total_revenue,
  COUNT(DISTINCT si.sale_id) AS transaction_count,
  CASE
    WHEN SUM(si.quantity) > 0
    THEN ROUND(SUM(si.total_price) / SUM(si.quantity), 2)
    ELSE 0
  END AS avg_price,
  RANK() OVER (ORDER BY COALESCE(SUM(si.quantity), 0) DESC) AS rank_by_quantity,
  RANK() OVER (ORDER BY COALESCE(SUM(si.total_price), 0) DESC) AS rank_by_revenue
FROM products p
LEFT JOIN sale_items si ON si.product_id = p.id
LEFT JOIN sales s ON s.id = si.sale_id AND s.status = 'confirmed' AND s.deleted_at IS NULL
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.sku, p.category_id, c.name;
