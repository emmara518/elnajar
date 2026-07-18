# TOKYO Store — ERD Explanation

## Overview

The TOKYO Store database is designed around three core domains: **Operations** (branches, employees, shifts, sales), **Catalog** (products, categories, suppliers), and **Inventory** (stock levels, movements, transfers). The schema follows a single-tenant model where a company owns multiple branches.

---

## Core Entities

```
Company ──1:N──> Branch ──1:N──> Employee
                         1:N──> Inventory
                         1:N──> Sale
                         1:N──> Shift
```

- **Company**: Root entity representing the business. Holds legal information, contact details, and address.
- **Branch**: Physical retail locations. Each branch operates independently with its own inventory, employees, and sales.
- **Employee**: Staff members. Each employee belongs to exactly one branch and has one primary role.
- **User**: Linked to employees (1:1 optional) for authentication. Not all employees have user accounts (e.g., future hires).

### Employee ↔ Role (M:N)

```
Employee ──M:N──> Role
```

Implemented via the junction table **employee_roles**. An employee can have multiple roles (e.g., Cashier + Inventory Clerk) over time. A role can be assigned to many employees.

### Role ↔ Permission (M:N)

```
Role ──M:N──> Permission
```

Implemented via the junction table **role_permissions**. Permissions are granular (resource:action pairs). Roles group permissions into logical sets.

---

## Catalog

```
Category (self-referencing)
    ↑
    | N:1
Product ──N:1──> Supplier
```

- **Category**: Hierarchical tree via `parent_category_id`. A category can have many sub-categories. Products can belong to multiple categories.
- **Product**: Core sellable item. Has SKU (unique), barcode, pricing (retail > cost), tags, and images. Soft-deletable.
- **Supplier**: Vendor providing products. Has payment terms and lead time.

---

## Sales

```
Shift ──1:N──> Sale ──1:N──> SaleItem
                   1:N──> Payment
```

- **Shift**: A work session opened by an employee at a branch. Tracks opening/closing cash. All sales occur within a shift.
- **Sale**: A complete transaction. Belongs to one branch, one shift, one employee, and optionally one customer.
- **SaleItem**: Individual line items within a sale. References product, quantity, unit price, and applied discount.
- **Payment**: Payment method breakdown (cash, card, etc.). A sale can have multiple payments (split tender).

```
Sale ──N:1──> Customer
    ──N:1──> Employee
    ──N:1──> Branch
```

---

## Inventory

```
Product ──1:N──> InventoryItem (per branch)
                   1:N──> StockMovement
```

- **InventoryItem**: Stock level of a specific product at a specific branch. Includes min/max stock thresholds and reorder point.
- **StockMovement**: Immutable audit trail. Every stock change (receipt, sale, adjustment, transfer) creates a record with type, quantity delta, and reference ID.

---

## Entity Relationship Summary

| Entity           | Parent              | Cardinality | Notes                           |
| ---------------- | ------------------- | ----------- | ------------------------------- |
| Branch           | Company             | N:1         | Company must exist              |
| Employee         | Branch              | N:1         | Branch must exist               |
| Employee         | User                | 1:1         | Nullable until user created     |
| Role             | —                   | —           | Independent entity              |
| Permission       | —                   | —           | Independent entity              |
| Employee_Role    | Employee + Role     | M:N         | Junction table                  |
| Role_Permission  | Role + Permission   | M:N         | Junction table                  |
| Category         | Category (parent)   | N:1         | Self-referencing, nullable root |
| Product          | Supplier            | N:1         | Supplier optional               |
| Sale             | Branch, Shift, Emp  | N:1 each    | All required except customer    |
| SaleItem         | Sale + Product      | N:1 each    | Both required                   |
| Payment          | Sale                | N:1         | Required                        |
| InventoryItem    | Product + Branch    | N:1 each    | One row per product per branch  |
| StockMovement    | InventoryItem       | N:1         | Immutable                       |
| Setting          | Company             | N:1         | Key-value pairs                 |

---

## Key Design Decisions

1. **Single-Tenant**: The schema uses a `company_id` pattern even though this is single-tenant. This future-proofs for multi-company support.

2. **Soft Delete**: All operational entities (`companies`, `branches`, `employees`, `products`, `categories`, `suppliers`, `customers`) use `is_active` boolean + `deleted_at` timestamp for soft deletion.

3. **Inventory Per Branch**: Stock is tracked per product per branch. No central warehouse — each branch is autonomous.

4. **Immutable Audit Trail**: `stock_movements` is append-only. Existing records are never modified.

5. **JSONB for Flexible Data**: Addresses, tags, and images use JSONB to avoid over-normalization. These fields are always accessed as a unit.

6. **RLS + JWT**: Row-Level Security is enforced at the database level. All access flows through JWT-authenticated Supabase requests.
