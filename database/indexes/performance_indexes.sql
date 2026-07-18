-- ============================================================================
-- PERFORMANCE INDEXES FOR TOKYO STORE POS/ERP DATABASE
-- ============================================================================
-- Grouped by category: Foreign Key, Search/Filter, Composite, and Covering
-- ============================================================================

-- ============================================================================
-- FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch_id ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_employees_role_id ON employees(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_employee_roles_employee_id ON employee_roles(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_roles_role_id ON employee_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_employee_roles_branch_id ON employee_roles(branch_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_product_id ON inventory_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_branch_id ON inventory_items(branch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_inventory_item_id ON stock_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_branch_id ON stock_movements(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_branch_id ON sales(branch_id);
CREATE INDEX IF NOT EXISTS idx_sales_shift_id ON sales(shift_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_employee_id ON sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale_id ON payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_purchases_branch_id ON purchases(branch_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_expenses_branch_id ON expenses(branch_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_branch_id ON audit_logs(branch_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, recipient_type);
CREATE INDEX IF NOT EXISTS idx_settings_company ON settings(company_id);

-- ============================================================================
-- SEARCH / FILTER INDEXES
-- ============================================================================

-- Full-text search on products
CREATE INDEX IF NOT EXISTS idx_products_search
  ON products
  USING gin(to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(description, '')));

-- Active product lookups
CREATE INDEX IF NOT EXISTS idx_products_active
  ON products(is_active)
  WHERE deleted_at IS NULL;

-- Featured product lookups
CREATE INDEX IF NOT EXISTS idx_products_featured
  ON products(is_featured)
  WHERE is_featured AND deleted_at IS NULL;

-- Customer name search
CREATE INDEX IF NOT EXISTS idx_customers_name_search
  ON customers
  USING gin(to_tsvector('simple', COALESCE(name, '')));

-- Active customers
CREATE INDEX IF NOT EXISTS idx_customers_active
  ON customers(is_active)
  WHERE deleted_at IS NULL;

-- Active suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_active
  ON suppliers(is_active)
  WHERE deleted_at IS NULL;

-- Active categories
CREATE INDEX IF NOT EXISTS idx_categories_active
  ON categories(is_active)
  WHERE deleted_at IS NULL;

-- Category parent lookups
CREATE INDEX IF NOT EXISTS idx_categories_parent
  ON categories(parent_category_id);

-- ============================================================================
-- COMPOSITE INDEXES (for common query patterns)
-- ============================================================================

-- Sales by branch and date (daily reports)
CREATE INDEX IF NOT EXISTS idx_sales_branch_date
  ON sales(branch_id, created_at DESC);

-- Sales by shift and status
CREATE INDEX IF NOT EXISTS idx_sales_shift_status
  ON sales(shift_id, status);

-- Sales by employee and date
CREATE INDEX IF NOT EXISTS idx_sales_employee_date
  ON sales(employee_id, created_at DESC);

-- Sales by status and date
CREATE INDEX IF NOT EXISTS idx_sales_status_date
  ON sales(status, created_at DESC);

-- Inventory by branch and stock level
CREATE INDEX IF NOT EXISTS idx_inventory_branch_stock
  ON inventory_items(branch_id, quantity)
  WHERE deleted_at IS NULL;

-- Stock movements by reference
CREATE INDEX IF NOT EXISTS idx_stock_movements_ref
  ON stock_movements(reference_type, reference_id);

-- Stock movements by date
CREATE INDEX IF NOT EXISTS idx_stock_movements_date
  ON stock_movements(branch_id, created_at DESC);

-- Shifts by branch and status
CREATE INDEX IF NOT EXISTS idx_shifts_branch_status
  ON shifts(branch_id, status);

-- Shifts by employee
CREATE INDEX IF NOT EXISTS idx_shifts_employee
  ON shifts(employee_id, created_at DESC);

-- Purchases by branch and status
CREATE INDEX IF NOT EXISTS idx_purchases_branch_status
  ON purchases(branch_id, status);

-- Expenses by branch and date
CREATE INDEX IF NOT EXISTS idx_expenses_branch_date
  ON expenses(branch_id, expense_date DESC);

-- Payments by sale and method
CREATE INDEX IF NOT EXISTS idx_payments_sale_method
  ON payments(sale_id, method);

-- Audit logs by actor
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_date
  ON audit_logs(actor_id, created_at DESC);

-- Audit logs by action
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON audit_logs(action, created_at DESC);

-- Unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON notifications(recipient_id, recipient_type, is_read)
  WHERE NOT is_read;

-- ============================================================================
-- COVERING INDEXES (for index-only scans)
-- ============================================================================

-- Sales summary covering common report columns
CREATE INDEX IF NOT EXISTS idx_sales_summary
  ON sales(branch_id, created_at, grand_total, status)
  WHERE deleted_at IS NULL;
