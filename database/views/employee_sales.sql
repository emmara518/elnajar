CREATE OR REPLACE VIEW employee_sales AS
SELECT
  e.id AS employee_id,
  e.name AS employee_name,
  e.employee_code,
  b.id AS branch_id,
  b.name AS branch_name,
  date_trunc('month', s.created_at)::date AS period,
  COUNT(DISTINCT s.id) AS total_sales,
  COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'confirmed') AS confirmed_sales,
  COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'cancelled') AS cancelled_sales,
  COALESCE(SUM(s.grand_total) FILTER (WHERE s.status = 'confirmed'), 0) AS total_revenue,
  COALESCE(AVG(s.grand_total) FILTER (WHERE s.status = 'confirmed'), 0) AS avg_transaction_value,
  COUNT(DISTINCT sh.id) AS shift_count,
  COALESCE(SUM(s.grand_total) FILTER (WHERE s.status = 'confirmed'), 0)
    / NULLIF(COUNT(DISTINCT sh.id), 0) AS revenue_per_shift,
  MIN(s.created_at) FILTER (WHERE s.status = 'confirmed') AS first_sale,
  MAX(s.created_at) FILTER (WHERE s.status = 'confirmed') AS last_sale
FROM employees e
JOIN shifts sh ON sh.employee_id = e.id AND sh.deleted_at IS NULL
JOIN sales s ON s.shift_id = sh.id AND s.deleted_at IS NULL
JOIN branches b ON b.id = COALESCE(sh.branch_id, s.branch_id)
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.name, e.employee_code, b.id, b.name, date_trunc('month', s.created_at);
