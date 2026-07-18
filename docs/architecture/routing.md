# Routing Architecture

**File:** `docs/architecture/03-routing.md`

---

# Purpose

يحدد هذا المستند الهيكل الرسمي لنظام التنقل (Routing Architecture) داخل التطبيق.

الأهداف:

- تنظيم جميع Routes
- حماية الصفحات
- تحسين الأداء
- دعم Lazy Loading
- دعم Role Based Access
- تحسين SEO
- سهولة التوسع مستقبلاً

---

# Router

React Router v7

Type

Browser Router

Routing Style

Nested Routing

Lazy Loading

Enabled

Protected Routes

Enabled

Role Based Routes

Enabled

404 Handling

Enabled

---

# High Level Routing

```
/

├── Home

├── Categories

├── Products

├── Product Details

├── Offers

├── Cart

├── Checkout

├── Order Tracking

├── Authentication

├── Customer Account

└── Admin Dashboard
```

---

# Route Groups

Public Routes

↓

Guest Routes

↓

Protected Routes

↓

Admin Routes

↓

Fallback Routes

---

# Public Routes

Accessible Without Login

```
/

/categories

/products

/products/:slug

/offers

/about

/contact

/search

/privacy

/terms

/faq
```

---

# Guest Routes

Accessible Only When Logged Out

```
/login

/register

/forgot-password

/reset-password

/verify-email
```

---

# Protected Routes

Authentication Required

```
/account

/account/profile

/account/orders

/account/orders/:id

/account/wishlist

/account/addresses

/account/notifications

/cart

/checkout

/order-success

/tracking/:trackingNumber
```

---

# Admin Routes

Role Required

Admin

Owner

```
/admin

/admin/dashboard

/admin/orders

/admin/products

/admin/categories

/admin/customers

/admin/inventory

/admin/suppliers

/admin/coupons

/admin/offers

/admin/reports

/admin/settings

/admin/employees

/admin/roles

/admin/backup

/admin/logs
```

---

# Route Tree

```
/

├── index

├── categories

│      └── :slug

│

├── products

│      └── :slug

│

├── offers

│

├── cart

│

├── checkout

│

├── tracking

│      └── :trackingNumber

│

├── login

├── register

├── forgot-password

├── reset-password

│

├── account

│      ├── profile

│      ├── orders

│      ├── wishlist

│      ├── addresses

│      ├── notifications

│      └── settings

│

└── admin

       ├── dashboard

       ├── products

       ├── categories

       ├── inventory

       ├── orders

       ├── customers

       ├── reports

       ├── employees

       ├── settings

       └── backup
```

---

# Layout Mapping

Public Layout

Used By

```
/

/products

/categories

/offers
```

Uses

MainLayout

---

Auth Layout

```
/login

/register

/forgot-password

/reset-password
```

Uses

AuthLayout

---

Customer Layout

```
/account/*
```

Uses

AccountLayout

---

Checkout Layout

```
/checkout
```

Uses

CheckoutLayout

---

Admin Layout

```
/admin/*
```

Uses

AdminLayout

---

# Lazy Loading

Every Page Must Be Lazy Loaded

Example

```
Home

Products

Product Details

Checkout

Dashboard

Reports

Customers
```

Exclude

```
App

Providers

Router

Error Boundary
```

---

# Protected Route Flow

```
User

↓

Route Request

↓

Authenticated?

↓

YES

↓

Role Validation

↓

Authorized?

↓

YES

↓

Render Page

↓

NO

↓

403

↓

NO LOGIN

↓

Redirect Login
```

---

# Authorization Matrix

| Route | Guest | Customer | Admin | Owner |
|--------|--------|----------|--------|--------|
| Home | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ |
| Cart | ✅ | ✅ | ✅ | ✅ |
| Checkout | ❌ | ✅ | ✅ | ✅ |
| Account | ❌ | ✅ | ✅ | ✅ |
| Admin | ❌ | ❌ | ✅ | ✅ |
| Reports | ❌ | ❌ | ✅ | ✅ |
| Employees | ❌ | ❌ | ❌ | ✅ |

---

# Dynamic Routes

```
/products/:slug

/categories/:slug

/orders/:id

/tracking/:trackingNumber

/customers/:id

/admin/products/:id/edit

/admin/orders/:id
```

---

# Route Parameters

Product

```
slug
```

Category

```
slug
```

Order

```
id
```

Tracking

```
trackingNumber
```

Customer

```
id
```

---

# Query Parameters

Search

```
?q=plate
```

Pagination

```
?page=2
```

Sorting

```
?sort=price-asc
```

Filtering

```
?category=paper

?brand=abc

?price=100-500

?rating=5
```

---

# Breadcrumb Strategy

Automatically Generated

Example

```
Home

↓

Categories

↓

Paper Cups
```

Supports

Dynamic Slugs

---

# Scroll Behavior

New Page

↓

Scroll Top

Back Navigation

↓

Restore Previous Position

Product Details

↓

Restore Scroll After Back

---

# Error Routes

401

Unauthorized

403

Forbidden

404

Not Found

500

Internal Server Error

503

Maintenance

---

# Redirect Rules

Guest Opens Checkout

↓

Redirect Login

↓

Return Checkout

---

Authenticated User Opens Login

↓

Redirect Account

---

Customer Opens Admin

↓

403

---

Unknown Route

↓

404

---

# Loading Strategy

Each Lazy Route

↓

Skeleton Screen

↓

Page Render

↓

Hydration

---

# Prefetch Strategy

Hover Product

↓

Prefetch Product Details

Hover Category

↓

Prefetch Products

Hover Checkout

↓

Prefetch Checkout Assets

---

# Navigation Components

Top Navigation

Bottom Navigation

Sidebar

Admin Sidebar

Breadcrumb

Pagination

Tabs

Drawer

Mobile Menu

---

# SEO Rules

Public Routes

Index

Private Routes

Noindex

Canonical URLs

Enabled

Structured Data

Enabled

---

# Route Guards

Auth Guard

Admin Guard

Owner Guard

Permission Guard

Maintenance Guard

---

# Route Metadata

Each Route Contains

Title

Description

RequiresAuth

Roles

Layout

SEO

Breadcrumb

Analytics

---

# Analytics

Track

Page View

Navigation

Search

404

Checkout Entry

Admin Visits

Product Details

Category Visits

---

# Accessibility

Keyboard Navigation

Logical Focus Order

Skip To Content

ARIA Navigation

Semantic Links

Visible Focus

---

# Performance

Lazy Loading

Code Splitting

Prefetch

Route Caching

Suspense

Skeleton Loading

---

# Best Practices

Feature Based Routes

Nested Routing

Small Route Files

Lazy Imports

Protected Layouts

No Business Logic Inside Router

Route Constants

Centralized Route Definitions

Reusable Guards

Typed Route Parameters

---

# Future Expansion

Multi-language Routes

Multi-store Support

Branch-specific Dashboards

Vendor Portal

Customer Portal

ERP Portal

API Version Routing

Micro Frontend Ready