# Entity Relationship Diagram (ERD)

**File:** `docs/database/02-er-diagram.md`

---

# Purpose

يوضح هذا المستند العلاقات الكاملة بين جميع جداول قاعدة البيانات.

تم تصميم قاعدة البيانات وفقًا لمبادئ:

- Third Normal Form (3NF)
- High Performance
- Referential Integrity
- Scalability
- Maintainability

---

# Database Domains

```
Authentication

↓

Users

↓

Customers

↓

Products

↓

Orders

↓

Payments

↓

Inventory

↓

Marketing

↓

Administration

↓

System
```

---

# Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram

profiles {
uuid id PK
string email
string full_name
string phone
uuid role_id FK
boolean is_active
timestamp created_at
timestamp updated_at
}

roles {
uuid id PK
string name
string description
}

permissions {
uuid id PK
string name
string module
}

role_permissions {
uuid role_id FK
uuid permission_id FK
}

categories {
uuid id PK
string name
string slug
uuid parent_id FK
boolean is_active
}

products {
uuid id PK
uuid category_id FK
string name
string slug
string sku
string barcode
decimal price
decimal wholesale_price
integer stock
boolean is_active
}

product_images {
uuid id PK
uuid product_id FK
string image_url
boolean is_primary
}

customers {
uuid id PK
uuid profile_id FK
integer loyalty_points
}

addresses {
uuid id PK
uuid customer_id FK
string city
string address
boolean is_default
}

cart {
uuid id PK
uuid customer_id FK
}

cart_items {
uuid id PK
uuid cart_id FK
uuid product_id FK
integer quantity
}

wishlist {
uuid id PK
uuid customer_id FK
uuid product_id FK
}

orders {
uuid id PK
uuid customer_id FK
decimal subtotal
decimal discount
decimal shipping
decimal total
string status
}

order_items {
uuid id PK
uuid order_id FK
uuid product_id FK
integer quantity
decimal price
}

payments {
uuid id PK
uuid order_id FK
decimal amount
string method
string status
}

payment_receipts {
uuid id PK
uuid payment_id FK
string image_url
}

inventory {
uuid id PK
uuid product_id FK
integer quantity
}

inventory_transactions {
uuid id PK
uuid inventory_id FK
integer quantity
string movement_type
}

coupons {
uuid id PK
string code
decimal discount
boolean active
}

offers {
uuid id PK
string title
decimal discount
timestamp start_date
timestamp end_date
}

offer_products {
uuid offer_id FK
uuid product_id FK
}

reviews {
uuid id PK
uuid customer_id FK
uuid product_id FK
integer rating
text comment
}

notifications {
uuid id PK
uuid profile_id FK
string title
boolean is_read
}

settings {
uuid id PK
string key
string value
}

audit_logs {
uuid id PK
uuid profile_id FK
string action
string resource
timestamp created_at
}

profiles ||--|| customers : owns

roles ||--o{ profiles : assigned_to

roles ||--o{ role_permissions : contains

permissions ||--o{ role_permissions : grants

categories ||--o{ categories : parent

categories ||--o{ products : contains

products ||--o{ product_images : has

products ||--|| inventory : stock

inventory ||--o{ inventory_transactions : movements

customers ||--o{ addresses : owns

customers ||--|| cart : has

cart ||--o{ cart_items : contains

products ||--o{ cart_items : added

customers ||--o{ wishlist : saves

products ||--o{ wishlist : wished

customers ||--o{ orders : places

orders ||--o{ order_items : contains

products ||--o{ order_items : ordered

orders ||--|| payments : payment

payments ||--o{ payment_receipts : receipt

customers ||--o{ reviews : writes

products ||--o{ reviews : receives

offers ||--o{ offer_products : includes

products ||--o{ offer_products : belongs

profiles ||--o{ notifications : receives

profiles ||--o{ audit_logs : performs
```

---

# Relationship Summary

## Authentication

```
Roles

↓

Profiles

↓

Customers
```

---

## Product Catalog

```
Categories

↓

Products

↓

Images

↓

Inventory

↓

Inventory Transactions
```

---

## Shopping

```
Customer

↓

Cart

↓

Cart Items

↓

Products
```

---

## Orders

```
Customer

↓

Orders

↓

Order Items

↓

Products
```

---

## Payments

```
Orders

↓

Payments

↓

Payment Receipts
```

---

## Marketing

```
Offers

↓

Offer Products

↓

Products
```

```
Coupons

↓

Orders
```

---

## Reviews

```
Customer

↓

Reviews

↓

Products
```

---

## Notifications

```
Profiles

↓

Notifications
```

---

## Administration

```
Profiles

↓

Audit Logs
```

---

# Cardinality

## One To One

```
Profile

↓

Customer
```

```
Cart

↓

Customer
```

```
Order

↓

Payment
```

```
Product

↓

Inventory
```

---

## One To Many

```
Category

↓

Products
```

```
Product

↓

Images
```

```
Order

↓

Order Items
```

```
Customer

↓

Orders
```

```
Customer

↓

Addresses
```

```
Inventory

↓

Transactions
```

---

## Many To Many

Roles

↔ Permissions

Using

```
role_permissions
```

---

Offers

↔ Products

Using

```
offer_products
```

---

Wishlist

Customer ↔ Product

---

Cart

Cart ↔ Product

---

# Referential Integrity

Every Foreign Key

- Uses UUID
- References Primary Key
- Indexed
- Enforced by PostgreSQL
- Protected by RLS

---

# Design Decisions

- UUID primary keys
- Junction tables for many-to-many relationships
- Soft delete support
- Hierarchical categories
- Separate inventory ledger
- Independent payment records
- Audit trail for sensitive actions
- Modular entities for future expansion

---

# Future Expansion

Additional entities can be added without redesigning the schema:

- Warehouses
- Branches
- Suppliers
- Purchase Orders
- Returns
- Refunds
- Shipments
- Delivery Companies
- Loyalty Transactions
- Gift Cards
- ERP Integration
- Accounting Module
- CRM Module
- Multi-Tenant Support