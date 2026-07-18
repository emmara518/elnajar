# API Endpoints

**File:** `docs/api/03-endpoints.md`

---

# Purpose

يوضح هذا المستند جميع واجهات برمجة التطبيقات (API Endpoints) الخاصة بالنظام، بما في ذلك المسارات (Routes)، وطرق الطلب (HTTP Methods)، والصلاحيات المطلوبة، وأوصاف العمليات.

---

# Base URL

Development

```
http://localhost:54321/functions/v1
```

Production

```
https://<project>.supabase.co/functions/v1
```

---

# API Version

Current Version

```
v1
```

Endpoint Format

```
/v1/{resource}
```

Example

```
/v1/products

/v1/orders

/v1/payments
```

---

# Authentication Endpoints

## Register

```
POST /v1/auth/register
```

Access

```
Public
```

Description

Create a new customer account.

---

## Login

```
POST /v1/auth/login
```

Access

```
Public
```

Returns

```
JWT

Refresh Token
```

---

## Logout

```
POST /v1/auth/logout
```

Access

```
Authenticated
```

---

## Refresh Token

```
POST /v1/auth/refresh
```

Access

```
Authenticated
```

---

## Forgot Password

```
POST /v1/auth/forgot-password
```

---

## Reset Password

```
POST /v1/auth/reset-password
```

---

## Verify Email

```
POST /v1/auth/verify-email
```

---

# Profile Endpoints

## Get Current Profile

```
GET /v1/profile
```

Access

```
Authenticated
```

---

## Update Profile

```
PATCH /v1/profile
```

---

## Upload Avatar

```
POST /v1/profile/avatar
```

Content Type

```
multipart/form-data
```

---

# Categories

## List Categories

```
GET /v1/categories
```

Public

---

## Category Details

```
GET /v1/categories/{id}
```

---

## Create Category

```
POST /v1/categories
```

Access

```
Admin

Owner
```

---

## Update Category

```
PATCH /v1/categories/{id}
```

---

## Delete Category

```
DELETE /v1/categories/{id}
```

---

# Products

## List Products

```
GET /v1/products
```

Supports

- Pagination
- Search
- Filters
- Sorting

---

## Product Details

```
GET /v1/products/{id}
```

---

## Featured Products

```
GET /v1/products/featured
```

---

## Search Products

```
GET /v1/products/search
```

Query Parameters

```
q

category

price_min

price_max

brand

sort
```

---

## Create Product

```
POST /v1/products
```

Access

```
Admin

Owner
```

---

## Update Product

```
PATCH /v1/products/{id}
```

---

## Delete Product

```
DELETE /v1/products/{id}
```

---

## Upload Product Images

```
POST /v1/products/{id}/images
```

Content Type

```
multipart/form-data
```

---

# Wishlist

## Get Wishlist

```
GET /v1/wishlist
```

---

## Add Product

```
POST /v1/wishlist
```

---

## Remove Product

```
DELETE /v1/wishlist/{productId}
```

---

# Shopping Cart

## Get Cart

```
GET /v1/cart
```

---

## Add Item

```
POST /v1/cart/items
```

---

## Update Quantity

```
PATCH /v1/cart/items/{itemId}
```

---

## Remove Item

```
DELETE /v1/cart/items/{itemId}
```

---

## Clear Cart

```
DELETE /v1/cart
```

---

# Checkout

## Checkout

```
POST /v1/checkout
```

Creates

- Order
- Payment Record
- Inventory Reservation

---

# Orders

## List Orders

```
GET /v1/orders
```

Customer

Own Orders

Admin

All Orders

---

## Order Details

```
GET /v1/orders/{id}
```

---

## Create Order

```
POST /v1/orders
```

Normally Called

Through Checkout

---

## Update Order Status

```
PATCH /v1/orders/{id}/status
```

Access

```
Admin

Owner
```

---

## Cancel Order

```
POST /v1/orders/{id}/cancel
```

Rules

Business Validation Required

---

## Order Timeline

```
GET /v1/orders/{id}/timeline
```

---

# Payments

## Upload Receipt

```
POST /v1/payments/{id}/receipt
```

Content Type

```
multipart/form-data
```

---

## Verify Payment

```
POST /v1/payments/{id}/verify
```

Access

```
Admin

Owner
```

---

## Reject Payment

```
POST /v1/payments/{id}/reject
```

---

## Payment Details

```
GET /v1/payments/{id}
```

---

# Reviews

## List Reviews

```
GET /v1/products/{id}/reviews
```

---

## Add Review

```
POST /v1/products/{id}/reviews
```

Authenticated Customers

Only

---

## Update Review

```
PATCH /v1/reviews/{id}
```

---

## Delete Review

```
DELETE /v1/reviews/{id}
```

---

# Notifications

## List Notifications

```
GET /v1/notifications
```

---

## Mark As Read

```
PATCH /v1/notifications/{id}
```

---

## Mark All Read

```
POST /v1/notifications/read-all
```

---

# Inventory

## Inventory Summary

```
GET /v1/inventory
```

Access

```
Admin

Owner
```

---

## Inventory History

```
GET /v1/inventory/{productId}/history
```

---

## Manual Adjustment

```
POST /v1/inventory/adjust
```

---

# Coupons

## Validate Coupon

```
POST /v1/coupons/validate
```

---

## Create Coupon

```
POST /v1/coupons
```

---

## Update Coupon

```
PATCH /v1/coupons/{id}
```

---

## Delete Coupon

```
DELETE /v1/coupons/{id}
```

---

# Offers

## List Offers

```
GET /v1/offers
```

---

## Create Offer

```
POST /v1/offers
```

---

## Update Offer

```
PATCH /v1/offers/{id}
```

---

## Delete Offer

```
DELETE /v1/offers/{id}
```

---

# Administration

## Dashboard

```
GET /v1/admin/dashboard
```

---

## Sales Report

```
GET /v1/admin/reports/sales
```

---

## Inventory Report

```
GET /v1/admin/reports/inventory
```

---

## Customer Report

```
GET /v1/admin/reports/customers
```

---

## Activity Logs

```
GET /v1/admin/activity
```

Owner

Only

---

# Settings

## Public Settings

```
GET /v1/settings/public
```

---

## Update Settings

```
PATCH /v1/settings
```

Owner

Only

---

# File Storage

## Upload Document

```
POST /v1/storage/documents
```

---

## Delete File

```
DELETE /v1/storage/{fileId}
```

---

## Generate Signed URL

```
POST /v1/storage/signed-url
```

Private Files

Only

---

# Health

## Health Check

```
GET /v1/health
```

Returns

```
Status

Version

Database

Storage
```

---

# Metrics

## API Metrics

```
GET /v1/metrics
```

Owner

Only

---

# Endpoint Naming Rules

Resources

Plural

```
/products

/orders

/categories
```

Actions

Verb After Resource

```
/orders/{id}/cancel

/payments/{id}/verify

/notifications/read-all
```

---

# Common Query Parameters

Pagination

```
page

limit
```

Filtering

```
search

category

status

brand

price_min

price_max
```

Sorting

```
sort

order
```

---

# Access Matrix

| Module | Guest | Customer | Admin | Owner |
|---------|--------|----------|--------|--------|
| Products | Read | Read | CRUD | CRUD |
| Categories | Read | Read | CRUD | CRUD |
| Cart | None | CRUD | None | Read |
| Wishlist | None | CRUD | None | Read |
| Orders | None | Own | All | All |
| Payments | None | Own | Verify | Full |
| Inventory | None | None | Read/Update | Full |
| Reviews | Read | CRUD Own | Moderate | Full |
| Reports | None | None | Read | Full |
| Settings | Read Public | Read Public | Limited | Full |

---

# Best Practices

- Use Resource-Oriented URLs
- Keep Endpoints Stateless
- Return Consistent JSON Responses
- Validate Every Request
- Enforce Authorization Through RLS
- Version APIs Explicitly
- Use Correct HTTP Status Codes
- Support Pagination for Collections
- Keep Business Logic Out of the Client
- Document Every Endpoint