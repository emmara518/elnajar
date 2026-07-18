# TOKYO Store — Database Architecture

## Purpose

The TOKYO Store database powers a retail POS/ERP system for a single-tenant electronics retail chain with multiple branches. It manages products, inventory, sales, employees, shifts, and reporting — all within a PostgreSQL + Supabase ecosystem.

## Technology Stack

| Component          | Technology                          |
| ------------------ | ----------------------------------- |
| Database           | PostgreSQL 15+                      |
| Platform           | Supabase (managed Postgres + Auth + Storage + Edge Functions) |
| Extensions         | `pgcrypto`, `uuid-ossp`, `pg_stat_statements` |
| Auth               | Supabase Auth (JWT) + Row-Level Security (RLS) |
| Migrations         | `supabase db push`                  |
| Client             | `supabase-js` (TypeScript)          |

## Getting Started

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Access to the Supabase project

### Apply Migrations

```bash
# Clone the repository
git clone <repo-url>
cd database

# Link to Supabase project
supabase link --project-ref <your-project-ref>

# Push all migrations
supabase db push

# Seed development data
psql -h aws-0-{region}.pooler.supabase.com -p 6543 -d postgres \
  -U postgres -f seeds/seed_data.sql
```

### Verify Installation

```sql
-- Check schema
\dt

-- Verify seed data
SELECT COUNT(*) AS companies FROM companies;
SELECT COUNT(*) AS branches FROM branches;
SELECT COUNT(*) AS products FROM products;
SELECT COUNT(*) AS employees FROM employees;
```

## Directory Structure

```
database/
├── README.md                     ← This file
├── seeds/
│   └── seed_data.sql             ← Development seed data (company, branches, products, employees)
├── edge-functions/
│   └── README.md                 ← Edge function architecture and conventions
├── backup/
│   └── backup_strategy.md        ← Daily/weekly/monthly backup plan
├── docs/
│   ├── erd_explanation.md        ← Entity relationship diagram walkthrough
│   ├── relationships.md          ← Full relationship matrix (cardinality, optionality)
│   ├── normalization.md          ← 3NF strategy and denormalization decisions
│   ├── naming_conventions.md     ← Tables, columns, indexes, functions naming
│   ├── migration_strategy.md     ← Migration workflow and conventions
│   ├── scaling_strategy.md       ← Partitioning, replicas, sharding, caching
│   └── performance_strategy.md   ← Indexes, query optimization, pagination, monitoring
└── supabase/
    └── migrations/               ← Sequential SQL migration files
        ├── 0001_create_initial_schema.sql
        ├── 0002_add_product_categories.sql
        └── ...
```

## Security Model

### Row-Level Security (RLS)

RLS policies enforce data access at the row level based on the authenticated user's JWT claims:

```sql
-- Example: Branch managers can only see their own branch data
CREATE POLICY branch_isolation ON sales
  FOR ALL
  USING (branch_id = (SELECT branch_id FROM employees WHERE user_id = auth.uid()));
```

### JWT Claims

The JWT token includes custom claims used by RLS policies:

```json
{
  "sub": "user-uuid",
  "role": "authenticated",
  "user_metadata": {
    "employee_id": "emp-uuid",
    "branch_id": "branch-uuid",
    "role_slug": "cashier"
  }
}
```

### Permission Model

1. **Roles** group logical sets of permissions (Owner, Branch Manager, Cashier, Support, Inventory Clerk)
2. **Permissions** are granular `resource:action` pairs (e.g., `sales.create`, `inventory.adjust`)
3. **Role-Permission** mappings are stored in the `role_permissions` junction table
4. **Employee-Role** mappings are stored in the `employee_roles` junction table

## Key Design Decisions

| Decision                     | Rationale                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| Single-tenant with company_id| Schema ready for future multi-company without migration                   |
| UUID primary keys            | Distributed-friendly, no sequential leak, safe for client-side generation |
| Soft delete on all entities  | Prevents accidental data loss; `is_active` + `deleted_at` pattern         |
| Inventory per branch         | Each branch is autonomous; no central warehouse concept                   |
| Immutable stock movements    | Append-only audit trail; never modify historical records                  |
| JSONB for addresses          | Always accessed as a unit; avoid join overhead for sub-fields             |
| NUMERIC(12,2) for money      | Exact decimal precision for financial calculations                        |
| Keyset pagination            | Avoids OFFSET performance degradation on large datasets                   |

## Table Reference

### Core Tables

| Table                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `companies`          | Root business entity (legal name, tax ID)      |
| `branches`           | Physical retail locations                      |
| `employees`          | Staff members linked to branches               |
| `roles`              | Role definitions (Owner, Cashier, etc.)        |
| `permissions`        | Granular resource:action permissions            |
| `employee_roles`     | M:N junction — employee to role assignments    |
| `role_permissions`   | M:N junction — role to permission mappings     |
| `users`              | Auth users (managed by Supabase Auth)          |

### Catalog Tables

| Table                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `categories`         | Hierarchical product categories (self-referencing) |
| `products`           | Sellable items with SKU, barcode, pricing      |
| `product_categories` | M:N junction — products to additional categories |
| `suppliers`          | Product vendors                                |

### Sales Tables

| Table                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `shifts`             | Work sessions (opening/closing cash)           |
| `sales`              | Sales transactions                             |
| `sale_items`         | Line items within a sale                       |
| `payments`           | Payment method breakdown per sale              |
| `customers`          | Customer profiles                             |

### Inventory Tables

| Table                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `inventory_items`    | Stock level per product per branch             |
| `stock_movements`    | Immutable audit trail of all stock changes     |

### Configuration Tables

| Table                | Description                                    |
| -------------------- | ---------------------------------------------- |
| `settings`           | Key-value company configuration                |

## Common Queries

### Get product with stock across all branches

```sql
SELECT p.sku, p.name, p.retail_price,
       ii.quantity, ii.reorder_point,
       b.code AS branch_code, b.name AS branch_name
FROM products p
JOIN inventory_items ii ON ii.product_id = p.id
JOIN branches b ON b.id = ii.branch_id
WHERE p.sku = 'MBA-M3-256-SLV' AND p.is_active = true;
```

### Daily sales summary by branch

```sql
SELECT b.code AS branch,
       COUNT(*) AS transactions,
       SUM(s.total_amount) AS revenue,
       SUM(s.tax_amount) AS tax,
       COUNT(DISTINCT s.customer_id) AS unique_customers
FROM sales s
JOIN branches b ON b.id = s.branch_id
WHERE s.created_at::date = CURRENT_DATE
  AND s.status = 'confirmed'
GROUP BY b.code
ORDER BY b.code;
```

### Low stock alerts

```sql
SELECT p.sku, p.name, ii.quantity, ii.reorder_point,
       b.name AS branch, b.code AS branch_code
FROM inventory_items ii
JOIN products p ON p.id = ii.product_id
JOIN branches b ON b.id = ii.branch_id
WHERE ii.quantity <= ii.reorder_point
  AND ii.is_active = true
ORDER BY ii.quantity ASC;
```

### Current open shift info

```sql
SELECT e.name AS employee, b.name AS branch,
       s.opened_at, s.opening_cash,
       COUNT(sl.id) AS sales_count,
       COALESCE(SUM(sl.total_amount), 0) AS total_sales
FROM shifts s
JOIN employees e ON e.id = s.employee_id
JOIN branches b ON b.id = s.branch_id
LEFT JOIN sales sl ON sl.shift_id = s.id AND sl.status = 'confirmed'
WHERE s.status = 'open'
GROUP BY e.name, b.name, s.opened_at, s.opening_cash;
```

## License

Proprietary — TOKYO Store for Electronics
