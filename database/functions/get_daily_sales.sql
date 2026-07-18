CREATE OR REPLACE FUNCTION get_daily_sales(
  p_branch_id uuid,
  p_sale_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_sales bigint,
  total_revenue numeric,
  total_tax numeric,
  total_discounts numeric,
  payment_method_breakdown jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint AS total_sales,
    COALESCE(SUM(s.grand_total), 0) AS total_revenue,
    COALESCE(SUM(s.tax_total), 0) AS total_tax,
    COALESCE(SUM(s.discount_total), 0) AS total_discounts,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'method', p.method,
          'total_amount', p.total_amount,
          'transaction_count', p.transaction_count
        )
      ) FILTER (WHERE p.method IS NOT NULL),
      '[]'::jsonb
    ) AS payment_method_breakdown
  FROM sales s
  LEFT JOIN (
    SELECT
      pay.sale_id,
      pay.method,
      SUM(pay.amount) AS total_amount,
      COUNT(*) AS transaction_count
    FROM payments pay
    GROUP BY pay.sale_id, pay.method
  ) p ON p.sale_id = s.id
  WHERE s.branch_id = p_branch_id
    AND s.created_at::date = p_sale_date
    AND s.deleted_at IS NULL
    AND s.status = 'confirmed';

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT
      0::bigint AS total_sales,
      0::numeric AS total_revenue,
      0::numeric AS total_tax,
      0::numeric AS total_discounts,
      '[]'::jsonb AS payment_method_breakdown;
  END IF;
END;
$$;
