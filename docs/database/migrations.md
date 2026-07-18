# Database Migrations & Seeding

**File:** `docs/database/09-migrations.md`

---

# Purpose

يوضح هذا المستند آلية إدارة جميع تغييرات قاعدة البيانات (Database Migrations)، وكيفية إنشاء البيانات الأولية (Seed Data)، وآلية نشر التحديثات بين بيئات التطوير والاختبار والإنتاج.

يعتمد المشروع على:

- PostgreSQL
- Supabase CLI
- SQL Migration Files
- Version Control (Git)

---

# Objectives

- Version-Controlled Database
- Repeatable Deployments
- Safe Schema Changes
- Rollback Capability
- Consistent Development Environments
- Automated CI/CD Deployment

---

# Migration Workflow

```
Developer

↓

Create Migration

↓

Review

↓

Commit

↓

Git

↓

CI/CD

↓

Staging

↓

Production
```

---

# Migration Directory Structure

```
supabase/

├── migrations/
│
├── seed.sql
│
├── config.toml
│
└── functions/
```

---

# Migration Naming Convention

Every migration must begin with a timestamp.

Format

```
YYYYMMDDHHMMSS_description.sql
```

Examples

```
20260718090000_create_profiles.sql

20260718101500_create_products.sql

20260718113000_add_inventory.sql

20260718130000_create_orders.sql
```

---

# Migration Categories

Schema

```
Create Tables

Drop Tables

Alter Tables
```

Data

```
Insert Defaults

Update Existing Data
```

Security

```
RLS

Policies

Permissions
```

Indexes

```
Create Index

Drop Index
```

Functions

```
Stored Procedures

Triggers
```

---

# Recommended Migration Order

```
Extensions

↓

Enums

↓

Tables

↓

Relationships

↓

Indexes

↓

Functions

↓

Triggers

↓

Views

↓

RLS

↓

Policies

↓

Seed Data
```

---

# Initial Database Migration

Should Include

```
Extensions

Enums

Tables

Foreign Keys

Indexes

Functions

Triggers

Views

Policies
```

---

# Example Migration Sequence

```
001_extensions

002_roles

003_profiles

004_customers

005_categories

006_products

007_inventory

008_orders

009_payments

010_reviews

011_notifications

012_indexes

013_functions

014_triggers

015_rls

016_storage
```

---

# Migration Rules

Every Change

↓

New Migration

Never Edit

Old Migrations

---

# Allowed Operations

```
CREATE

ALTER

CREATE INDEX

CREATE POLICY

CREATE FUNCTION

CREATE TRIGGER
```

---

# Avoid

```
DROP TABLE

DROP COLUMN

DELETE DATA
```

Unless

Migration Plan Exists

---

# Rollback Strategy

Every Migration

Must Have

Rollback Plan

Example

```
Create Table

↓

Drop Table
```

```
Add Column

↓

Drop Column
```

```
Create Index

↓

Drop Index
```

---

# Data Migration

When Existing Data Exists

```
Create Column

↓

Populate Data

↓

Validate

↓

Apply Constraints
```

Never

Break Existing Records

---

# Seed Data

Purpose

Create Required Default Records

Examples

```
Roles

Permissions

Admin Account

Categories

Settings

Shipping Zones

Payment Methods
```

---

# Seed File Structure

```
supabase/

seed.sql
```

Or

```
supabase/

seeds/

roles.sql

permissions.sql

categories.sql

settings.sql
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

orders.read

orders.update

payments.verify

reports.view
```

---

# Default Categories

Examples

```
Disposable Cups

Plastic Containers

Food Packaging

Paper Bags

Cleaning Products
```

---

# Default Settings

```
Store Name

Currency

Timezone

Support Email

VAT Rate

Shipping Fee
```

---

# Default Payment Methods

```
Instapay

Vodafone Cash

Bank Transfer

Cash On Delivery (Optional)
```

---

# Admin User Creation

Development Only

```
owner@example.com
```

Production

Created

Manually

Never

Seed Production Credentials

---

# Environment Separation

Development

```
Local Database
```

Staging

```
Test Data
```

Production

```
Real Data
```

Never

Copy Production Data

Into Development

---

# Migration Validation Checklist

Before Merge

- Migration Executes Successfully
- Rollback Verified
- Foreign Keys Valid
- Indexes Created
- Policies Applied
- Seed Data Valid
- No Data Loss
- Performance Tested

---

# CI/CD Integration

Pipeline

```
Pull Request

↓

Migration Validation

↓

Automated Tests

↓

Deploy To Staging

↓

Manual Approval

↓

Production Deployment
```

---

# Conflict Resolution

If Multiple Developers

Create

Different Migrations

Never

Rename Existing Files

Always

Generate New Timestamp

---

# Database Versioning

Current Version

Stored

Using

```
supabase_migrations.schema_migrations
```

Tracks

- Applied Migrations
- Execution Order
- Migration History

---

# Migration Testing

Every Migration Must Be Tested Against

- Empty Database
- Existing Database
- Staging Environment

Verify

- Tables
- Constraints
- Indexes
- RLS Policies
- Triggers
- Functions
- Seed Data

---

# Backup Before Migration

Production Rule

```
Backup

↓

Migration

↓

Verification

↓

Release
```

Rollback

If Any Validation Fails

---

# Seed Data Rules

Seed Data Must Be

- Idempotent
- Repeatable
- Safe
- Environment Aware

Prefer

```sql
INSERT ... ON CONFLICT DO NOTHING
```

Over

```sql
INSERT
```

---

# Post-Migration Checklist

- Tables Created
- Foreign Keys Valid
- Indexes Built
- Views Available
- Functions Compiled
- Triggers Active
- RLS Enabled
- Storage Buckets Available
- Seed Data Loaded
- Smoke Tests Passed

---

# Best Practices

- One Logical Change Per Migration
- Never Modify Applied Migrations
- Keep Migrations Small and Focused
- Use Transactions Where Possible
- Test Rollbacks
- Version Everything in Git
- Separate Schema and Seed Data
- Keep Production Seeds Minimal
- Document Breaking Changes
- Automate Migration Execution

---

# Future Enhancements

- Zero-Downtime Migrations
- Online Schema Changes
- Automated Rollback Detection
- Migration Performance Metrics
- Data Masking for Staging
- Multi-Region Database Deployment
- Automated Seed Generation
- Migration Linting
- Drift Detection Between Environments
- Continuous Database Health Checks