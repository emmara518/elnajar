CREATE OR REPLACE FUNCTION close_shift(
  p_shift_id uuid,
  p_closing_cash numeric
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_shift shifts%ROWTYPE;
  v_expected_cash numeric := 0;
  v_cash_difference numeric := 0;
  v_total_sales numeric := 0;
  v_pending_count integer;
  v_employee_name text;
  v_branch_name text;
BEGIN
  -- Get shift by id
  SELECT * INTO v_shift
  FROM shifts
  WHERE id = p_shift_id AND deleted_at IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Shift with id % not found', p_shift_id;
  END IF;

  -- Verify status is open
  IF v_shift.status != 'open' THEN
    RAISE EXCEPTION 'Shift % is already closed', p_shift_id
      USING HINT = 'Only open shifts can be closed';
  END IF;

  -- Check no unconfirmed sales exist
  SELECT COUNT(*) INTO v_pending_count
  FROM sales
  WHERE shift_id = p_shift_id
    AND status NOT IN ('confirmed', 'cancelled', 'refunded')
    AND deleted_at IS NULL;

  IF v_pending_count > 0 THEN
    RAISE EXCEPTION 'Cannot close shift: % sale(s) are pending confirmation', v_pending_count
      USING HINT = 'Confirm or cancel all pending sales before closing the shift';
  END IF;

  -- Calculate expected cash from confirmed cash sales
  SELECT COALESCE(SUM(p.amount), 0) INTO v_expected_cash
  FROM payments p
  JOIN sales s ON s.id = p.sale_id
  WHERE s.shift_id = p_shift_id
    AND s.status = 'confirmed'
    AND s.deleted_at IS NULL
    AND p.method = 'cash';

  v_expected_cash := v_shift.opening_cash + v_expected_cash;

  -- Calculate total sales for the shift
  SELECT COALESCE(SUM(s.grand_total), 0) INTO v_total_sales
  FROM sales s
  WHERE s.shift_id = p_shift_id
    AND s.status = 'confirmed'
    AND s.deleted_at IS NULL;

  -- Calculate cash difference
  v_cash_difference := p_closing_cash - v_expected_cash;

  -- Update shift
  UPDATE shifts
  SET
    status = 'closed',
    closed_at = NOW(),
    closing_cash = p_closing_cash,
    expected_cash = v_expected_cash,
    cash_difference = v_cash_difference,
    total_sales = v_total_sales,
    updated_at = NOW()
  WHERE id = p_shift_id;

  -- Call audit_log
  PERFORM audit_log(
    p_actor_id := v_shift.employee_id::text,
    p_actor_type := 'employee',
    p_action := 'shift_closed',
    p_entity_type := 'shift',
    p_entity_id := p_shift_id::text,
    p_changes := jsonb_build_object(
      'opening_cash', v_shift.opening_cash,
      'closing_cash', p_closing_cash,
      'expected_cash', v_expected_cash,
      'cash_difference', v_cash_difference,
      'total_sales', v_total_sales
    ),
    p_branch_id := v_shift.branch_id
  );

  -- Return shift summary
  RETURN jsonb_build_object(
    'shift_id', p_shift_id,
    'branch_id', v_shift.branch_id,
    'employee_id', v_shift.employee_id,
    'opened_at', v_shift.opened_at,
    'closed_at', NOW(),
    'opening_cash', v_shift.opening_cash,
    'closing_cash', p_closing_cash,
    'expected_cash', v_expected_cash,
    'cash_difference', v_cash_difference,
    'total_sales', v_total_sales,
    'status', 'closed'
  );
END;
$$;
