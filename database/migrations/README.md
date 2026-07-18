# Migration Guide

## Apply Order

The schema files in `../schema/` MUST be applied in numbered order:

1. `schema/types/custom_types.sql` — Custom ENUM types
2. `schema/0001_core.sql` — Companies, branches, users, customers, employees, roles, permissions, settings
3. `schema/0002_catalog.sql` — Categories, suppliers, products, product_categories
4. `schema/0003_inventory.sql` — Inventory items, stock movements
5. `schema/0004_sales.sql` — Shifts, sales, sale_items, payments
6. `schema/0005_purchasing.sql` — Purchases, purchase_items
7. `schema/0006_financial.sql` — Expenses
8. `schema/0007_auxiliary.sql` — Audit logs, attachments, notifications
9. `schema/storage/storage_buckets.sql` — Supabase Storage buckets

Then apply supporting objects (order independent):
- `functions/*.sql` — Business logic functions
- `triggers/*.sql` — Database triggers
- `indexes/performance_indexes.sql` — Performance indexes
- `views/*.sql` — Reporting views
- `policies/rls_policies.sql` — Row Level Security

Finally, seeds:
- `seeds/seed_data.sql` — Development seed data

## Supabase CLI

```bash
# Apply a single migration
supabase db execute --file schema/0001_core.sql

# Apply all functions
for f in functions/*.sql; do supabase db execute --file "$f"; done

# Apply seed data
supabase db execute --file seeds/seed_data.sql
```

## Production Checklist

- Run custom_types.sql before ALL other migrations
- Create sequence `sale_order_seq` before using `record_sale` function
- Set up JWT claims (`app.current_app_role`, `app.current_branch_id`, `app.current_employee_id`) at login
- Verify RLS policies after applying
- Run seed data only in development/staging
