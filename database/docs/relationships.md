# TOKYO Store — Database Relationships

## Conventions

- `PK` = Primary Key
- `FK` = Foreign Key
- `UQ` = Unique Constraint
- `NN` = Not Null
- `*` = Required (NN)
- `o` = Optional (nullable)

---

## 1. Company → Branches

```
companies (1) ──< (N) branches
```

| Column              | Type                    | Constraints                    |
| ------------------- | ----------------------- | ------------------------------ |
| `company_id` (FK)   | `uuid`                  | `NOT NULL`, `REFERENCES companies(id)` |

**Cardinality**: One company has many branches. A branch belongs to exactly one company.
**Business Rule**: A company cannot be deleted if it has active branches.

---

## 2. Branch → Employees

```
branches (1) ──< (N) employees
```

| Column              | Type                    | Constraints                    |
| ------------------- | ----------------------- | ------------------------------ |
| `branch_id` (FK)    | `uuid`                  | `NOT NULL`, `REFERENCES branches(id)` |

**Cardinality**: A branch has zero or many employees. An employee belongs to exactly one branch.

---

## 3. Employee → User

```
employees (1) ──> (1) users
```

| Column              | Type                    | Constraints                    |
| ------------------- | ----------------------- | ------------------------------ |
| `user_id` (FK)      | `uuid`                  | `NULL`, `UNIQUE`, `REFERENCES auth.users(id)` |

**Cardinality**: An employee optionally links to one user. A user links to at most one employee.
**Business Rule**: An employee can exist without a user account (for future hires or non-login staff).

---

## 4. Employee ↔ Role (M:N via employee_roles)

```
employees (M) ──< employee_roles >── (N) roles
```

| Column                | Type                    | Constraints                         |
| --------------------- | ----------------------- | ----------------------------------- |
| `employee_id` (FK)    | `uuid`                  | `NOT NULL`, `REFERENCES employees(id)` |
| `role_id` (FK)        | `uuid`                  | `NOT NULL`, `REFERENCES roles(id)`     |
| Composite PK          | `(employee_id, role_id)`| `PRIMARY KEY`                      |

**Cardinality**: An employee can have multiple roles (M). A role can be held by multiple employees (N).

---

## 5. Role ↔ Permission (M:N via role_permissions)

```
roles (M) ──< role_permissions >── (N) permissions
```

| Column                  | Type                    | Constraints                           |
| ----------------------- | ----------------------- | ------------------------------------- |
| `role_id` (FK)          | `uuid`                  | `NOT NULL`, `REFERENCES roles(id)`    |
| `permission_id` (FK)    | `uuid`                  | `NOT NULL`, `REFERENCES permissions(id)` |
| Composite PK            | `(role_id, permission_id)` | `PRIMARY KEY`                      |

**Cardinality**: A role can have many permissions (M). A permission can belong to many roles (N).

---

## 6. Category (Self-Referencing)

```
category (1) ──< (N) categories
```

| Column                     | Type                    | Constraints                             |
| -------------------------- | ----------------------- | --------------------------------------- |
| `parent_category_id` (FK)  | `uuid`                  | `NULL`, `REFERENCES categories(id)`     |

**Cardinality**: A category can have zero or many child categories. A sub-category has exactly one parent.
**Business Rule**: A category cannot be its own ancestor (enforced via application logic, not DB constraint).

---

## 7. Product → Category

```
products (N) ──> (1) categories
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `category_id` (FK)  | `uuid`                  | `NOT NULL`, `REFERENCES categories(id)` |

**Cardinality**: A product belongs to exactly one primary category. A category contains many products.

Additionally via `product_categories` junction:

```
products (M) ──< product_categories >── (N) categories
```

**Cardinality**: A product can belong to multiple categories (M). A category contains many products (N).

---

## 8. Product → Supplier

```
products (N) ──> (1) suppliers
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `supplier_id` (FK)  | `uuid`                  | `NULL`, `REFERENCES suppliers(id)`  |

**Cardinality**: A product optionally has one supplier. A supplier provides zero or many products.

---

## 9. Shift → Sale

```
shifts (1) ──< (N) sales
```

| Column              | Type                    | Constraints                     |
| ------------------- | ----------------------- | ------------------------------- |
| `shift_id` (FK)     | `uuid`                  | `NOT NULL`, `REFERENCES shifts(id)` |

**Cardinality**: A shift has zero or many sales. A sale belongs to exactly one shift.
**Business Rule**: Sales can only be created within an open shift.

---

## 10. Sale → SaleItem

```
sales (1) ──< (N) sale_items
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `sale_id` (FK)      | `uuid`                  | `NOT NULL`, `REFERENCES sales(id)`  |

**Cardinality**: A sale has one or many items. A sale item belongs to exactly one sale.
**Business Rule**: A sale must have at least one item.

---

## 11. SaleItem → Product

```
sale_items (N) ──> (1) products
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `product_id` (FK)   | `uuid`                  | `NOT NULL`, `REFERENCES products(id)` |

**Cardinality**: A sale item references exactly one product. A product appears in zero or many sale items.

---

## 12. Sale → Payment

```
sales (1) ──< (N) payments
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `sale_id` (FK)      | `uuid`                  | `NOT NULL`, `REFERENCES sales(id)`  |

**Cardinality**: A sale has one or many payments (one per payment method). A payment belongs to exactly one sale.
**Business Rule**: Sum of all payment amounts must equal the sale total.

---

## 13. Sale → Customer

```
sales (N) ──> (1) customers
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `customer_id` (FK)  | `uuid`                  | `NULL`, `REFERENCES customers(id)`  |

**Cardinality**: A sale optionally references one customer. A customer can have many sales.

---

## 14. InventoryItem → Product + Branch

```
inventory_items (N) ──> (1) products
inventory_items (N) ──> (1) branches
```

| Column              | Type                    | Constraints                             |
| ------------------- | ----------------------- | --------------------------------------- |
| `product_id` (FK)   | `uuid`                  | `NOT NULL`, `REFERENCES products(id)`   |
| `branch_id` (FK)    | `uuid`                  | `NOT NULL`, `REFERENCES branches(id)`   |
| UQ                  | `(product_id, branch_id)`| `UNIQUE`                               |

**Cardinality**: A product has exactly one inventory record per branch. A branch has many inventory records.
**Business Rule**: Only one inventory row per product per branch.

---

## 15. StockMovement → InventoryItem

```
stock_movements (N) ──> (1) inventory_items
```

| Column                     | Type                              | Constraints                           |
| -------------------------- | --------------------------------- | ------------------------------------- |
| `inventory_item_id` (FK)   | `uuid`                            | `NOT NULL`, `REFERENCES inventory_items(id)` |

**Cardinality**: A stock movement references exactly one inventory record. An inventory record has zero or many stock movements.
**Business Rule**: Stock movements are immutable — never updated or deleted.

---

## 16. Settings → Company

```
settings (N) ──> (1) companies
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `company_id` (FK)   | `uuid`                  | `NOT NULL`, `REFERENCES companies(id)` |

**Cardinality**: A company has many settings (key-value pairs). Each setting belongs to exactly one company.

---

## 17. Sale → Employee

```
sales (N) ──> (1) employees
```

| Column              | Type                    | Constraints                         |
| ------------------- | ----------------------- | ----------------------------------- |
| `employee_id` (FK)  | `uuid`                  | `NOT NULL`, `REFERENCES employees(id)` |

**Cardinality**: A sale is created by exactly one employee. An employee creates zero or many sales.

---

## Relationship Summary Table

| #  | Parent              | Child               | Type    | FK Column             | Required |
| -- | ------------------- | ------------------- | ------- | --------------------- | -------- |
| 1  | companies           | branches            | 1:N     | `company_id`          | Yes      |
| 2  | branches            | employees           | 1:N     | `branch_id`           | Yes      |
| 3  | employees           | users               | 1:1     | `user_id`             | No       |
| 4  | employees           | employee_roles      | M:N     | `employee_id`         | Yes      |
| 5  | roles               | employee_roles      | M:N     | `role_id`             | Yes      |
| 6  | roles               | role_permissions    | M:N     | `role_id`             | Yes      |
| 7  | permissions         | role_permissions    | M:N     | `permission_id`       | Yes      |
| 8  | categories (self)   | categories          | 1:N     | `parent_category_id`  | No       |
| 9  | categories          | products            | 1:N     | `category_id`         | Yes      |
| 10 | suppliers           | products            | 1:N     | `supplier_id`         | No       |
| 11 | shifts              | sales               | 1:N     | `shift_id`            | Yes      |
| 12 | sales               | sale_items          | 1:N     | `sale_id`             | Yes      |
| 13 | products            | sale_items          | 1:N     | `product_id`          | Yes      |
| 14 | sales               | payments            | 1:N     | `sale_id`             | Yes      |
| 15 | customers           | sales               | 1:N     | `customer_id`         | No       |
| 16 | employees           | sales               | 1:N     | `employee_id`         | Yes      |
| 17 | branches            | sales               | 1:N     | `branch_id`           | Yes      |
| 18 | products + branches | inventory_items     | 1:N     | `product_id,branch_id`| Yes      |
| 19 | inventory_items     | stock_movements     | 1:N     | `inventory_item_id`   | Yes      |
| 20 | companies           | settings            | 1:N     | `company_id`          | Yes      |
