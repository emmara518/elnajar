# Authorization Architecture

**File:** `docs/architecture/07-authorization.md`

---

# Purpose

يوضح هذا المستند آلية التحكم في الصلاحيات (Authorization) داخل النظام، وكيف يتم تحديد ما يمكن لكل مستخدم الوصول إليه أو تنفيذه بعد نجاح عملية Authentication.

يعتمد النظام على **Role-Based Access Control (RBAC)** مع إمكانية التوسع مستقبلاً إلى **Permission-Based Access Control (PBAC)**.

---

# Authorization Model

Authorization Strategy

Role Based Access Control (RBAC)

Future Ready

Permission Based Access Control (PBAC)

---

# Authorization Flow

```
User Login

↓

Authentication Success

↓

Load User Profile

↓

Load User Role

↓

Load Permissions

↓

Route Guard

↓

Component Guard

↓

API Authorization

↓

Database RLS

↓

Response
```

---

# Security Layers

```
UI

↓

Route Protection

↓

Permission Guard

↓

API Validation

↓

Supabase RLS

↓

Database
```

---

# User Roles

Customer

Admin

Owner

---

# Future Roles

Warehouse Manager

Sales Manager

Delivery Agent

Support Agent

Marketing Manager

Finance Manager

---

# Role Hierarchy

```
Owner

↓

Admin

↓

Customer
```

Higher Roles Inherit Lower Permissions.

---

# Customer Permissions

Can

- Register Account
- Login
- Browse Products
- Search Products
- Add To Cart
- Checkout
- Upload Payment Receipt
- Track Orders
- View Own Orders
- Edit Own Profile
- Manage Addresses
- Wishlist
- Product Reviews

Cannot

- Access Admin Dashboard
- Manage Products
- View Other Customers
- Access Reports
- Modify Inventory

---

# Admin Permissions

Can

- Manage Products
- Manage Categories
- Manage Inventory
- Manage Orders
- Verify Payments
- Manage Customers
- Create Coupons
- Create Offers
- View Reports
- Manage Reviews

Cannot

- Manage Owners
- Delete Owner Account
- Change System Owner
- Modify Core Security Settings

---

# Owner Permissions

Full System Access

Can

- All Admin Features
- Manage Employees
- Manage Roles
- Backup & Restore
- Security Settings
- System Configuration
- Audit Logs
- Database Maintenance
- Assign Permissions

---

# Permission Categories

Authentication

Customer

Products

Categories

Orders

Inventory

Checkout

Reports

Employees

Settings

Security

Analytics

Backup

---

# Permission Naming Convention

```
products.read

products.create

products.update

products.delete

orders.read

orders.update

orders.cancel

customers.read

customers.update

reports.read

settings.update
```

---

# Route Protection

Public Routes

```
/

/products

/categories

/contact

/about
```

Guest Routes

```
/login

/register

/forgot-password
```

Protected Routes

```
/checkout

/account

/orders

/tracking
```

Admin Routes

```
/admin/*
```

Owner Routes

```
/admin/settings/security

/admin/employees

/admin/roles

/admin/backup
```

---

# Route Guard Flow

```
Request Route

↓

Authenticated?

↓

NO

↓

Redirect Login

↓

YES

↓

Role Check

↓

Allowed?

↓

YES

↓

Render

↓

NO

↓

403 Forbidden
```

---

# Component Level Authorization

Example

```
Delete Product Button

↓

Has Permission?

↓

YES

↓

Show Button

↓

NO

↓

Hide Component
```

---

# API Authorization

Every Protected Request Must Validate

- JWT
- User ID
- User Role
- Permissions

The server never trusts client-side authorization.

---

# Database Authorization

Supabase Row Level Security (RLS)

Enabled On

- Users
- Orders
- Customers
- Products
- Reviews
- Addresses
- Notifications

---

# Row Level Security Examples

Customer

Can Read

Own Orders Only

Cannot Read

Other Customers' Orders

---

Admin

Can

Read & Update All Orders

---

Owner

Full Database Access

---

# Resource Ownership

Customer Resources

```
Orders

Addresses

Wishlist

Reviews

Notifications
```

Ownership Rule

```
user_id == auth.uid()
```

---

# Permission Matrix

| Resource | Customer | Admin | Owner |
|-----------|----------|-------|-------|
| Products | Read | Full | Full |
| Categories | Read | Full | Full |
| Orders | Own Only | Full | Full |
| Customers | Own Only | Full | Full |
| Inventory | None | Full | Full |
| Reports | None | Read | Full |
| Employees | None | None | Full |
| Settings | None | Limited | Full |
| Backup | None | None | Full |

---

# UI Authorization

Restricted Components

- Delete Buttons
- Edit Forms
- Dashboard Widgets
- Reports
- Settings
- Employee Management

Unauthorized users never see restricted UI elements.

---

# Server Authorization

Every Request Validates

- Session
- JWT
- Role
- Permission
- Resource Ownership

---

# Forbidden Response

HTTP Status

```
403 Forbidden
```

Example

```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

---

# Authorization Middleware

Checks

- Authentication
- Role
- Permission
- Resource Ownership

---

# Sensitive Operations

Require Elevated Authorization

- Delete Product
- Delete Customer
- Restore Backup
- Manage Employees
- Change Roles
- Security Settings

---

# Audit Logging

Record

- Permission Denied
- Role Changes
- Employee Creation
- Product Deletion
- Order Cancellation
- Inventory Updates
- Settings Changes

---

# Authorization Events

Tracked

- Login
- Logout
- Role Assigned
- Permission Updated
- Access Denied
- Security Violation

---

# Best Practices

- Never Trust Client Permissions
- Validate Every Request Server Side
- Use Least Privilege Principle
- Hide Unauthorized UI
- Protect Routes
- Protect APIs
- Protect Database With RLS
- Log Sensitive Actions
- Use Consistent Permission Names
- Separate Authentication From Authorization

---

# Testing Requirements

Unit Tests

- Permission Guards
- Role Guards
- Ownership Validation

Integration Tests

- Route Authorization
- API Authorization
- RLS Policies

Security Tests

- Privilege Escalation
- Broken Access Control
- IDOR (Insecure Direct Object Reference)
- Horizontal Access
- Vertical Access

---

# Future Expansion

- Fine-Grained Permissions (PBAC)
- Department-Based Access
- Time-Based Permissions
- Temporary Permissions
- Approval Workflows
- Multi-Branch Authorization
- Multi-Tenant Authorization
- Attribute-Based Access Control (ABAC)
- Permission Management UI
- Delegated Administration