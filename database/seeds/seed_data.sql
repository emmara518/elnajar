-- ============================================================================
-- TOKYO Store POS/ERP — Development Seed Data
-- ============================================================================
-- This file populates the database with realistic sample data for development
-- and testing. All IDs are generated via uuid_generate_v4() or subqueries to
-- ensure referential integrity. Run after all migrations have been applied.
-- ============================================================================

-- ============================================================================
-- 1. COMPANY
-- ============================================================================
INSERT INTO companies (name, legal_name, tax_id, commercial_register, email, phone, address, is_active)
VALUES (
  'TOKYO Store',
  'TOKYO Store for Electronics',
  '123456789',
  'CR-2024-001',
  'info@tokyostore.com',
  '+20-2-12345678',
  '{"street":"1 Nile Street","city":"Cairo","state":"Cairo Governorate","postalCode":"11511","country":"EG","lat":30.0444,"lng":31.2357}',
  true
);

-- ============================================================================
-- 2. BRANCHES (3)
-- ============================================================================
WITH comp AS (SELECT id FROM companies LIMIT 1)
INSERT INTO branches (company_id, name, code, phone, address, opening_time, closing_time, timezone, is_active)
VALUES
  ((SELECT id FROM comp), 'Downtown Cairo', 'CAI-001', '+20-2-23456789',
   '{"street":"15 Tahrir Square","city":"Cairo","state":"Cairo Governorate","postalCode":"11511","country":"EG","lat":30.0448,"lng":31.2357}',
   '09:00', '22:00', 'Africa/Cairo', true),
  ((SELECT id FROM comp), 'Heliopolis', 'CAI-002', '+20-2-34567890',
   '{"street":"42 El-Merghany Street","city":"Heliopolis","state":"Cairo Governorate","postalCode":"11341","country":"EG","lat":30.0899,"lng":31.3329}',
   '09:00', '22:00', 'Africa/Cairo', true),
  ((SELECT id FROM comp), 'Alexandria', 'ALX-001', '+20-3-45678901',
   '{"street":"8 Saad Zaghloul Street","city":"Alexandria","state":"Alexandria Governorate","postalCode":"21511","country":"EG","lat":31.2001,"lng":29.9187}',
   '09:00', '22:00', 'Africa/Cairo', true);

-- ============================================================================
-- 3. ROLES (5)
-- ============================================================================
INSERT INTO roles (name, slug, description, is_system_role, rank)
VALUES
  ('Owner', 'owner', 'Full system access — company-wide ownership', true, 1),
  ('Branch Manager', 'branch-manager', 'Manages daily operations of a single branch', true, 2),
  ('Cashier', 'cashier', 'Processes sales and handles POS operations', true, 3),
  ('Support', 'support', 'Customer support and after-sales service', true, 4),
  ('Inventory Clerk', 'inventory-clerk', 'Manages stock receiving, transfers, and counts', true, 5);

-- ============================================================================
-- 4. PERMISSIONS (20)
-- ============================================================================
INSERT INTO permissions (resource, action, name, description)
VALUES
  ('products', 'create', 'Create Products', 'Create new products and services'),
  ('products', 'read',   'Read Products',   'View product catalog and details'),
  ('products', 'update', 'Update Products', 'Modify existing product information'),
  ('products', 'delete', 'Delete Products', 'Remove products from catalog'),
  ('sales',    'create', 'Create Sales',    'Record new sales transactions'),
  ('sales',    'read',   'Read Sales',      'View sales records and receipts'),
  ('sales',    'update', 'Update Sales',    'Modify existing sales (non-cancelled)'),
  ('sales',    'cancel', 'Cancel Sales',    'Cancel or void sales transactions'),
  ('inventory', 'read',    'Read Inventory',    'View stock levels across branches'),
  ('inventory', 'adjust',  'Adjust Inventory',  'Perform stock adjustments (write-offs, corrections)'),
  ('inventory', 'transfer','Transfer Inventory', 'Transfer stock between branches'),
  ('employees', 'create', 'Create Employees', 'Hire and onboard new employees'),
  ('employees', 'read',   'Read Employees',   'View employee profiles and details'),
  ('employees', 'update', 'Update Employees', 'Modify employee information and roles'),
  ('reports',   'sales',     'Sales Reports',     'Generate and view sales reports'),
  ('reports',   'inventory', 'Inventory Reports', 'Generate and view inventory reports'),
  ('reports',   'financial', 'Financial Reports', 'Generate and view financial reports'),
  ('settings',  'read',   'Read Settings',   'View system settings and configuration'),
  ('settings',  'update', 'Update Settings', 'Modify system settings'),
  ('audit',     'read',   'Read Audit Log',  'View audit trail and system logs');

-- ============================================================================
-- 5. ROLE-PERMISSION MAPPINGS
-- ============================================================================
-- Owner: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'owner';

-- Branch Manager: most permissions except delete products, settings.update
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'branch-manager'
  AND NOT (p.resource = 'products' AND p.action = 'delete')
  AND NOT (p.resource = 'settings' AND p.action = 'update')
  AND NOT (p.resource = 'audit'    AND p.action = 'read');

-- Cashier: sales + products.read + inventory.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'cashier'
  AND (
    (p.resource = 'sales'     AND p.action IN ('create', 'read'))
    OR (p.resource = 'products'   AND p.action = 'read')
    OR (p.resource = 'inventory'  AND p.action = 'read')
  );

-- Support: products.read + sales.read + employees.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'support'
  AND (
    (p.resource = 'products'  AND p.action = 'read')
    OR (p.resource = 'sales'  AND p.action = 'read')
    OR (p.resource = 'employees' AND p.action = 'read')
  );

-- Inventory Clerk: inventory.* + products.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.slug = 'inventory-clerk'
  AND (
    (p.resource = 'inventory' AND p.action IN ('read', 'adjust', 'transfer'))
    OR (p.resource = 'products' AND p.action = 'read')
  );

-- ============================================================================
-- 6. CATEGORIES (8, with hierarchy)
-- ============================================================================
WITH cat AS (
  INSERT INTO categories (name, slug, parent_category_id, sort_order, is_active)
  VALUES ('Electronics', 'electronics', NULL, 1, true)
  RETURNING id
)
INSERT INTO categories (name, slug, parent_category_id, sort_order, is_active)
VALUES
  ('Smartphones',  'smartphones',  (SELECT id FROM cat), 1, true),
  ('Laptops',      'laptops',      (SELECT id FROM cat), 2, true),
  ('Audio',        'audio',        (SELECT id FROM cat), 3, true),
  ('Accessories',  'accessories',  (SELECT id FROM cat), 4, true),
  ('Gaming',       'gaming',       NULL, 2, true),
  ('Appliances',   'appliances',   NULL, 3, true),
  ('Office Supplies', 'office-supplies', NULL, 4, true);

-- ============================================================================
-- 7. SUPPLIERS (3)
-- ============================================================================
INSERT INTO suppliers (name, contact_person, email, phone, address, payment_terms, lead_time_days, is_active)
VALUES
  ('TechDistributor EG', 'Amr El-Sayed', 'orders@techdistributor.eg', '+20-2-11111111',
   '{"street":"10 Industrial Zone","city":"6th of October City","state":"Giza Governorate","postalCode":"12511","country":"EG"}',
   'NET30', 7, true),
  ('Global Electronics Ltd', 'John Smith', 'sales@globalelectronics.com', '+44-20-7946-0958',
   '{"street":"200 Tech Park","city":"London","state":"Greater London","postalCode":"EC2A 4NE","country":"GB"}',
   'NET45', 14, true),
  ('Local Parts Co.', 'Mona Gamal', 'info@localparts.eg', '+20-2-22222222',
   '{"street":"55 El-Salam Street","city":"Giza","state":"Giza Governorate","postalCode":"12511","country":"EG"}',
   'COD', 3, true);

-- ============================================================================
-- 8. PRODUCTS (12+)
-- ============================================================================
WITH
  sup AS (SELECT id, name FROM suppliers),
  cat AS (SELECT id, slug FROM categories)
INSERT INTO products (sku, barcode, name, description, unit, retail_price, cost_price, category_id, supplier_id, tags, images, is_active)
VALUES
  -- Smartphones
  ('IP15PM-256-BLK', '0885909935116', 'iPhone 15 Pro Max 256GB',
   'Apple iPhone 15 Pro Max with A17 Pro chip, 256GB storage, 48MP camera, Black Titanium',
   'piece', 48999.00, 42500.00,
   (SELECT id FROM cat WHERE slug = 'smartphones'),
   (SELECT id FROM sup WHERE name = 'Global Electronics Ltd'),
   '["apple","iphone","smartphone","5g","flagship"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=iPhone+15+Pro+Max","alt":"iPhone 15 Pro Max","isPrimary":true}]'::jsonb,
   true),

  ('SGS24-256-BLK', '0887386765103', 'Samsung Galaxy S24 256GB',
   'Samsung Galaxy S24 with Exynos 2400, 256GB storage, 50MP camera, Onyx Black',
   'piece', 35999.00, 31000.00,
   (SELECT id FROM cat WHERE slug = 'smartphones'),
   (SELECT id FROM sup WHERE name = 'Global Electronics Ltd'),
   '["samsung","galaxy","smartphone","5g","android"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=Galaxy+S24","alt":"Samsung Galaxy S24","isPrimary":true}]'::jsonb,
   true),

  -- Laptops
  ('MBA-M3-256-SLV', '0194253372484', 'MacBook Air M3 256GB',
   'Apple MacBook Air with M3 chip, 8GB RAM, 256GB SSD, 15.3-inch Liquid Retina, Silver',
   'piece', 42999.00, 37000.00,
   (SELECT id FROM cat WHERE slug = 'laptops'),
   (SELECT id FROM sup WHERE name = 'Global Electronics Ltd'),
   '["apple","macbook","laptop","m3","silver"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=MacBook+Air+M3","alt":"MacBook Air M3","isPrimary":true}]'::jsonb,
   true),

  ('XPS15-9530-SLV', '0889842963526', 'Dell XPS 15 9530',
   'Dell XPS 15, Intel Core i7-13700H, 16GB RAM, 512GB SSD, NVIDIA RTX 4050, Silver',
   'piece', 38999.00, 33500.00,
   (SELECT id FROM cat WHERE slug = 'laptops'),
   (SELECT id FROM sup WHERE name = 'TechDistributor EG'),
   '["dell","xps","laptop","windows","i7"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=Dell+XPS+15","alt":"Dell XPS 15","isPrimary":true}]'::jsonb,
   true),

  -- Audio
  ('WH1000XM5-BLK', '0276946842345', 'Sony WH-1000XM5 Wireless Headphones',
   'Sony WH-1000XM5 over-ear noise-cancelling headphones, 30h battery, Black',
   'piece', 7499.00, 6200.00,
   (SELECT id FROM cat WHERE slug = 'audio'),
   (SELECT id FROM sup WHERE name = 'TechDistributor EG'),
   '["sony","headphones","wireless","noise-cancelling","audio"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=WH-1000XM5","alt":"Sony WH-1000XM5","isPrimary":true}]'::jsonb,
   true),

  ('APP-AIRPODS2-WHT', '0194253372484', 'AirPods Pro 2nd Gen',
   'Apple AirPods Pro 2nd Gen with USB-C, Active Noise Cancellation, Adaptive Audio',
   'piece', 8999.00, 7200.00,
   (SELECT id FROM cat WHERE slug = 'audio'),
   (SELECT id FROM sup WHERE name = 'Global Electronics Ltd'),
   '["apple","airpods","earphones","wireless","audio"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=AirPods+Pro+2","alt":"AirPods Pro 2nd Gen","isPrimary":true}]'::jsonb,
   true),

  -- Accessories
  ('USBC-HUB-7IN1-GRY', '0840016589931', '7-in-1 USB-C Hub',
   'USB-C hub with HDMI 4K, 3x USB-A 3.0, SD/microSD, PD 100W, Space Gray',
   'piece', 1299.00, 850.00,
   (SELECT id FROM cat WHERE slug = 'accessories'),
   (SELECT id FROM sup WHERE name = 'Local Parts Co.'),
   '["usb-c","hub","adapter","accessories"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=USB-C+Hub","alt":"7-in-1 USB-C Hub","isPrimary":true}]'::jsonb,
   true),

  ('MX-MASTER3S-GRY', '0840066175771', 'Logitech MX Master 3S Mouse',
   'Logitech MX Master 3S wireless mouse, 8000 DPI, quiet clicks, USB-C, Graphite',
   'piece', 3499.00, 2700.00,
   (SELECT id FROM cat WHERE slug = 'accessories'),
   (SELECT id FROM sup WHERE name = 'TechDistributor EG'),
   '["logitech","mouse","wireless","ergonomic"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=MX+Master+3S","alt":"Logitech MX Master 3S","isPrimary":true}]'::jsonb,
   true),

  ('LAPSTAND-ALUM-GRY', '0694428471391', 'Adjustable Laptop Stand',
   'Aluminum adjustable laptop stand, foldable, compatible with 10-17 inch laptops, Gray',
   'piece', 899.00, 520.00,
   (SELECT id FROM cat WHERE slug = 'accessories'),
   (SELECT id FROM sup WHERE name = 'Local Parts Co.'),
   '["laptop","stand","ergonomic","aluminum"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=Laptop+Stand","alt":"Adjustable Laptop Stand","isPrimary":true}]'::jsonb,
   true),

  -- Gaming
  ('PS5-DISC-825', '0711719469295', 'PlayStation 5 Digital Edition',
   'Sony PlayStation 5 Digital Edition, 825GB custom SSD, DualSense controller included',
   'piece', 21999.00, 18500.00,
   (SELECT id FROM cat WHERE slug = 'gaming'),
   (SELECT id FROM sup WHERE name = 'Global Electronics Ltd'),
   '["sony","ps5","gaming","console"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=PS5","alt":"PlayStation 5","isPrimary":true}]'::jsonb,
   true),

  ('XBOX-WL-CTRL-BLK', '0888896293514', 'Xbox Wireless Controller',
   'Xbox wireless controller with USB-C, Black, compatible with Xbox Series X|S, Xbox One, Windows',
   'piece', 1999.00, 1450.00,
   (SELECT id FROM cat WHERE slug = 'gaming'),
   (SELECT id FROM sup WHERE name = 'TechDistributor EG'),
   '["xbox","controller","gaming","wireless"]'::jsonb,
   '[{"url":"https://placehold.co/600x600?text=Xbox+Controller","alt":"Xbox Wireless Controller","isPrimary":true}]'::jsonb,
   true);

-- ============================================================================
-- 9. CUSTOMERS (2)
-- ============================================================================
INSERT INTO customers (name, email, phone, address, is_active)
VALUES
  ('Ahmed Hassan', 'ahmed@example.com', '+20-10-00001111',
   '{"street":"12 El-Tahrir Street","city":"Cairo","state":"Cairo Governorate","postalCode":"11511","country":"EG"}',
   true),
  ('Sara Mahmoud', 'sara@example.com', '+20-12-22223333',
   '{"street":"5 El-Nasr Road","city":"Heliopolis","state":"Cairo Governorate","postalCode":"11341","country":"EG"}',
   true);

-- ============================================================================
-- 10. EMPLOYEES (4)
-- ============================================================================
WITH
  roles_cte AS (SELECT id, slug FROM roles),
  branches_cte AS (SELECT id, code FROM branches)
INSERT INTO employees (employee_code, user_id, name, email, phone, role_id, branch_id, is_active)
VALUES
  ('EMP-001', NULL, 'Admin User', 'admin@tokyostore.com', '+20-10-33334444',
   (SELECT id FROM roles_cte WHERE slug = 'owner'),
   (SELECT id FROM branches_cte WHERE code = 'CAI-001'),
   true),
  ('EMP-002', NULL, 'Khaled Ali', 'khaled.ali@tokyostore.com', '+20-10-44445555',
   (SELECT id FROM roles_cte WHERE slug = 'branch-manager'),
   (SELECT id FROM branches_cte WHERE code = 'CAI-001'),
   true),
  ('EMP-003', NULL, 'Mohamed Nour', 'mohamed.nour@tokyostore.com', '+20-10-55556666',
   (SELECT id FROM roles_cte WHERE slug = 'cashier'),
   (SELECT id FROM branches_cte WHERE code = 'CAI-001'),
   true),
  ('EMP-004', NULL, 'Yara Ibrahim', 'yara.ibrahim@tokyostore.com', '+20-12-66667777',
   (SELECT id FROM roles_cte WHERE slug = 'cashier'),
   (SELECT id FROM branches_cte WHERE code = 'CAI-002'),
   true);

-- ============================================================================
-- 11. SETTINGS
-- ============================================================================
INSERT INTO settings (company_id, key, value, group_name, is_encrypted)
VALUES
  ((SELECT id FROM companies LIMIT 1), 'currency',           'EGP',     'general',    false),
  ((SELECT id FROM companies LIMIT 1), 'currency_symbol',    'E£',      'general',    false),
  ((SELECT id FROM companies LIMIT 1), 'default_tax_rate',   '14',      'tax',        false),
  ((SELECT id FROM companies LIMIT 1), 'tax_type',           'inclusive','tax',        false),
  ((SELECT id FROM companies LIMIT 1), 'order_prefix',       'ORD-',    'sales',      false),
  ((SELECT id FROM companies LIMIT 1), 'invoice_prefix',     'INV-',    'sales',      false),
  ((SELECT id FROM companies LIMIT 1), 'receipt_footer',     'Thank you for shopping at TOKYO Store!', 'receipt', false),
  ((SELECT id FROM companies LIMIT 1), 'low_stock_threshold','5',       'inventory',  false),
  ((SELECT id FROM companies LIMIT 1), 'timezone',           'Africa/Cairo', 'general', false),
  ((SELECT id FROM companies LIMIT 1), 'date_format',        'YYYY-MM-DD', 'general',  false),
  ((SELECT id FROM companies LIMIT 1), 'fiscal_year_start',  '01-01',   'general',    false);

-- ============================================================================
-- 12. INVENTORY (per branch with varying stock levels)
-- ============================================================================
-- Some products are low stock (below reorder_point) to test alerts.
WITH
  branches_cte AS (SELECT id, code FROM branches),
  prod AS (SELECT id, sku FROM products)
INSERT INTO inventory_items (product_id, branch_id, quantity, min_stock, max_stock, reorder_point, location_in_branch)
VALUES
  -- Downtown Cairo (CAI-001)
  ((SELECT id FROM prod WHERE sku = 'IP15PM-256-BLK'), (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 10, 3, 30, 5,  'Aisle A-Shelf 1'),
  ((SELECT id FROM prod WHERE sku = 'SGS24-256-BLK'),  (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 8,  3, 25, 5,  'Aisle A-Shelf 2'),
  ((SELECT id FROM prod WHERE sku = 'MBA-M3-256-SLV'),  (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 5,  2, 15, 3,  'Aisle B-Shelf 1'),
  ((SELECT id FROM prod WHERE sku = 'XPS15-9530-SLV'),  (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 3,  2, 12, 3,  'Aisle B-Shelf 2'),
  ((SELECT id FROM prod WHERE sku = 'WH1000XM5-BLK'),   (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 15, 5, 40, 8,  'Aisle C-Shelf 1'),
  ((SELECT id FROM prod WHERE sku = 'APP-AIRPODS2-WHT'),(SELECT id FROM branches_cte WHERE code = 'CAI-001'), 20, 5, 50, 10, 'Aisle C-Shelf 2'),
  ((SELECT id FROM prod WHERE sku = 'USBC-HUB-7IN1-GRY'),(SELECT id FROM branches_cte WHERE code = 'CAI-001'), 30, 10, 80, 15,'Aisle D-Shelf 1'),
  ((SELECT id FROM prod WHERE sku = 'MX-MASTER3S-GRY'), (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 12, 5, 30, 8,  'Aisle D-Shelf 2'),
  ((SELECT id FROM prod WHERE sku = 'LAPSTAND-ALUM-GRY'),(SELECT id FROM branches_cte WHERE code = 'CAI-001'), 25, 10, 60, 15,'Aisle D-Shelf 3'),
  ((SELECT id FROM prod WHERE sku = 'PS5-DISC-825'),    (SELECT id FROM branches_cte WHERE code = 'CAI-001'), 4,  2, 10, 3,  'Aisle E-Shelf 1'),
  ((SELECT id FROM prod WHERE sku = 'XBOX-WL-CTRL-BLK'),(SELECT id FROM branches_cte WHERE code = 'CAI-001'), 7,  3, 20, 5,  'Aisle E-Shelf 2'),

  -- Heliopolis (CAI-002)
  ((SELECT id FROM prod WHERE sku = 'IP15PM-256-BLK'), (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 6,  3, 20, 5,  'Section A-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'SGS24-256-BLK'),  (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 4,  2, 15, 3,  'Section A-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'MBA-M3-256-SLV'),  (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 7,  3, 20, 5,  'Section B-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'XPS15-9530-SLV'),  (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 2,  2, 10, 3,  'Section B-Rack 2'),
  ((SELECT id FROM prod WHERE sku = 'WH1000XM5-BLK'),   (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 10, 5, 30, 8,  'Section C-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'APP-AIRPODS2-WHT'),(SELECT id FROM branches_cte WHERE code = 'CAI-002'), 14, 5, 40, 10, 'Section C-Rack 2'),
  ((SELECT id FROM prod WHERE sku = 'USBC-HUB-7IN1-GRY'),(SELECT id FROM branches_cte WHERE code = 'CAI-002'), 20, 10, 60, 15,'Section D-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'MX-MASTER3S-GRY'), (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 8,  5, 25, 8,  'Section D-Rack 2'),
  ((SELECT id FROM prod WHERE sku = 'PS5-DISC-825'),    (SELECT id FROM branches_cte WHERE code = 'CAI-002'), 6,  3, 15, 5,  'Section E-Rack 1'),
  ((SELECT id FROM prod WHERE sku = 'XBOX-WL-CTRL-BLK'),(SELECT id FROM branches_cte WHERE code = 'CAI-002'), 10, 5, 25, 8,  'Section E-Rack 2'),

  -- Alexandria (ALX-001)
  ((SELECT id FROM prod WHERE sku = 'IP15PM-256-BLK'), (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 3,  2, 15, 3,  'Rack 1-Shelf A'),
  ((SELECT id FROM prod WHERE sku = 'SGS24-256-BLK'),  (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 2,  2, 10, 3,  'Rack 1-Shelf B'),
  ((SELECT id FROM prod WHERE sku = 'MBA-M3-256-SLV'),  (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 4,  2, 12, 3,  'Rack 2-Shelf A'),
  ((SELECT id FROM prod WHERE sku = 'WH1000XM5-BLK'),   (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 6,  3, 20, 5,  'Rack 3-Shelf A'),
  ((SELECT id FROM prod WHERE sku = 'APP-AIRPODS2-WHT'),(SELECT id FROM branches_cte WHERE code = 'ALX-001'), 8,  5, 25, 8,  'Rack 3-Shelf B'),
  ((SELECT id FROM prod WHERE sku = 'USBC-HUB-7IN1-GRY'),(SELECT id FROM branches_cte WHERE code = 'ALX-001'), 15, 10, 40, 10,'Rack 4-Shelf A'),
  ((SELECT id FROM prod WHERE sku = 'MX-MASTER3S-GRY'), (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 5,  3, 15, 5,  'Rack 4-Shelf B'),
  ((SELECT id FROM prod WHERE sku = 'LAPSTAND-ALUM-GRY'),(SELECT id FROM branches_cte WHERE code = 'ALX-001'), 10, 5, 30, 8,  'Rack 4-Shelf C'),
  ((SELECT id FROM prod WHERE sku = 'PS5-DISC-825'),    (SELECT id FROM branches_cte WHERE code = 'ALX-001'), 2,  1, 8,  2,  'Rack 5-Shelf A'),
  ((SELECT id FROM prod WHERE sku = 'XBOX-WL-CTRL-BLK'),(SELECT id FROM branches_cte WHERE code = 'ALX-001'), 5,  3, 15, 5,  'Rack 5-Shelf B');

-- ============================================================================
-- 13. OPEN SHIFT (Mohamed Nour, Downtown Cairo)
-- ============================================================================
INSERT INTO shifts (employee_id, branch_id, opened_at, opening_cash, status)
SELECT
  e.id,
  e.branch_id,
  NOW() - INTERVAL '3 hours',
  2000.00,
  'open'
FROM employees e
WHERE e.employee_code = 'EMP-003';
