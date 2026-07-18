# Row Level Security (RLS) Policies

**File:** `docs/database/07-rls-policies.md`

---

# Purpose

يوضح هذا المستند استراتيجية تأمين قاعدة البيانات باستخدام **Supabase Row Level Security (RLS)**.

جميع عمليات القراءة والكتابة والتعديل والحذف يتم حمايتها من داخل PostgreSQL، وليس من التطبيق فقط.

الهدف هو ضمان أن:

- لا يمكن لأي مستخدم الوصول إلى بيانات غير مصرح بها.
- لا يمكن تجاوز الصلاحيات حتى لو تم تجاوز الواجهة الأمامية.
- تكون قاعدة البيانات هي مصدر الحقيقة الوحيد (Source of Truth).

---

# Security Model

```
Client

↓

JWT

↓

Supabase Auth

↓

RLS Policy

↓

Database

↓

Response
```

---

# Security Principles

- Authentication Required
- Least Privilege
- Deny By Default
- Server-Side Authorization
- Ownership Validation
- Role-Based Access

---

# RLS Status

Enabled

```
ALL BUSINESS TABLES
```

Disabled Only

```
Public Read Tables (Optional)
```

Examples

```
Public Categories

Public Products
```

---

# Authentication Context

Current User

```
auth.uid()
```

Current Role

```
auth.jwt()
```

Current Email

```
auth.email()
```

---

# Access Levels

Guest

↓

Customer

↓

Admin

↓

Owner

---

# Default Rule

No Policy

↓

No Access

---

# Public Access Tables

Readable Without Login

```
categories

products

offers

settings_public
```

Write Access

```
Denied
```

---

# Customer-Owned Tables

Protected By

```
customer_id = auth.uid()
```

Tables

```
orders

addresses

wishlist

cart

cart_items

reviews

notifications
```

---

# Example Policy

Orders

SELECT

```sql
customer_id = auth.uid()
```

Meaning

Customer can only read own orders.

---

# Profiles Policies

SELECT

User can read own profile.

```sql
id = auth.uid()
```

---

UPDATE

User can update own profile.

```sql
id = auth.uid()
```

---

DELETE

Not Allowed

Only Owner

---

# Customers Policies

SELECT

Own Record Only

---

UPDATE

Own Record Only

---

INSERT

Allowed During Registration

---

DELETE

Owner Only

---

# Addresses Policies

SELECT

Own Addresses

---

INSERT

Own Addresses

---

UPDATE

Own Addresses

---

DELETE

Own Addresses

---

# Wishlist Policies

SELECT

Own Wishlist

---

INSERT

Own Wishlist

---

DELETE

Own Wishlist

---

# Cart Policies

SELECT

Own Cart

---

INSERT

Own Cart

---

UPDATE

Own Cart

---

DELETE

Own Cart

---

# Orders Policies

Customer

Can

```
SELECT

INSERT
```

Cannot

```
UPDATE

DELETE
```

Reason

Orders are immutable after creation.

---

Admin

Can

```
SELECT

UPDATE
```

---

Owner

Full Access

---

# Order Items

Customer

Read Own

---

Admin

Read All

---

Insert

Only During Checkout

---

Delete

Never Directly

---

# Products Policies

Guests

```
SELECT
```

Everyone

Read Active Products Only

---

Admin

```
INSERT

UPDATE

DELETE
```

---

Owner

Full Access

---

# Categories Policies

Guests

```
SELECT
```

Admin

Manage Categories

Owner

Full Access

---

# Inventory Policies

Guests

No Access

---

Customers

No Access

---

Admin

Read

Update

---

Owner

Full Access

---

# Reviews Policies

Guest

Read

Approved Reviews Only

---

Customer

Create

Own Reviews

---

Customer

Update

Own Review

Before Approval

---

Admin

Approve

Delete

---

# Coupons Policies

Customer

Read Valid Coupons

---

Admin

Manage

---

Owner

Manage

---

# Offers Policies

Guests

Read Active Offers

---

Admin

Manage

---

Owner

Manage

---

# Payments Policies

Customer

Read Own Payment

---

Admin

Verify

Update

---

Owner

Full Access

---

# Payment Receipts

Customer

Upload Own Receipt

---

Customer

Read Own Receipt

---

Admin

Read All

---

Delete

Owner Only

---

# Notifications

Customer

Read Own

---

Update

Own Read Status

---

Admin

Create Notifications

---

# Employees

Customer

Denied

---

Admin

Read

---

Owner

CRUD

---

# Roles

Only Owner

Can Read

Create

Update

Delete

---

# Permissions

Owner Only

---

# Settings

Guests

Read Public Settings

---

Admin

Limited Update

---

Owner

Full Update

---

# Audit Logs

Customer

Denied

---

Admin

Read

---

Owner

Read

Export

---

Insert

System Only

---

# Storage Policies

Products Bucket

Guests

Read

---

Admins

Upload

Update

Delete

---

Receipts Bucket

Customer

Upload Own

Read Own

---

Admin

Read All

---

Avatars

User

Read All

Update Own

---

Documents

Owner Only

---

# Service Role

Supabase Service Role

Bypasses RLS

Allowed Only

Edge Functions

Never

Frontend

---

# Policy Naming Convention

```
policy_select_products

policy_insert_orders

policy_update_profile

policy_delete_review
```

---

# Role Matrix

| Table | Guest | Customer | Admin | Owner |
|---------|---------|----------|---------|---------|
| Products | Read | Read | CRUD | CRUD |
| Categories | Read | Read | CRUD | CRUD |
| Orders | None | Own | All | All |
| Order Items | None | Own | All | All |
| Customers | None | Own | All | All |
| Addresses | None | Own | None | All |
| Wishlist | None | Own | None | All |
| Cart | None | Own | None | All |
| Reviews | Read | CRUD Own | Moderate | Full |
| Inventory | None | None | Read/Update | Full |
| Payments | None | Own | Verify | Full |
| Notifications | None | Own | Create | Full |
| Employees | None | None | Read | CRUD |
| Roles | None | None | Read | CRUD |
| Audit Logs | None | None | Read | Full |

---

# Policy Testing

Verify

- Guest Access
- Customer Isolation
- Admin Access
- Owner Access
- Cross-Account Access
- Anonymous Requests
- Invalid JWT
- Expired JWT

---

# Security Validation

Every Request

↓

JWT Validation

↓

Role Validation

↓

Ownership Validation

↓

RLS Policy

↓

Database Operation

---

# Performance Considerations

- Keep Policies Simple
- Use Indexed Foreign Keys
- Avoid Complex Subqueries
- Test With EXPLAIN ANALYZE
- Cache JWT Claims Where Appropriate

---

# Best Practices

- Enable RLS On Every Business Table
- Deny Access By Default
- Validate Ownership With `auth.uid()`
- Never Trust Frontend Authorization
- Keep Policies Small And Focused
- Use Roles For Administrative Access
- Test Every Policy Before Production
- Review Policies During Every Release
- Log Security Violations
- Minimize Service Role Usage

---

# Future Enhancements

- Branch-Level Policies
- Multi-Tenant Isolation
- Department-Based Permissions
- Time-Based Access
- Temporary Privileges
- IP-Based Restrictions
- Device Trust Policies
- Attribute-Based Access Control (ABAC)
- Dynamic Policy Generation
- Security Policy Dashboard