CREATE OR REPLACE FUNCTION cancel_sale(
  p_sale_id uuid,
  p_reason text,
  p_employee_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_sale sales%ROWTYPE;
  v_item sale_items%ROWTYPE;
  v_employee_name text;
BEGIN
  -- Get sale
  SELECT * INTO v_sale
  FROM sales
  WHERE id = p_sale_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sale with id % not found', p_sale_id;
  END IF;

  -- Verify status allows cancellation
  IF v_sale.status IN ('cancelled', 'refunded') THEN
    RAISE EXCEPTION 'Sale % has already been %', p_sale_id, v_sale.status;
  END IF;

  -- Restore inventory for each sale item
  FOR v_item IN
    SELECT si.*, i.id AS inventory_id
    FROM sale_items si
    JOIN inventory_items i ON i.product_id = si.product_id AND i.branch_id = v_sale.branch_id AND i.deleted_at IS NULL
    WHERE si.sale_id = p_sale_id
  LOOP
    UPDATE inventory_items
    SET
      quantity = quantity + v_item.quantity,
      reserved_quantity = GREATEST(reserved_quantity - v_item.quantity, 0),
      updated_at = NOW()
    WHERE id = v_item.inventory_id;
  END LOOP;

  -- Get employee name for audit
  SELECT name INTO v_employee_name FROM employees WHERE id = p_employee_id AND deleted_at IS NULL;

  -- Update sale status
  UPDATE sales
  SET
    status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = p_reason,
    updated_at = NOW()
  WHERE id = p_sale_id;

  -- Call audit_log
  PERFORM audit_log(
    p_actor_id := p_employee_id::text,
    p_actor_type := 'employee',
    p_action := 'sale_cancelled',
    p_entity_type := 'sale',
    p_entity_id := p_sale_id::text,
    p_changes := jsonb_build_object(
      'order_number', v_sale.order_number,
      'previous_status', v_sale.status,
      'new_status', 'cancelled',
      'grand_total', v_sale.grand_total,
      'reason', p_reason
    ),
    p_branch_id := v_sale.branch_id
  );

  -- Return summary
  RETURN jsonb_build_object(
    'sale_id', p_sale_id,
    'order_number', v_sale.order_number,
    'previous_status', v_sale.status,
    'status', 'cancelled',
    'cancelled_at', NOW(),
    'reason', p_reason,
    'branch_id', v_sale.branch_id
  );
END;
$$;
