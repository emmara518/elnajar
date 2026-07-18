CREATE OR REPLACE FUNCTION create_employee(
  p_user_id uuid,
  p_role_id uuid,
  p_branch_id uuid,
  p_employee_code text,
  p_name text,
  p_email text,
  p_phone text,
  p_hire_date date
) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_id uuid;
  v_role_name text;
BEGIN
  -- Verify employee_code is unique
  IF EXISTS (SELECT 1 FROM employees WHERE employee_code = p_employee_code AND deleted_at IS NULL) THEN
    RAISE EXCEPTION 'Employee code % is already in use', p_employee_code
      USING HINT = 'Each employee must have a unique code';
  END IF;

  -- Verify email is unique among employees
  IF EXISTS (SELECT 1 FROM employees WHERE email = p_email AND deleted_at IS NULL) THEN
    RAISE EXCEPTION 'Email % is already in use by another employee', p_email
      USING HINT = 'Each employee must have a unique email address';
  END IF;

  -- Get role name for audit
  SELECT name INTO v_role_name FROM roles WHERE id = p_role_id AND deleted_at IS NULL;

  -- Insert employee
  INSERT INTO employees (
    user_id, employee_code, name, email, phone, hire_date, is_active
  ) VALUES (
    p_user_id, p_employee_code, p_name, p_email, p_phone, p_hire_date, true
  )
  RETURNING id INTO v_employee_id;

  -- Insert employee role assignment
  INSERT INTO employee_roles (employee_id, role_id, branch_id)
  VALUES (v_employee_id, p_role_id, p_branch_id);

  -- Call audit_log
  PERFORM audit_log(
    p_actor_id := v_employee_id::text,
    p_actor_type := 'employee',
    p_action := 'employee_created',
    p_entity_type := 'employee',
    p_entity_id := v_employee_id::text,
    p_changes := jsonb_build_object(
      'user_id', p_user_id,
      'employee_code', p_employee_code,
      'name', p_name,
      'email', p_email,
      'phone', p_phone,
      'hire_date', p_hire_date,
      'role_id', p_role_id,
      'role_name', v_role_name,
      'branch_id', p_branch_id
    ),
    p_branch_id := p_branch_id
  );

  RETURN v_employee_id;
END;
$$;
