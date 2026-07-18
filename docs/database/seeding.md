# Database Seeding

**File:** `docs/database/10-seeding.md`

---

# Purpose

يوضح هذا المستند استراتيجية إنشاء البيانات الأولية (Seed Data) المطلوبة لتشغيل النظام لأول مرة، مع ضمان أن تكون عملية الـ Seeding آمنة، قابلة للتكرار (Idempotent)، ومتوافقة مع جميع البيئات.

---

# Objectives

- Fast Environment Setup
- Consistent Development Data
- Repeatable Execution
- Production Safety
- Automated Initialization

---

# Seeding Strategy

```
Extensions

↓

Roles

↓

Permissions

↓

Role Permissions

↓

Settings

↓

Categories

↓

Products (Optional)

↓

Inventory

↓

Demo Data (Development Only)
```

---

# Directory Structure

```
supabase/

├── seed.sql

└── seeds/

    001_roles.sql

    002_permissions.sql

    003_role_permissions.sql

    004_settings.sql

    005_categories.sql

    006_products.sql

    007_inventory.sql

    008_demo_users.sql

    009_demo_orders.sql
```

---

# Environment Rules

| Environment | Seed Data |
|-------------|-----------|
| Development | Full Demo Data |
| Staging | Test Data |
| Production | Essential Data Only |

---

# Production Seed

Allowed

```
Roles

Permissions

Settings

Categories

Payment Methods

Shipping Zones
```

Never Seed

```
Customers

Orders

Payments

Receipts

Audit Logs
```

---

# Default Roles

```
Owner

Admin

Customer
```

---

# Default Permissions

```
products.read

products.create

products.update

products.delete

categories.manage

orders.read

orders.update

payments.verify

inventory.manage

reports.view

settings.manage
```

---

# Role Mapping

| Role | Permissions |
|------|-------------|
| Owner | All |
| Admin | Operational Permissions |
| Customer | Customer Operations Only |

---

# Default Categories

Examples

```
Disposable Cups

Plastic Containers

Paper Bags

Food Packaging

Cleaning Supplies

Kitchen Accessories
```

---

# Default Store Settings

```
Store Name

Store Logo

Currency

Language

Timezone

VAT Rate

Shipping Fee

Support Email

Support Phone

Order Prefix
```

---

# Default Payment Methods

```
Instapay

Vodafone Cash

Bank Transfer
```

Status

```
Enabled
```

---

# Default Shipping Zones

```
Cairo

Giza

Alexandria

Delta

Upper Egypt
```

---

# Demo Products

Development Only

```
100+

Sample Products

Images

Descriptions

Inventory

Pricing
```

---

# Demo Inventory

Automatically Generated

Fields

```
Available Quantity

Reserved Quantity

Minimum Stock
```

---

# Demo Users

Development Only

```
Owner

Admin

Customer
```

Production

Created Manually

---

# Demo Orders

Development

Generate

```
Pending

Confirmed

Shipped

Delivered
```

Purpose

Testing Dashboard

Reports

Analytics

---

# Demo Reviews

Random

```
Ratings

Comments

Approved Reviews
```

---

# Demo Notifications

Generate

```
Order Updates

Welcome Messages

System Alerts
```

---

# Idempotency Rules

Every Seed Script Must Be Safe To Run Multiple Times.

Preferred Pattern

```sql
INSERT ...
ON CONFLICT DO NOTHING
```

Or

```sql
INSERT ...
ON CONFLICT (...) DO UPDATE
```

Never

```sql
DELETE
```

Before Insert

---

# Execution Order

```
001_roles

↓

002_permissions

↓

003_role_permissions

↓

004_settings

↓

005_categories

↓

006_products

↓

007_inventory

↓

008_demo_users

↓

009_demo_orders

↓

010_demo_reviews
```

---

# Data Integrity

Validate

- Foreign Keys
- Required Fields
- Unique Constraints
- ENUM Values
- RLS Compatibility

---

# Seed Validation Checklist

After Execution

- Roles Created
- Permissions Assigned
- Categories Available
- Settings Loaded
- Products Searchable
- Inventory Initialized
- Admin Login Works
- Dashboard Loads Successfully

---

# Performance Guidelines

- Batch Inserts
- Use Transactions
- Disable Demo Seeds in Production
- Minimize Duplicate Data
- Avoid Large Binary Assets

---

# Error Handling

On Failure

```
Rollback Transaction

↓

Log Error

↓

Stop Execution
```

Never Continue

With Partial Seed Data

---

# Version Control

Every Seed Script

- Stored In Git
- Code Reviewed
- Versioned
- Documented

---

# CI/CD Integration

```
Database Created

↓

Run Migrations

↓

Run Seed Scripts

↓

Execute Smoke Tests

↓

Deploy Application
```

---

# Maintenance Rules

When Adding A New Module

- Create Dedicated Seed File
- Preserve Execution Order
- Update Documentation
- Test Idempotency

---

# Best Practices

- Keep Seed Data Minimal in Production
- Use Realistic Demo Data for Development
- Never Store Production Credentials
- Make Every Script Idempotent
- Use Transactions
- Validate Data After Seeding
- Keep Seeds Independent
- Document Every Seed File
- Separate Demo Data from Required Data
- Run Smoke Tests After Seeding

---

# Future Enhancements

- Faker-Based Demo Data Generation
- Multi-Language Seed Content
- Industry-Specific Product Catalogs
- Automated Image Assignment
- Randomized Customer Activity
- Scenario-Based Test Data
- Performance Benchmark Datasets
- Seed Data Generator CLI
- Regional Store Templates
- AI-Assisted Demo Data Generation