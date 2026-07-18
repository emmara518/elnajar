# TOKYO Store — Naming Conventions

## Tables

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Plural**        | `plural_snake_case`                     | `inventory_items`            |
| **Single word**   | Lowercase plural                        | `products`, `sales`          |
| **Multi-word**    | Underscore-separated plural             | `stock_movements`            |
| **Junction**      | `table1_table2` (alphabetical order)    | `role_permissions`           |
| **Exception**     | `auth.users` (Supabase default)         | N/A                          |

## Columns

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Singular**      | `singular_snake_case`                   | `created_at`, `is_active`    |
| **No prefixes**   | Don't prefix with table name            | Use `name`, not `product_name` |
| **Boolean**       | Prefix with `is_`, `has_`, or `can_`    | `is_active`, `is_deleted`    |
| **Timestamp**     | Suffix with `_at`                       | `created_at`, `updated_at`   |
| **Date**          | Suffix with `_date`                     | `deleted_date`               |
| **Enum/Status**   | Use descriptive name                    | `status`, `movement_type`    |

## Primary Keys

| Rule              | Convention                              |
| ----------------- | --------------------------------------- |
| **Name**          | `id`                                    |
| **Type**          | `UUID` (generated via `gen_random_uuid()`) |
| **Default**       | `gen_random_uuid()`                     |

## Foreign Keys

| Rule                  | Convention                             | Example                      |
| --------------------- | -------------------------------------- | ---------------------------- |
| **Name**              | `referenced_table_singular_id`         | `product_id`, `branch_id`    |
| **Type**              | `UUID`                                 |                              |
| **Constraint name**   | `fk_table_referenced_table`            | `fk_sale_items_product`      |

## Junction Tables

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `table1_table2` (alphabetical)          | `role_permissions`           |
| **Columns**       | Two FKs named after each table          | `role_id`, `permission_id`   |

## Indexes

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `idx_table_column`                      | `idx_products_sku`           |
| **Multi-column**  | `idx_table_col1_col2`                   | `idx_inventory_product_branch` |
| **Unique index**  | `idx_table_column_unique`               | `idx_products_sku_unique`    |
| **Partial index** | `idx_table_column_where_condition`      | `idx_products_active`        |

## Functions

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `descriptive_snake_case`                | `adjust_inventory`           |
| **Prefix**        | No prefix                               | `record_sale`                |

## Triggers

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `trigger_action_description`            | `trigger_set_updated_at`     |
| **Function**      | Descriptive verb phrase                 | `set_updated_at`             |

## Views

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `descriptive_snake_case`                | `daily_sales`                |
| **Materialized**  | Same as view, different table type      | `inventory_summary`          |

## Enums

| Rule              | Convention                              | Example                      |
| ----------------- | --------------------------------------- | ---------------------------- |
| **Name**          | `descriptive_snake_case`                | `movement_type`              |
| **Values**        | `lowercase_snake_case`                  | `'transfer_out'`             |

## Columns Common to All Tables

| Column          | Type                    | Default                    |
| --------------- | ----------------------- | -------------------------- |
| `id`            | `uuid`                  | `gen_random_uuid()`        |
| `created_at`    | `timestamptz`           | `now()`                    |
| `updated_at`    | `timestamptz`           | `now()`                    |
| `is_active`     | `boolean`               | `true`                     |
| `deleted_at`    | `timestamptz`           | `NULL`                     |

## Examples

```sql
-- Table
CREATE TABLE inventory_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id),
  branch_id   uuid NOT NULL REFERENCES branches(id),
  quantity    numeric(12, 2) NOT NULL DEFAULT 0,
  min_stock   numeric(12, 2),
  max_stock   numeric(12, 2),
  reorder_point numeric(12, 2) DEFAULT 0,
  location_in_branch text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  is_active   boolean NOT NULL DEFAULT true,
  deleted_at  timestamptz,
  UNIQUE (product_id, branch_id)
);

-- Index
CREATE INDEX idx_inventory_items_product ON inventory_items(product_id);
CREATE INDEX idx_inventory_items_branch ON inventory_items(branch_id);
CREATE UNIQUE INDEX idx_inventory_items_product_branch ON inventory_items(product_id, branch_id);

-- Trigger
CREATE TRIGGER trigger_set_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
```
