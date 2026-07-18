CREATE OR REPLACE FUNCTION get_product_stock(
  p_product_id uuid
)
RETURNS TABLE (
  branch_name text,
  quantity integer,
  reserved_quantity integer,
  available_quantity integer,
  reorder_point integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.name::text AS branch_name,
    i.quantity,
    i.reserved_quantity,
    (i.quantity - i.reserved_quantity) AS available_quantity,
    i.reorder_point
  FROM inventory_items i
  JOIN branches b ON b.id = i.branch_id AND b.deleted_at IS NULL
  WHERE i.product_id = p_product_id
    AND i.deleted_at IS NULL
  ORDER BY b.name;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with id % not found in any branch inventory', p_product_id
      USING HINT = 'Verify the product id and that it has been assigned to at least one branch';
  END IF;
END;
$$;
