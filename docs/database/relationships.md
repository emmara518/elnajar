# Database Relationships

**File:** `docs/database/05-relationships.md`

---

# Purpose

يوضح هذا المستند جميع العلاقات (Relationships) بين جداول قاعدة البيانات، وقواعد التكامل المرجعي (Referential Integrity)، وسياسات الحذف والتحديث، لضمان سلامة البيانات ومنع فقدانها.

---

# Relationship Types

The database uses three relationship types:

```
One To One (1:1)

One To Many (1:N)

Many To Many (N:N)
```

---

# High-Level Relationship Map

```
Roles
   │
   ▼
Profiles
   │
   ▼
Customers
   │
   ├──────────────┐
   ▼              ▼
Addresses       Orders
                  │
                  ▼
             Order Items
                  │
                  ▼
              Products
                  ▲
                  │
             Categories
```

---

# One-to-One Relationships

---

## Profile → Customer

```
profiles.id

↓

customers.profile_id
```

Cardinality

```
1 → 1
```

Description

Every customer has exactly one profile.

Foreign Key

```
customers.profile_id
```

Delete Rule

```
RESTRICT
```

Update Rule

```
CASCADE
```

---

## Product → Inventory

```
products.id

↓

inventory.product_id
```

One inventory record per product.

Delete

```
RESTRICT
```

---

## Order → Payment

```
orders.id

↓

payments.order_id
```

One payment per order.

Future

Supports split payments.

---

# One-to-Many Relationships

---

## Role → Profiles

```
roles

↓

profiles
```

One role

↓

Many users

---

## Category → Products

```
categories

↓

products
```

One category

↓

Many products

Delete Rule

```
RESTRICT
```

Reason

Prevent orphan products.

---

## Category → Child Categories

```
categories

↓

categories.parent_id
```

Self Reference

Supports

Unlimited nesting.

---

## Product → Images

```
products

↓

product_images
```

One product

↓

Many images

Delete

```
CASCADE
```

---

## Customer → Addresses

```
customers

↓

addresses
```

One customer

↓

Many addresses

Delete

```
CASCADE
```

---

## Customer → Orders

```
customers

↓

orders
```

One customer

↓

Many orders

Delete

```
RESTRICT
```

Reason

Historical records.

---

## Order → Order Items

```
orders

↓

order_items
```

Delete

```
CASCADE
```

Reason

Order items have no meaning without order.

---

## Product → Order Items

```
products

↓

order_items
```

Delete

```
RESTRICT
```

Reason

Sold products cannot disappear.

---

## Customer → Reviews

```
customers

↓

reviews
```

One customer

↓

Many reviews

---

## Product → Reviews

```
products

↓

reviews
```

One product

↓

Many reviews

---

## Customer → Notifications

```
customers

↓

notifications
```

---

## Customer → Cart

```
customers

↓

cart
```

One active cart per customer.

---

## Cart → Cart Items

```
cart

↓

cart_items
```

Delete

```
CASCADE
```

---

## Product → Inventory Transactions

```
products

↓

inventory_transactions
```

Tracks every stock movement.

---

# Many-to-Many Relationships

---

## Roles ↔ Permissions

Bridge Table

```
role_permissions
```

```
Roles

↓

Role Permissions

↓

Permissions
```

---

## Offers ↔ Products

Bridge Table

```
offer_products
```

One offer

↓

Many products

One product

↓

Many offers

---

## Customer ↔ Wishlist

Bridge Table

```
wishlist
```

```
Customer

↓

Wishlist

↓

Product
```

Constraint

```
(customer_id, product_id)

UNIQUE
```

---

## Cart ↔ Products

Bridge Table

```
cart_items
```

Unique

```
(cart_id, product_id)
```

---

# Referential Integrity Rules

Every Foreign Key

- Must reference an existing record
- Cannot be NULL unless explicitly allowed
- Must use UUID
- Must be indexed

---

# Delete Policies

| Parent | Child | Rule |
|---------|---------|-----------|
| Category | Products | RESTRICT |
| Product | Images | CASCADE |
| Product | Inventory | RESTRICT |
| Customer | Orders | RESTRICT |
| Customer | Addresses | CASCADE |
| Customer | Wishlist | CASCADE |
| Customer | Cart | CASCADE |
| Cart | Cart Items | CASCADE |
| Order | Order Items | CASCADE |
| Order | Payment | CASCADE |
| Payment | Receipt | CASCADE |
| Product | Reviews | RESTRICT |
| Role | Profiles | RESTRICT |
| Role | Role Permissions | CASCADE |

---

# Update Policies

Default

```
ON UPDATE CASCADE
```

Applied To

All Foreign Keys

Reason

Maintain Referential Integrity

---

# Soft Delete Strategy

Business Tables

Use

```
deleted_at
```

Instead Of

```
DELETE
```

Affected Tables

```
products

categories

customers

orders

offers

coupons
```

Benefits

- Audit
- Recovery
- Reporting

---

# Cascade Rules

Allowed Only For

Dependent Data

Examples

```
Product Images

Cart Items

Wishlist

Payment Receipts

Addresses

Role Permissions
```

---

# Restricted Deletes

Never Allow

Deleting

- Products with Orders
- Customers with Orders
- Categories containing Products
- Roles assigned to Users

---

# Data Ownership

Customer Owns

```
Addresses

Orders

Wishlist

Cart

Reviews

Notifications
```

Rule

```
customer_id = auth.uid()
```

Enforced By

RLS

---

# Business Rules

Products

Must belong to one category.

Orders

Must belong to one customer.

Order Items

Must belong to one order.

Inventory

Must belong to one product.

Receipts

Must belong to one payment.

---

# Composite Constraints

Wishlist

```
UNIQUE(customer_id, product_id)
```

Cart

```
UNIQUE(cart_id, product_id)
```

Role Permissions

```
UNIQUE(role_id, permission_id)
```

Offer Products

```
UNIQUE(offer_id, product_id)
```

---

# Circular Dependencies

Avoided

By

- Junction Tables
- UUID References
- Deferred Constraints Where Necessary

---

# Relationship Validation

Database

↓

Foreign Keys

↓

RLS

↓

Application Validation

↓

Business Rules

---

# Performance Considerations

All Foreign Keys Indexed

Junction Tables Indexed

Frequently Joined Columns Indexed

Minimal Deep Joins

Pagination On Large Relationships

---

# Future Relationships

Additional entities can be linked without redesign:

```
Warehouses

Branches

Suppliers

Purchase Orders

Returns

Refunds

Shipments

Delivery Companies

Loyalty Transactions

Gift Cards

Accounting

CRM
```

---

# Best Practices

- UUID Foreign Keys Everywhere
- Use Junction Tables for N:N Relationships
- Prefer RESTRICT for Critical Business Data
- Use CASCADE Only for Dependent Records
- Soft Delete Business Entities
- Enforce Integrity at Database Level
- Index Every Foreign Key
- Never Depend on Application Logic Alone
- Keep Relationships Normalized
- Design for Future Scalability