CREATE OR REPLACE FUNCTION record_sale(
  p_branch_id uuid,
  p_shift_id uuid,
  p_employee_id uuid,
  p_customer_id uuid DEFAULT NULL,
  p_items jsonb DEFAULT NULL,
  p_payments jsonb DEFAULT NULL,
  p_notes text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_shift shifts%ROWTYPE;
  v_order_number text;
  v_sequence_prefix text;
  v_sequence_number integer;
  v_item jsonb;
  v_product products%ROWTYPE;
  v_inventory inventory_items%ROWTYPE;
  v_subtotal numeric := 0;
  v_discount_total numeric := 0;
  v_tax_total numeric := 0;
  v_grand_total numeric := 0;
  v_sale_id uuid;
  v_item_count integer := 0;
  v_payment_count integer := 0;
  v_valid_methods text[] := ARRAY['cash', 'card', 'mobile_payment', 'credit', 'voucher', 'other'];
BEGIN
  -- Verify shift exists and is open
  SELECT * INTO v_shift
  FROM shifts
  WHERE id = p_shift_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Shift with id % not found', p_shift_id;
  END IF;

  IF v_shift.status != 'open' THEN
    RAISE EXCEPTION 'Shift % is not open (current status: %)', p_shift_id, v_shift.status
      USING HINT = 'Sales can only be recorded against open shifts';
  END IF;

  -- Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Sale must contain at least one item'
      USING HINT = 'Provide a non-empty items array';
  END IF;

  -- Validate payments array
  IF p_payments IS NULL OR jsonb_array_length(p_payments) = 0 THEN
    RAISE EXCEPTION 'Sale must contain at least one payment'
      USING HINT = 'Provide a non-empty payments array';
  END IF;

  -- Generate order number from settings or fallback sequence
  SELECT value INTO v_sequence_prefix
  FROM settings
  WHERE key = 'sale_order_prefix' AND (company_id IS NULL OR company_id IN (
    SELECT company_id FROM branches WHERE id = p_branch_id
  ))
  ORDER BY company_id NULLS LAST
  LIMIT 1;

  IF v_sequence_prefix IS NULL THEN
    v_sequence_prefix := 'INV-';
  END IF;

  v_sequence_number := nextval('sale_order_seq');
  v_order_number := v_sequence_prefix || LPAD(v_sequence_number::text, 8, '0');

  -- Process each item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_count := v_item_count + 1;

    -- Verify product exists
    SELECT * INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid AND deleted_at IS NULL;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with id % not found', (v_item->>'product_id');
    END IF;

    -- Check inventory availability
    SELECT * INTO v_inventory
    FROM inventory_items
    WHERE product_id = v_product.id
      AND branch_id = p_branch_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % is not stocked at branch %', v_product.name, p_branch_id;
    END IF;

    IF (v_inventory.quantity - v_inventory.reserved_quantity) < (v_item->>'quantity')::integer THEN
      RAISE EXCEPTION 'Insufficient stock for product %: requested %, available %',
        v_product.name, (v_item->>'quantity')::integer,
        (v_inventory.quantity - v_inventory.reserved_quantity);
    END IF;

    -- Calculate totals for this line
    v_subtotal := v_subtotal + ((v_item->>'unit_price')::numeric * (v_item->>'quantity')::integer);
    v_discount_total := v_discount_total + COALESCE((v_item->>'discount_amount')::numeric, 0);
    v_tax_total := v_tax_total + COALESCE((v_item->>'tax_amount')::numeric, 0);
  END LOOP;

  -- Validate payment methods
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    IF NOT (v_item->>'method')::text = ANY(v_valid_methods) THEN
      RAISE EXCEPTION 'Invalid payment method: %. Valid methods are: %', (v_item->>'method'), array_to_string(v_valid_methods, ', ');
    END IF;
    v_payment_count := v_payment_count + 1;
  END LOOP;

  -- Calculate grand total
  v_grand_total := v_subtotal - v_discount_total + v_tax_total;

  -- Reserve inventory for each item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE inventory_items
    SET
      quantity = quantity - (v_item->>'quantity')::integer,
      reserved_quantity = reserved_quantity + (v_item->>'quantity')::integer,
      updated_at = NOW()
    WHERE product_id = (v_item->>'product_id')::uuid
      AND branch_id = p_branch_id
      AND deleted_at IS NULL;
  END LOOP;

  -- Insert sale
  INSERT INTO sales (
    branch_id, shift_id, employee_id, customer_id,
    order_number, subtotal, discount_total, tax_total, grand_total,
    status, notes
  ) VALUES (
    p_branch_id, p_shift_id, p_employee_id, p_customer_id,
    v_order_number, v_subtotal, v_discount_total, v_tax_total, v_grand_total,
    'pending', p_notes
  )
  RETURNING id INTO v_sale_id;

  -- Insert sale items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO sale_items (
      sale_id, product_id, product_name, quantity, unit_price,
      discount_amount, tax_amount, total_price
    ) VALUES (
      v_sale_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'product_name')::text,
      (v_item->>'quantity')::integer,
      (v_item->>'unit_price')::numeric,
      COALESCE((v_item->>'discount_amount')::numeric, 0),
      COALESCE((v_item->>'tax_amount')::numeric, 0),
      ((v_item->>'unit_price')::numeric * (v_item->>'quantity')::integer)
        - COALESCE((v_item->>'discount_amount')::numeric, 0)
        + COALESCE((v_item->>'tax_amount')::numeric, 0)
    );
  END LOOP;

  -- Insert payments
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_payments)
  LOOP
    INSERT INTO payments (
      sale_id, method, amount, reference_number, notes
    ) VALUES (
      v_sale_id,
      (v_item->>'method')::text,
      (v_item->>'amount')::numeric,
      (v_item->>'reference_number')::text,
      (v_item->>'notes')::text
    );
  END LOOP;

  -- Call audit_log
  PERFORM audit_log(
    p_actor_id := p_employee_id::text,
    p_actor_type := 'employee',
    p_action := 'sale_created',
    p_entity_type := 'sale',
    p_entity_id := v_sale_id::text,
    p_changes := jsonb_build_object(
      'order_number', v_order_number,
      'branch_id', p_branch_id,
      'shift_id', p_shift_id,
      'customer_id', p_customer_id,
      'item_count', v_item_count,
      'payment_count', v_payment_count,
      'subtotal', v_subtotal,
      'discount_total', v_discount_total,
      'tax_total', v_tax_total,
      'grand_total', v_grand_total
    ),
    p_branch_id := p_branch_id
  );

  -- Return sale summary
  RETURN jsonb_build_object(
    'sale_id', v_sale_id,
    'order_number', v_order_number,
    'branch_id', p_branch_id,
    'shift_id', p_shift_id,
    'employee_id', p_employee_id,
    'customer_id', p_customer_id,
    'item_count', v_item_count,
    'payment_count', v_payment_count,
    'subtotal', v_subtotal,
    'discount_total', v_discount_total,
    'tax_total', v_tax_total,
    'grand_total', v_grand_total,
    'status', 'pending',
    'notes', p_notes
  );
END;
$$;
