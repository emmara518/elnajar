# Database Indexes

**File:** `docs/database/06-indexes.md`

---

# Purpose

يوضح هذا المستند استراتيجية الفهارس (Indexes) المستخدمة داخل قاعدة البيانات لتحسين أداء الاستعلامات وتقليل زمن الاستجابة مع الحفاظ على كفاءة عمليات الكتابة.

---

# Objectives

- Fast Search
- Fast Filtering
- Fast Sorting
- Efficient Joins
- High Scalability
- Low Query Cost
- Optimized Dashboard Queries

---

# Index Types

The project uses the following PostgreSQL index types:

```
Primary Key Index

Unique Index

B-Tree Index

GIN Index

Composite Index

Partial Index

Expression Index
```

---

# Primary Key Indexes

Every Business Table

Automatically Indexed

Example

```
profiles.id

customers.id

products.id

orders.id

payments.id

categories.id
```

---

# Foreign Key Indexes

Every Foreign Key Must Be Indexed.

Examples

```
profiles.role_id

customers.profile_id

products.category_id

orders.customer_id

order_items.order_id

order_items.product_id

payments.order_id

inventory.product_id

reviews.product_id

reviews.customer_id

wishlist.customer_id

wishlist.product_id

cart.customer_id

cart_items.cart_id

cart_items.product_id
```

---

# Unique Indexes

Profiles

```
email
```

Products

```
sku

barcode

slug
```

Categories

```
slug
```

Coupons

```
code
```

Settings

```
key
```

Roles

```
name
```

Permissions

```
name
```

---

# Composite Unique Indexes

Wishlist

```
(customer_id, product_id)
```

Cart Items

```
(cart_id, product_id)
```

Role Permissions

```
(role_id, permission_id)
```

Offer Products

```
(offer_id, product_id)
```

---

# Product Indexes

Indexed Columns

```
name

slug

sku

barcode

category_id

brand

price

is_active

created_at
```

Composite

```
(category_id, is_active)

(category_id, price)

(featured, created_at)
```

---

# Category Indexes

```
parent_id

slug

sort_order

is_active
```

---

# Customer Indexes

```
profile_id

created_at
```

---

# Order Indexes

```
customer_id

order_status

payment_status

created_at

order_number
```

Composite

```
(customer_id, created_at)

(order_status, created_at)

(payment_status, created_at)
```

---

# Order Item Indexes

```
order_id

product_id
```

Composite

```
(order_id, product_id)
```

---

# Inventory Indexes

```
product_id

available_quantity

updated_at
```

Composite

```
(product_id, available_quantity)
```

---

# Payment Indexes

```
order_id

payment_status

payment_method

verified_at
```

---

# Review Indexes

```
product_id

customer_id

rating

created_at
```

Composite

```
(product_id, rating)
```

---

# Notification Indexes

```
profile_id

is_read

created_at
```

Composite

```
(profile_id, is_read)
```

---

# Audit Log Indexes

```
profile_id

action

created_at
```

Composite

```
(profile_id, created_at)
```

---

# Search Optimization

Full Text Search Enabled

Tables

```
products

categories
```

Indexed Fields

```
name

description

brand

sku
```

Index Type

```
GIN
```

Example

```sql
to_tsvector(
'english',
name || ' ' || description
)
```

Future

Arabic Full Text Search

---

# Slug Indexes

Unique

```
products.slug

categories.slug
```

Purpose

SEO

Fast Routing

---

# Date Indexes

Frequently Indexed

```
created_at

updated_at

deleted_at
```

Used By

- Reports
- Dashboard
- Filters
- Analytics

---

# Boolean Indexes

Only When Useful

Examples

```
is_active

featured

approved
```

Prefer

Partial Indexes

---

# Partial Indexes

Example

Products

```sql
WHERE is_active = true
```

Orders

```sql
WHERE deleted_at IS NULL
```

Notifications

```sql
WHERE is_read = false
```

Advantages

- Smaller
- Faster
- Lower Storage

---

# Expression Indexes

Example

Lowercase Email

```sql
LOWER(email)
```

Purpose

Case-insensitive search.

---

# Composite Index Strategy

Examples

Products

```
(category_id, price)

(category_id, brand)

(is_active, featured)
```

Orders

```
(customer_id, created_at)

(order_status, created_at)

(payment_status, created_at)
```

Reports

```
(created_at, payment_status)
```

---

# Dashboard Optimization

Indexes

```
created_at

order_status

payment_status

category_id
```

Supports

- Daily Sales
- Monthly Sales
- Order Count
- Revenue
- Best Sellers

---

# Pagination Optimization

Default Sort

```
created_at DESC
```

Indexes

```
created_at

id
```

Supports

Cursor Pagination

Future

---

# Join Optimization

Frequently Joined Columns

```
product_id

customer_id

category_id

order_id

payment_id

role_id
```

Always Indexed.

---

# Storage Considerations

Avoid

- Duplicate Indexes
- Unused Indexes
- Indexing Large TEXT Fields Without Need

Monitor

```
pg_stat_user_indexes
```

---

# Performance Monitoring

Track

- Slow Queries
- Sequential Scans
- Index Usage
- Missing Indexes
- Duplicate Indexes
- Query Plans

Tools

```
EXPLAIN ANALYZE

pg_stat_statements
```

---

# Index Naming Convention

Primary Key

```
pk_<table>
```

Foreign Key

```
fk_<table>_<column>
```

Unique

```
uq_<table>_<column>
```

Normal

```
idx_<table>_<column>
```

Composite

```
idx_<table>_<column1>_<column2>
```

GIN

```
gin_<table>_<column>
```

Partial

```
pidx_<table>_<column>
```

---

# Expected Query Performance

Primary Key Lookup

```
< 2 ms
```

Indexed Search

```
< 10 ms
```

Filtered Product Search

```
< 30 ms
```

Dashboard Queries

```
< 100 ms
```

Reports

```
< 500 ms
```

---

# Best Practices

- Index Every Foreign Key
- Use Composite Indexes Only For Real Queries
- Monitor Index Usage Regularly
- Prefer Partial Indexes For Boolean Columns
- Use GIN For Full Text Search
- Avoid Over-Indexing
- Review Execution Plans Before Adding Indexes
- Keep Statistics Updated
- Rebuild Fragmented Indexes When Necessary
- Optimize Indexes Based On Production Workloads

---

# Future Enhancements

- BRIN Indexes For Large Historical Tables
- Materialized View Indexes
- Trigram Search (pg_trgm)
- JSONB GIN Indexes
- Read Replica Specific Indexes
- Automated Index Recommendation
- Query Performance Dashboard
- AI-Assisted Index Optimization