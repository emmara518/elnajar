CREATE OR REPLACE FUNCTION adjust_inventory(
  p_inventory_item_id uuid,
  p_quantity integer,
  p_reason text,
  p_employee_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_current inventory_items%ROWTYPE;
  v_new_quantity integer;
  v_movement_id uuid;
  v_product_name text;
  v_branch_name text;
BEGIN
  -- Get current inventory item
  SELECT * INTO v_current
  FROM inventory_items
  WHERE id = p_inventory_item_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item with id % not found', p_inventory_item_id;
  END IF;

  -- Calculate new quantity
  v_new_quantity := v_current.quantity + p_quantity;

  -- Verify new quantity is not negative
  IF v_new_quantity < 0 THEN
    RAISE EXCEPTION 'Insufficient stock: current quantity is %, adjustment of % would result in %',
      v_current.quantity, p_quantity, v_new_quantity
      USING HINT = 'Adjustment quantity cannot result in negative stock';
  END IF;

  -- Update inventory quantity
  UPDATE inventory_items
  SET
    quantity = v_new_quantity,
    updated_at = NOW()
  WHERE id = p_inventory_item_id;

  -- Insert stock movement
  INSERT INTO stock_movements (
    inventory_item_id, product_id, branch_id, quantity_before, quantity_after,
    type, reference_type, reference_id, notes
  ) VALUES (
    p_inventory_item_id, v_current.product_id, v_current.branch_id,
    v_current.quantity, v_new_quantity,
    'adjustment', 'manual', p_inventory_item_id::text, p_reason
  )
  RETURNING id INTO v_movement_id;

  -- Get names for audit
  SELECT name INTO v_product_name FROM products WHERE id = v_current.product_id AND deleted_at IS NULL;
  SELECT name INTO v_branch_name FROM branches WHERE id = v_current.branch_id AND deleted_at IS NULL;

  -- Call audit_log
  PERFORM audit_log(
    p_actor_id := p_employee_id::text,
    p_actor_type := 'employee',
    p_action := 'inventory_adjustment',
    p_entity_type := 'inventory_item',
    p_entity_id := p_inventory_item_id::text,
    p_changes := jsonb_build_object(
      'product_id', v_current.product_id,
      'product_name', v_product_name,
      'branch_id', v_current.branch_id,
      'branch_name', v_branch_name,
      'quantity_before', v_current.quantity,
      'quantity_after', v_new_quantity,
      'adjustment', p_quantity,
      'reason', p_reason
    ),
    p_branch_id := v_current.branch_id
  );

  -- Low stock warning
  IF v_new_quantity < v_current.reorder_point THEN
    RAISE NOTICE 'LOW STOCK WARNING: Product % (%) stock is % which is below reorder point of %',
      v_product_name, v_current.product_id, v_new_quantity, v_current.reorder_point;
  END IF;

  -- Return summary
  RETURN jsonb_build_object(
    'inventory_item_id', p_inventory_item_id,
    'product_id', v_current.product_id,
    'product_name', v_product_name,
    'branch_id', v_current.branch_id,
    'branch_name', v_branch_name,
    'quantity_before', v_current.quantity,
    'quantity_after', v_new_quantity,
    'adjustment', p_quantity,
    'movement_id', v_movement_id,
    'reason', p_reason
  );
END;
$$;
