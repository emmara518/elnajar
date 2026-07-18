# Database Tables Specification

**File:** `docs/database/04-tables.md`

---

# Purpose

يوضح هذا المستند جميع جداول قاعدة البيانات، والغرض من كل جدول، وأهم الأعمدة، والعلاقات، والفهارس المطلوبة.

يعتمد المشروع على قاعدة بيانات PostgreSQL مع Supabase ويستخدم UUID كمفتاح أساسي لجميع الكيانات.

---

# Table Categories

```
Authentication

Customer

Catalog

Shopping

Orders

Payments

Inventory

Marketing

Administration

System
```

---

# Authentication Tables

## profiles

Purpose

يحتوي على بيانات المستخدم الأساسية.

Columns

| Column | Type | Description |
|----------|---------|----------------|
| id | UUID PK | Profile ID |
| auth_user_id | UUID FK | auth.users.id |
| role_id | UUID FK | User Role |
| full_name | VARCHAR(150) | Full Name |
| email | VARCHAR(255) | Email |
| phone | VARCHAR(30) | Phone |
| avatar_url | TEXT | Avatar |
| is_active | BOOLEAN | Active Account |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

Relationships

- belongsTo Role
- hasOne Customer

---

## roles

Purpose

تعريف الأدوار داخل النظام.

Columns

```
id

name

description

created_at
```

Examples

```
Owner

Admin

Customer
```

---

## permissions

Purpose

صلاحيات النظام.

Examples

```
products.read

products.create

orders.update

reports.read
```

---

## role_permissions

Many-To-Many

Roles ↔ Permissions

---

# Customer Tables

## customers

Purpose

بيانات العميل التجارية.

Columns

| Column | Type |
|----------|---------|
| id | UUID |
| profile_id | UUID FK |
| loyalty_points | INTEGER |
| total_orders | INTEGER |
| total_spent | NUMERIC |
| created_at | TIMESTAMP |

---

## addresses

Purpose

عناوين العميل.

Columns

```
id

customer_id

city

governorate

street

building

floor

apartment

postal_code

is_default
```

Relationship

Customer → Many Addresses

---

# Catalog Tables

## categories

Purpose

تصنيفات المنتجات.

Columns

```
id

parent_id

name

slug

image_url

description

sort_order

is_active
```

Supports

Nested Categories

---

## products

Purpose

المنتجات.

Columns

| Column | Description |
|----------|----------------|
| id | UUID |
| category_id | FK |
| name | Product Name |
| slug | SEO Slug |
| sku | SKU |
| barcode | Barcode |
| short_description | Short Description |
| description | Full Description |
| price | Retail Price |
| wholesale_price | Wholesale |
| cost_price | Cost |
| stock_quantity | Current Stock |
| minimum_stock | Alert Limit |
| weight | Weight |
| unit | Unit |
| brand | Brand |
| featured | Featured |
| is_active | Active |
| created_at | Created |

---

## product_images

Purpose

صور المنتج.

Columns

```
id

product_id

image_url

sort_order

is_primary
```

---

## product_tags

Purpose

ربط المنتجات بالوسوم.

Relationship

Many To Many

---

# Inventory Tables

## inventory

Purpose

الرصيد الحالي.

Columns

```
product_id

available_quantity

reserved_quantity

damaged_quantity

updated_at
```

---

## inventory_transactions

Purpose

سجل جميع الحركات.

Movement Types

```
Purchase

Sale

Return

Adjustment

Damage

Transfer
```

Columns

```
id

inventory_id

movement_type

quantity

reference_type

reference_id

notes

created_at
```

---

# Shopping Tables

## cart

Purpose

سلة المشتريات.

Columns

```
id

customer_id

created_at
```

---

## cart_items

Purpose

منتجات السلة.

Columns

```
cart_id

product_id

quantity

price_snapshot
```

---

## wishlist

Purpose

المفضلة.

Columns

```
customer_id

product_id

created_at
```

---

# Order Tables

## orders

Purpose

الطلبات.

Columns

| Column | Description |
|----------|----------------|
| id | UUID |
| customer_id | Customer |
| address_id | Shipping Address |
| order_number | Human Number |
| subtotal | Before Discount |
| discount | Discount |
| shipping | Shipping |
| tax | Tax |
| total | Grand Total |
| payment_status | Payment Status |
| order_status | Order Status |
| notes | Notes |
| created_at | Created |

---

## order_items

Purpose

تفاصيل الطلب.

Columns

```
order_id

product_id

quantity

unit_price

discount

total
```

---

## order_status_history

Purpose

تتبع جميع مراحل الطلب.

Columns

```
order_id

old_status

new_status

changed_by

changed_at
```

---

# Payment Tables

## payments

Purpose

الدفع.

Columns

```
id

order_id

amount

payment_method

payment_status

transaction_reference

verified_by

verified_at
```

Payment Methods

```
Instapay

Vodafone Cash

Bank Transfer

Wallet
```

---

## payment_receipts

Purpose

إيصال التحويل.

Columns

```
payment_id

image_url

uploaded_at
```

---

# Marketing Tables

## coupons

Columns

```
code

type

value

minimum_order

maximum_discount

expires_at

usage_limit

used_count

active
```

---

## offers

Columns

```
title

description

discount_type

discount_value

start_date

end_date

is_active
```

---

## offer_products

Many-To-Many

Offers ↔ Products

---

# Reviews

## reviews

Columns

```
customer_id

product_id

rating

comment

approved

created_at
```

---

# Notification Tables

## notifications

Columns

```
profile_id

title

message

type

is_read

created_at
```

---

# Administration Tables

## employees

Purpose

إدارة الموظفين.

Columns

```
profile_id

job_title

branch

hire_date

active
```

---

## activity_logs

Purpose

تسجيل العمليات.

Columns

```
profile_id

action

entity

entity_id

ip_address

user_agent

created_at
```

---

# Settings

## settings

Columns

```
key

value

description

updated_at
```

---

# File Storage Mapping

| Bucket | Used By |
|----------|----------------|
| products | Product Images |
| avatars | User Avatars |
| receipts | Payment Receipts |
| banners | Homepage Banners |
| documents | Admin Files |

---

# Common Columns

Every Business Table Includes

```
id UUID

created_at

updated_at
```

Optional

```
deleted_at

created_by

updated_by
```

---

# Common Constraints

Every Table Uses

- UUID Primary Key
- Foreign Keys
- NOT NULL
- CHECK Constraints
- UNIQUE Constraints
- RLS Policies

---

# Common Indexes

Indexed Columns

```
id

slug

email

sku

barcode

customer_id

product_id

category_id

order_id

created_at
```

---

# Estimated Table Count

| Module | Tables |
|---------|--------|
| Authentication | 4 |
| Customer | 2 |
| Catalog | 4 |
| Inventory | 2 |
| Shopping | 3 |
| Orders | 3 |
| Payments | 2 |
| Marketing | 3 |
| Notifications | 1 |
| Administration | 2 |
| Settings | 1 |

**Total:** ~27 Business Tables

---

# Best Practices

- UUID Primary Keys
- Soft Deletes
- UTC Timestamps
- Strong Foreign Keys
- Normalized Data (3NF)
- Minimal Data Duplication
- Full Audit Support
- Row Level Security Enabled
- Feature-Oriented Table Design
- Production-Ready Naming Conventions