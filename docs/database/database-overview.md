# Database Overview

**File:** `docs/database/01-database-overview.md`

---

# Purpose

يحدد هذا المستند البنية العامة لقاعدة البيانات المستخدمة في المشروع، ويشرح فلسفة التصميم، أنواع البيانات، العلاقات، وسياسات التوسع.

تم تصميم قاعدة البيانات لتكون:

- Highly Normalized
- Secure
- Scalable
- ACID Compliant
- Cloud Native
- Production Ready

---

# Database Engine

Database

PostgreSQL

Provider

Supabase

Version

PostgreSQL 16+

---

# Database Goals

- Data Integrity
- High Performance
- Scalability
- Security
- Maintainability
- Easy Backup
- Easy Migration

---

# Database Architecture

```
Frontend

↓

Supabase Client

↓

Edge Functions

↓

PostgreSQL

↓

Storage
```

---

# Database Type

Relational Database

ACID Compliant

Normalized

Cloud Managed

---

# Storage Components

Database

↓

Tables

↓

Indexes

↓

Views

↓

Functions

↓

Triggers

↓

Policies

↓

Storage Buckets

---

# Naming Convention

Tables

snake_case

Example

```
products

order_items

customer_addresses
```

---

Columns

snake_case

Example

```
created_at

updated_at

product_name

unit_price
```

---

Primary Keys

```
id
```

UUID

---

Foreign Keys

```
product_id

customer_id

category_id

order_id
```

---

Boolean Fields

Prefix

```
is_

has_

can_
```

Examples

```
is_active

is_deleted

has_discount
```

---

Timestamp Fields

```
created_at

updated_at

deleted_at
```

---

Audit Fields

Every Major Table Contains

```
created_by

updated_by

created_at

updated_at
```

---

# UUID Strategy

Every Main Entity Uses

UUID v4

Examples

```
products.id

orders.id

customers.id

employees.id
```

Advantages

- Globally Unique
- Secure
- Distributed Friendly
- Prevent ID Enumeration

---

# Time Zone

Database

UTC

Frontend

Local User Time

---

# Character Encoding

UTF-8

Supports

Arabic

English

Unicode

Emoji

---

# Database Schema

Main Schema

```
public
```

Future Schemas

```
auth

analytics

audit

storage

erp
```

---

# Core Business Domains

Authentication

Customers

Products

Categories

Inventory

Orders

Payments

Coupons

Offers

Reviews

Notifications

Employees

Reports

Settings

Analytics

---

# Main Tables

```
users

profiles

categories

products

product_images

inventory

customers

addresses

orders

order_items

payments

payment_receipts

reviews

wishlist

cart

coupons

offers

notifications

employees

roles

permissions

settings
```

---

# Data Categories

Master Data

- Products
- Categories
- Roles
- Permissions
- Settings

---

Transactional Data

- Orders
- Payments
- Inventory Movements
- Reviews

---

Reference Data

- Countries
- Cities
- Units
- Statuses

---

Audit Data

- Logs
- Login History
- Activity History

---

# Soft Delete Strategy

Supported

Field

```
deleted_at
```

Deleted Records

Not Removed Immediately

Advantages

- Recovery
- Audit
- Compliance

---

# Data Integrity

Enforced Using

Primary Keys

Foreign Keys

Unique Constraints

Check Constraints

NOT NULL

Triggers

RLS Policies

---

# Transaction Strategy

Used For

Checkout

Payment Verification

Inventory Updates

Order Creation

Employee Management

Backup Operations

---

# ACID Compliance

Atomicity

Guaranteed

Consistency

Guaranteed

Isolation

Guaranteed

Durability

Guaranteed

---

# Constraints

Primary Key

Foreign Key

Unique

Not Null

Check Constraint

Default Values

---

# Relationships

One To One

Example

```
user

↓

profile
```

---

One To Many

Example

```
category

↓

products
```

---

Many To Many

Example

```
products

↓

offers

(using junction tables)
```

---

# Index Strategy

Indexes Created On

Primary Keys

Foreign Keys

Search Columns

Filter Columns

Sorting Columns

Unique Fields

---

# Full Text Search

Supported

Products

Categories

Descriptions

SKU

Barcode

---

# Database Functions

Examples

Calculate Order Total

Generate Invoice Number

Generate Tracking Number

Inventory Update

Audit Logging

---

# Database Triggers

Automatic

Update Timestamp

Inventory Sync

Audit Log

Stock Validation

Order Status Update

---

# Views

Examples

```
sales_summary

inventory_summary

customer_statistics

top_products

dashboard_metrics
```

---

# Security

Authentication

Supabase Auth

Authorization

RLS

JWT Validation

Policies

Enabled

---

# Backup Strategy

Daily

Automatic

Weekly Snapshot

Monthly Archive

Encrypted

---

# Performance Strategy

Indexes

Connection Pooling

Query Optimization

Pagination

Lazy Loading

Caching

Materialized Views (Future)

---

# Storage Integration

Supabase Storage

Buckets

Products

Receipts

Avatars

Documents

Banners

---

# Migration Strategy

Version Controlled

Incremental

Reversible

Reviewed Before Production

---

# Monitoring

Database Size

Query Time

Connections

Locks

Slow Queries

Index Usage

Storage Usage

---

# Scaling Strategy

Read Replicas (Future)

Connection Pooling

Partitioning (Future)

Caching Layer (Future)

Archive Old Records

---

# Data Retention

Orders

Permanent

Products

Permanent

Audit Logs

5 Years

Notifications

180 Days

Temporary Files

30 Days

---

# Recovery Objectives

Recovery Time Objective (RTO)

< 4 Hours

Recovery Point Objective (RPO)

< 24 Hours

---

# Best Practices

- UUID Primary Keys
- UTC Timestamps
- Soft Deletes
- Strict Constraints
- Foreign Keys Everywhere
- Normalized Schema
- Row Level Security
- Automatic Audit Fields
- Indexed Search Fields
- Version Controlled Migrations

---

# Future Expansion

- Multi-Branch Inventory
- Multi-Warehouse Support
- Multi-Tenant Architecture
- ERP Integration
- Accounting Integration
- Shipping Providers
- Payment Gateway Integration
- Business Intelligence Warehouse
- Data Lake Integration
- Event Sourcing Support