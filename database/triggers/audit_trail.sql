-- Trigger function to automatically log changes to critical tables
CREATE OR REPLACE FUNCTION audit_trail_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_action text;
  v_changes jsonb;
  v_actor_id text;
  v_actor_type text;
  v_branch_id uuid;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    v_action := TG_TABLE_NAME || '_created';
    v_changes := jsonb_build_object('new', row_to_json(NEW)::jsonb);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := TG_TABLE_NAME || '_updated';
    v_changes := jsonb_build_object(
      'old', row_to_json(OLD)::jsonb,
      'new', row_to_json(NEW)::jsonb
    );
  ELSIF TG_OP = 'DELETE' THEN
    v_action := TG_TABLE_NAME || '_deleted';
    v_changes := jsonb_build_object('old', row_to_json(OLD)::jsonb);
  ELSE
    RETURN NULL;
  END IF;

  -- Try to capture actor from session setting (fallback to system)
  BEGIN
    v_actor_id := current_setting('app.current_actor_id', true);
    v_actor_type := current_setting('app.current_actor_type', true);
  EXCEPTION WHEN OTHERS THEN
    v_actor_id := 'system';
    v_actor_type := 'system';
  END;

  -- Try to capture branch context
  BEGIN
    v_branch_id := current_setting('app.current_branch_id', true)::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_branch_id := NULL;
  END;

  -- Insert audit log entry
  INSERT INTO audit_logs (
    actor_id, actor_type, action, entity_type, entity_id,
    changes, branch_id
  ) VALUES (
    v_actor_id, v_actor_type, v_action, TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    v_changes, v_branch_id
  );

  -- For DELETE triggers, return OLD to proceed with deletion
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

-- Apply audit trail triggers to critical tables
-- Products: track name, price, isActive changes
CREATE TRIGGER audit_trail
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION audit_trail_trigger();

-- Employees: track role, branch, isActive changes
CREATE TRIGGER audit_trail
  AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION audit_trail_trigger();

-- Inventory items: track quantity changes
CREATE TRIGGER audit_trail
  AFTER INSERT OR UPDATE OR DELETE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION audit_trail_trigger();

-- Sales: track status changes
CREATE TRIGGER audit_trail
  AFTER INSERT OR UPDATE OR DELETE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION audit_trail_trigger();
