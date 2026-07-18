CREATE OR REPLACE VIEW cash_flow AS
SELECT
  branch_id,
  branch_name,
  flow_date,
  flow_type,
  category,
  total_amount,
  transaction_count,
  description
FROM (
  -- INCOMING: Sales payments
  SELECT
    b.id AS branch_id,
    b.name AS branch_name,
    p.created_at::date AS flow_date,
    'incoming' AS flow_type,
    p.method AS category,
    SUM(p.amount) AS total_amount,
    COUNT(*) AS transaction_count,
    'Sales payments - ' || p.method AS description
  FROM payments p
  JOIN sales s ON s.id = p.sale_id AND s.deleted_at IS NULL
  JOIN branches b ON b.id = s.branch_id AND b.deleted_at IS NULL
  WHERE s.status = 'confirmed'
  GROUP BY b.id, b.name, p.created_at::date, p.method

  UNION ALL

  -- OUTGOING: Expenses
  SELECT
    b.id AS branch_id,
    b.name AS branch_name,
    e.expense_date::date AS flow_date,
    'outgoing' AS flow_type,
    e.category AS category,
    SUM(e.amount) AS total_amount,
    COUNT(*) AS transaction_count,
    'Expenses - ' || COALESCE(e.category, 'uncategorized') AS description
  FROM expenses e
  JOIN branches b ON b.id = e.branch_id AND b.deleted_at IS NULL
  WHERE e.deleted_at IS NULL
  GROUP BY b.id, b.name, e.expense_date::date, e.category

  UNION ALL

  -- OUTGOING: Purchase payments
  SELECT
    b.id AS branch_id,
    b.name AS branch_name,
    pr.created_at::date AS flow_date,
    'outgoing' AS flow_type,
    'purchases' AS category,
    SUM(pr.total_amount) AS total_amount,
    COUNT(*) AS transaction_count,
    'Purchase payments to suppliers' AS description
  FROM purchases pr
  JOIN branches b ON b.id = pr.branch_id AND b.deleted_at IS NULL
  WHERE pr.deleted_at IS NULL AND pr.status = 'received'
  GROUP BY b.id, b.name, pr.created_at::date
) cash_flows
ORDER BY flow_date DESC, branch_name, flow_type;
