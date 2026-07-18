-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR TOKYO STORE POS/ERP DATABASE
-- ============================================================================
-- Roles mapped to JWT claim 'app_role':
--   owner          — Full access
--   branch_manager — Full access to their branch
--   cashier        — Create/read sales, read products/inventory
--   support        — Read-only access
--   guest          — Public, unauthenticated (read products, create customer)
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.app_role() RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('app.current_app_role', true);
$$;

CREATE OR REPLACE FUNCTION auth.current_branch_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('app.current_branch_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.current_employee_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('app.current_employee_id', true)::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.current_user_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('app.current_user_id', true)::uuid;
$$;

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attachments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMPANIES
-- ============================================================================
-- owner: full access; others: no access

CREATE POLICY companies_owner ON companies
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY companies_branch_manager_read ON companies
  FOR SELECT USING (auth.app_role() = 'branch_manager');

-- ============================================================================
-- BRANCHES
-- ============================================================================

CREATE POLICY branches_owner ON branches
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY branches_branch_manager ON branches
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND id = auth.current_branch_id()
  );

-- ============================================================================
-- USERS (customers)
-- ============================================================================

CREATE POLICY users_owner ON users
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY users_branch_manager ON users
  FOR SELECT USING (
    auth.app_role() = 'branch_manager'
    AND preferred_branch_id = auth.current_branch_id()
  );

CREATE POLICY users_support ON users
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- CUSTOMERS
-- ============================================================================

CREATE POLICY customers_owner ON customers
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY customers_branch_manager ON customers
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND (id IN (SELECT customer_id FROM sales WHERE branch_id = auth.current_branch_id()))
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND (id IN (SELECT customer_id FROM sales WHERE branch_id = auth.current_branch_id()))
  );

CREATE POLICY customers_guest_insert ON customers
  FOR INSERT WITH CHECK (auth.app_role() = 'guest');

CREATE POLICY customers_support ON customers
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- EMPLOYEES
-- ============================================================================

CREATE POLICY employees_owner ON employees
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY employees_branch_manager ON employees
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

CREATE POLICY employees_self_read ON employees
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND id = auth.current_employee_id()
  );

-- ============================================================================
-- ROLES & PERMISSIONS
-- ============================================================================

CREATE POLICY roles_owner ON roles
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY permissions_owner ON permissions
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY role_permissions_owner ON role_permissions
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY employee_roles_owner ON employee_roles
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY employee_roles_branch_manager ON employee_roles
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

-- ============================================================================
-- SETTINGS
-- ============================================================================

CREATE POLICY settings_owner ON settings
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY settings_branch_manager_read ON settings
  FOR SELECT USING (
    auth.app_role() = 'branch_manager'
    AND (branch_id = auth.current_branch_id() OR branch_id IS NULL)
  );

CREATE POLICY settings_support_read ON settings
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- CATEGORIES
-- ============================================================================

CREATE POLICY categories_owner ON categories
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY categories_branch_manager_read ON categories
  FOR SELECT USING (auth.app_role() = 'branch_manager');

CREATE POLICY categories_cashier_read ON categories
  FOR SELECT USING (auth.app_role() = 'cashier');

CREATE POLICY categories_support_read ON categories
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- PRODUCTS
-- ============================================================================

CREATE POLICY products_owner ON products
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY products_branch_manager ON products
  FOR ALL USING (auth.app_role() = 'branch_manager')
  WITH CHECK (auth.app_role() = 'branch_manager');

CREATE POLICY products_cashier_read ON products
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND is_active = true
    AND deleted_at IS NULL
  );

CREATE POLICY products_support_read ON products
  FOR SELECT USING (auth.app_role() = 'support');

CREATE POLICY products_guest_read ON products
  FOR SELECT USING (
    auth.app_role() = 'guest'
    AND is_active = true
    AND deleted_at IS NULL
  );

-- ============================================================================
-- PRODUCT CATEGORIES (junction)
-- ============================================================================

CREATE POLICY product_categories_owner ON product_categories
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY product_categories_branch_manager ON product_categories
  FOR ALL USING (auth.app_role() = 'branch_manager')
  WITH CHECK (auth.app_role() = 'branch_manager');

CREATE POLICY product_categories_read ON product_categories
  FOR SELECT USING (auth.app_role() IN ('cashier', 'support', 'guest'));

-- ============================================================================
-- SUPPLIERS
-- ============================================================================

CREATE POLICY suppliers_owner ON suppliers
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY suppliers_branch_manager ON suppliers
  FOR ALL USING (auth.app_role() = 'branch_manager')
  WITH CHECK (auth.app_role() = 'branch_manager');

CREATE POLICY suppliers_cashier_read ON suppliers
  FOR SELECT USING (auth.app_role() = 'cashier');

CREATE POLICY suppliers_support_read ON suppliers
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- INVENTORY ITEMS
-- ============================================================================

CREATE POLICY inventory_owner ON inventory_items
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY inventory_branch_manager ON inventory_items
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

CREATE POLICY inventory_cashier_read ON inventory_items
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
    AND deleted_at IS NULL
  );

CREATE POLICY inventory_support_read ON inventory_items
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- STOCK MOVEMENTS
-- ============================================================================

CREATE POLICY stock_movements_owner ON stock_movements
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY stock_movements_branch_manager ON stock_movements
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

CREATE POLICY stock_movements_cashier_read ON stock_movements
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
  );

-- ============================================================================
-- SHIFTS
-- ============================================================================

CREATE POLICY shifts_owner ON shifts
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY shifts_branch_manager ON shifts
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

CREATE POLICY shifts_cashier ON shifts
  FOR ALL USING (
    auth.app_role() = 'cashier'
    AND employee_id = auth.current_employee_id()
  )
  WITH CHECK (
    auth.app_role() = 'cashier'
    AND employee_id = auth.current_employee_id()
  );

-- ============================================================================
-- SALES
-- ============================================================================

CREATE POLICY sales_owner ON sales
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY sales_branch_manager ON sales
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

CREATE POLICY sales_cashier_select ON sales
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
    AND employee_id = auth.current_employee_id()
  );

CREATE POLICY sales_cashier_insert ON sales
  FOR INSERT WITH CHECK (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
    AND employee_id = auth.current_employee_id()
  );

CREATE POLICY sales_cashier_update ON sales
  FOR UPDATE USING (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
    AND employee_id = auth.current_employee_id()
  )
  WITH CHECK (
    auth.app_role() = 'cashier'
    AND branch_id = auth.current_branch_id()
    AND employee_id = auth.current_employee_id()
  );

-- ============================================================================
-- SALE ITEMS
-- ============================================================================

CREATE POLICY sale_items_owner ON sale_items
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY sale_items_branch_manager ON sale_items
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND sale_id IN (SELECT id FROM sales WHERE branch_id = auth.current_branch_id())
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND sale_id IN (SELECT id FROM sales WHERE branch_id = auth.current_branch_id())
  );

CREATE POLICY sale_items_cashier ON sale_items
  FOR INSERT WITH CHECK (
    auth.app_role() = 'cashier'
    AND sale_id IN (SELECT id FROM sales WHERE employee_id = auth.current_employee_id())
  );

CREATE POLICY sale_items_cashier_read ON sale_items
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND sale_id IN (SELECT id FROM sales WHERE employee_id = auth.current_employee_id())
  );

-- ============================================================================
-- PAYMENTS
-- ============================================================================

CREATE POLICY payments_owner ON payments
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY payments_branch_manager ON payments
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND sale_id IN (SELECT id FROM sales WHERE branch_id = auth.current_branch_id())
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND sale_id IN (SELECT id FROM sales WHERE branch_id = auth.current_branch_id())
  );

CREATE POLICY payments_cashier ON payments
  FOR INSERT WITH CHECK (
    auth.app_role() = 'cashier'
    AND sale_id IN (SELECT id FROM sales WHERE employee_id = auth.current_employee_id())
  );

CREATE POLICY payments_cashier_read ON payments
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND sale_id IN (SELECT id FROM sales WHERE employee_id = auth.current_employee_id())
  );

-- ============================================================================
-- EXPENSES
-- ============================================================================

CREATE POLICY expenses_owner ON expenses
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY expenses_branch_manager ON expenses
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

-- ============================================================================
-- PURCHASES
-- ============================================================================

CREATE POLICY purchases_owner ON purchases
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY purchases_branch_manager ON purchases
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND branch_id = auth.current_branch_id()
  );

-- ============================================================================
-- PURCHASE ITEMS
-- ============================================================================

CREATE POLICY purchase_items_owner ON purchase_items
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY purchase_items_branch_manager ON purchase_items
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND purchase_id IN (SELECT id FROM purchases WHERE branch_id = auth.current_branch_id())
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND purchase_id IN (SELECT id FROM purchases WHERE branch_id = auth.current_branch_id())
  );

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE POLICY audit_logs_owner ON audit_logs
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY audit_logs_support_read ON audit_logs
  FOR SELECT USING (auth.app_role() = 'support');

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE POLICY notifications_owner ON notifications
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY notifications_branch_manager ON notifications
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND (recipient_id = auth.current_branch_id()::text OR recipient_id = auth.current_employee_id()::text)
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND (recipient_id = auth.current_branch_id()::text OR recipient_id = auth.current_employee_id()::text)
  );

CREATE POLICY notifications_cashier ON notifications
  FOR ALL USING (
    auth.app_role() = 'cashier'
    AND recipient_id = auth.current_employee_id()::text
    AND recipient_type = 'employee'
  )
  WITH CHECK (
    auth.app_role() = 'cashier'
    AND recipient_id = auth.current_employee_id()::text
    AND recipient_type = 'employee'
  );

-- ============================================================================
-- ATTACHMENTS
-- ============================================================================

CREATE POLICY attachments_owner ON attachments
  FOR ALL USING (auth.app_role() = 'owner')
  WITH CHECK (auth.app_role() = 'owner');

CREATE POLICY attachments_branch_manager ON attachments
  FOR ALL USING (
    auth.app_role() = 'branch_manager'
    AND uploaded_by_id IN (SELECT id FROM employees WHERE branch_id = auth.current_branch_id())
  )
  WITH CHECK (
    auth.app_role() = 'branch_manager'
    AND uploaded_by_id IN (SELECT id FROM employees WHERE branch_id = auth.current_branch_id())
  );

CREATE POLICY attachments_cashier ON attachments
  FOR INSERT WITH CHECK (
    auth.app_role() = 'cashier'
    AND uploaded_by_id = auth.current_employee_id()
  );

CREATE POLICY attachments_cashier_read ON attachments
  FOR SELECT USING (
    auth.app_role() = 'cashier'
    AND uploaded_by_id = auth.current_employee_id()
  );
