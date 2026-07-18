# TOKYO Store — Normalization Strategy

## Standard: 3NF (Third Normal Form)

All tables in the TOKYO Store database are designed to satisfy **Third Normal Form (3NF)** unless explicitly documented otherwise.

### 1NF — Atomic Values

Every column contains atomic, indivisible values:
- No repeating groups or arrays in relational columns
- JSONB is used only for data that is always accessed as a unit (address, tags, images)
- Junction tables break down M:N relationships

### 2NF — Full Functional Dependency

All non-key columns depend on the **entire primary key**:
- `inventory_items`: depends on `(product_id, branch_id)` — stock level is specific to a product at a branch
- `sale_items`: depends on `(sale_id, line_number)` — each line is specific to a sale
- No partial dependencies exist

### 3NF — No Transitive Dependencies

No non-key column depends on another non-key column:
- `employee.branch_id` directly depends on employee, not through another column
- `product.category_id` directly depends on product
- `sale.shift_id` directly depends on sale

---

## Money Storage

| Convention        | Detail                           |
| ----------------- | -------------------------------- |
| **Type**          | `NUMERIC(12, 2)`                 |
| **Currency**      | `currency` column per table (TEXT) |
| **Rounding**      | 2 decimal places (smallest currency unit precision) |
| **Examples**      | `retail_price NUMERIC(12, 2)`, `total_amount NUMERIC(12, 2)` |

All monetary values are stored with a `currency` column (ISO 4217 code, e.g., `EGP`) to support future multi-currency operations.

---

## JSONB Usage — Deliberate Denormalization

| Column                   | Table              | Reason                                              |
| ------------------------ | ------------------ | --------------------------------------------------- |
| `address`                | companies, branches, suppliers, customers | Always accessed as a unit; never queried by sub-field alone |
| `tags`                   | products           | Variable-length array; avoids separate tags table with overhead |
| `images`                 | products           | Array of `{url, alt, isPrimary}`; always fetched together |
| `metadata`               | stock_movements    | Flexible payload for different movement types       |

**Trade-off accepted**: These JSONB columns are not further normalized because:
1. Addresses are always displayed or printed as a complete block
2. Tags and images are always queried alongside the parent product
3. The cost of JOINs (e.g., `LEFT JOIN product_images`) outweighs the benefit for these access patterns

---

## Audit Logs — Deliberate Denormalization

`stock_movements` and `audit_logs` are **append-only, immutable tables**:

- Each row is a complete, self-contained record
- No foreign keys to entities that might change (e.g., employee names are copied into the record)
- This ensures audit integrity even if the referenced entity is later soft-deleted
- This is denormalized by design — prioritizing immutability over 3NF purity

---

## Stock Movements — Fully Normalized

Unlike audit logs, `stock_movements` maintains a proper foreign key to `inventory_items`:

```
stock_movements
├── id (PK)
├── inventory_item_id (FK → inventory_items.id)
├── movement_type (ENUM: 'receipt', 'sale', 'adjustment', 'transfer_out', 'transfer_in')
├── quantity_delta (NUMERIC, positive for in, negative for out)
├── reference_type (TEXT — 'sale', 'purchase_order', 'adjustment', 'transfer')
├── reference_id (UUID — polymorphic reference to source document)
├── previous_quantity (NUMERIC — snapshot before movement)
├── new_quantity (NUMERIC — snapshot after movement)
├── metadata (JSONB — flexible extra data per type)
└── created_at (TIMESTAMPTZ — immutable)
```

This is fully normalized: each movement references exactly one inventory item, and all inventory attributes are derived via the FK.

---

## Junction Tables (M:N Relationships)

| Junction Table          | Left Entity    | Right Entity    | Surrogate PK? |
| ----------------------- | -------------- | --------------- | ------------- |
| `role_permissions`      | roles          | permissions     | No (composite)|
| `employee_roles`        | employees      | roles           | No (composite)|
| `product_categories`    | products       | categories      | No (composite)|

All junction tables use **composite primary keys** (no surrogate ID). This enforces uniqueness at the relationship level and avoids duplicate associations.

---

## Summary

| Normalization Decision        | Approach                                        |
| ----------------------------- | ----------------------------------------------- |
| Core business entities        | 3NF with proper FK constraints                  |
| Monetary values               | `NUMERIC(12, 2)` + currency column              |
| Addresses                     | JSONB (denormalized — accessed as unit)         |
| Tags, Images                  | JSONB (denormalized — always fetched together)  |
| Audit logs                    | Denormalized (self-contained for immutability)  |
| Stock movements               | Fully normalized (FK to inventory_item)         |
| M:N relationships             | Junction tables with composite PK                |
