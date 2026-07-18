-- Function to process inventory changes when sale status is updated
CREATE OR REPLACE FUNCTION process_sale_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_item record;
BEGIN
  -- Only act on status changes
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  -- Sale confirmed: release reserved quantity (stock is permanently gone)
  IF NEW.status = 'confirmed' THEN
    FOR v_item IN
      SELECT si.product_id, si.quantity
      FROM sale_items si
      WHERE si.sale_id = NEW.id
    LOOP
      UPDATE inventory_items
      SET
        reserved_quantity = GREATEST(reserved_quantity - v_item.quantity, 0),
        updated_at = NOW()
      WHERE product_id = v_item.product_id
        AND branch_id = NEW.branch_id
        AND deleted_at IS NULL;
    END LOOP;

  -- Sale cancelled: restore quantity back to stock
  ELSIF NEW.status = 'cancelled' THEN
    FOR v_item IN
      SELECT si.product_id, si.quantity
      FROM sale_items si
      WHERE si.sale_id = NEW.id
    LOOP
      UPDATE inventory_items
      SET
        quantity = quantity + v_item.quantity,
        reserved_quantity = GREATEST(reserved_quantity - v_item.quantity, 0),
        updated_at = NOW()
      WHERE product_id = v_item.product_id
        AND branch_id = NEW.branch_id
        AND deleted_at IS NULL;
    END LOOP;

  -- Sale refunded: restore quantity back to stock (same as cancelled for inventory)
  ELSIF NEW.status = 'refunded' THEN
    FOR v_item IN
      SELECT si.product_id, si.quantity
      FROM sale_items si
      WHERE si.sale_id = NEW.id
    LOOP
      UPDATE inventory_items
      SET
        quantity = quantity + v_item.quantity,
        reserved_quantity = GREATEST(reserved_quantity - v_item.quantity, 0),
        updated_at = NOW()
      WHERE product_id = v_item.product_id
        AND branch_id = NEW.branch_id
        AND deleted_at IS NULL;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Apply trigger on sales table for status changes
CREATE TRIGGER process_sale_inventory
  AFTER UPDATE OF status ON sales
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION process_sale_inventory();
