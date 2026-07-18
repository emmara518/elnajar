CREATE OR REPLACE FUNCTION open_shift(
  p_branch_id uuid,
  p_employee_id uuid,
  p_opening_cash numeric
) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_shift_id uuid;
  v_existing_id uuid;
  v_employee_name text;
  v_branch_name text;
BEGIN
  -- Check no open shift exists for this employee at this branch today
  SELECT id INTO v_existing_id
  FROM shifts
  WHERE branch_id = p_branch_id
    AND employee_id = p_employee_id
    AND status = 'open'
    AND deleted_at IS NULL
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RAISE EXCEPTION 'An open shift already exists for this employee at this branch today'
      USING HINT = 'Close the existing shift before opening a new one';
  END IF;

  -- Get names for audit
  SELECT name INTO v_employee_name FROM employees WHERE id = p_employee_id AND deleted_at IS NULL;
  SELECT name INTO v_branch_name FROM branches WHERE id = p_branch_id AND deleted_at IS NULL;

  -- Insert new shift
  INSERT INTO shifts (
    branch_id, employee_id, opened_at, opening_cash, status
  ) VALUES (
    p_branch_id, p_employee_id, NOW(), p_opening_cash, 'open'
  )
  RETURNING id INTO v_shift_id;

  -- Call audit_log internally
  PERFORM audit_log(
    p_actor_id := p_employee_id::text,
    p_actor_type := 'employee',
    p_action := 'shift_opened',
    p_entity_type := 'shift',
    p_entity_id := v_shift_id::text,
    p_changes := jsonb_build_object(
      'branch_id', p_branch_id,
      'branch_name', v_branch_name,
      'opening_cash', p_opening_cash
    ),
    p_branch_id := p_branch_id
  );

  RETURN v_shift_id;
END;
$$;
