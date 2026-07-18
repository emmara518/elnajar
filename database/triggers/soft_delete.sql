-- Function to prevent hard DELETE on soft-delete tables
CREATE OR REPLACE FUNCTION soft_delete_check()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set deleted_at and is_active instead of deleting
  OLD.deleted_at = NOW();
  OLD.is_active = false;

  -- Execute the update
  EXECUTE format(
    'UPDATE %I SET deleted_at = $1, is_active = false, updated_at = NOW() WHERE id = $2',
    TG_TABLE_NAME
  ) USING OLD.deleted_at, OLD.id;

  -- Log the soft delete to audit
  INSERT INTO audit_logs (
    actor_id, actor_type, action, entity_type, entity_id,
    changes
  ) VALUES (
    COALESCE(current_setting('app.current_actor_id', true), 'system'),
    COALESCE(current_setting('app.current_actor_type', true), 'system'),
    TG_TABLE_NAME || '_soft_deleted',
    TG_TABLE_NAME,
    OLD.id::text,
    jsonb_build_object('soft_delete', true, 'deleted_at', OLD.deleted_at)
  );

  -- Prevent the actual DELETE
  RETURN NULL;
END;
$$;

-- Apply soft delete triggers to all tables that should not be hard-deleted
-- These tables have deleted_at and is_active columns and should use soft delete

CREATE TRIGGER soft_delete
  BEFORE DELETE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON branches
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

CREATE TRIGGER soft_delete
  BEFORE DELETE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_check();

-- Note: audit_logs, stock_movements, and other immutable/log tables
-- allow hard DELETE (no trigger) since they are append-only.
