CREATE OR REPLACE VIEW daily_sales AS
SELECT
  s.branch_id,
  b.name AS branch_name,
  s.created_at::date AS sale_date,
  COUNT(*) AS total_transactions,
  COUNT(DISTINCT s.customer_id) AS unique_customers,
  COALESCE(SUM(s.grand_total), 0) AS total_revenue,
  COALESCE(SUM(s.tax_total), 0) AS total_tax,
  COALESCE(SUM(s.discount_total), 0) AS total_discounts,
  COALESCE(AVG(s.grand_total), 0) AS avg_transaction_value,
  COUNT(*) FILTER (WHERE s.status = 'cancelled') AS cancelled_count,
  COALESCE(SUM(s.grand_total) FILTER (WHERE s.status = 'cancelled'), 0) AS cancelled_amount
FROM sales s
JOIN branches b ON b.id = s.branch_id
WHERE s.deleted_at IS NULL
GROUP BY s.branch_id, b.name, s.created_at::date;
