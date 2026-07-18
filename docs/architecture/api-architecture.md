# API Architecture

**File:** `docs/architecture/05-api-architecture.md`

---

# Purpose

يوضح هذا المستند كيفية تصميم طبقة الـ API داخل المشروع لضمان:

- Separation of Concerns
- Scalable Services
- Reusable API Layer
- Type Safe Requests
- Secure Communication
- Easy Testing
- Easy Maintenance

---

# Architecture

```
UI Components

↓

Hooks

↓

Feature Services

↓

API Client

↓

Supabase Edge Functions / REST API

↓

PostgreSQL
```

---

# Principles

- UI Never Talks Directly To Database
- UI Never Contains Business Logic
- Services Handle API Calls
- Hooks Consume Services
- Components Consume Hooks
- Every Request Is Typed
- Every Response Is Typed

---

# API Layers

```
Presentation Layer

↓

Hooks

↓

Feature Service

↓

API Client

↓

Supabase

↓

Database
```

---

# Folder Structure

```
src/

services/

api/

client.ts

interceptors.ts

errors.ts

types.ts

products.service.ts

orders.service.ts

customers.service.ts

checkout.service.ts

inventory.service.ts

dashboard.service.ts
```

---

# API Client

Single API Entry Point

Responsibilities

- HTTP Requests
- Authentication
- Error Handling
- Retry Logic
- Timeout
- Logging

---

# Request Flow

```
Button Click

↓

Hook

↓

Service

↓

API Client

↓

Supabase

↓

Database

↓

Response

↓

Cache

↓

UI
```

---

# Response Flow

```
Database

↓

Edge Function

↓

JSON Response

↓

API Client

↓

Feature Service

↓

TanStack Query

↓

Component
```

---

# Standard Response Format

Success

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

---

Validation Error

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": []
}
```

---

Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

# HTTP Methods

GET

Read Data

---

POST

Create

---

PUT

Replace

---

PATCH

Partial Update

---

DELETE

Soft Delete

---

# Resource Structure

Products

```
GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id
```

---

Categories

```
GET /categories

POST /categories

PUT /categories/:id

DELETE /categories/:id
```

---

Orders

```
GET /orders

GET /orders/:id

POST /orders

PATCH /orders/:id

DELETE /orders/:id
```

---

Customers

```
GET /customers

GET /customers/:id

PUT /customers/:id
```

---

Authentication

```
POST /auth/login

POST /auth/logout

POST /auth/register

POST /auth/reset-password

GET /auth/profile
```

---

Inventory

```
GET /inventory

POST /inventory

PATCH /inventory/:id

GET /inventory/history
```

---

Dashboard

```
GET /dashboard

GET /dashboard/stats

GET /dashboard/analytics
```

---

Reports

```
GET /reports/sales

GET /reports/orders

GET /reports/products

GET /reports/customers
```

---

# Request Headers

```
Authorization

Bearer JWT
```

```
Content-Type

application/json
```

```
Accept

application/json
```

---

# Upload Requests

Content Type

```
multipart/form-data
```

Used For

- Product Images
- Profile Images
- Payment Receipts

---

# Pagination

Example

```
GET /products?page=1&limit=24
```

Response

```json
{
  "data": [],
  "page": 1,
  "limit": 24,
  "total": 520,
  "pages": 22
}
```

---

# Filtering

```
category

brand

price

rating

availability

offers
```

Example

```
GET /products

?category=paper

&brand=abc

&priceMin=50

&priceMax=500
```

---

# Sorting

```
price

rating

createdAt

bestSeller

discount
```

Example

```
?sort=price

&direction=asc
```

---

# Searching

```
GET /products?q=foam
```

Supports

- Product Name
- SKU
- Barcode
- Description

---

# Authentication Flow

```
Login

↓

JWT

↓

API Client

↓

Authorization Header

↓

Edge Function

↓

Validation

↓

Database
```

---

# Error Handling

400

Validation Error

---

401

Unauthorized

---

403

Forbidden

---

404

Not Found

---

409

Conflict

---

422

Business Rule Error

---

429

Rate Limited

---

500

Internal Error

---

503

Maintenance

---

# Retry Strategy

GET

Retry

3 Times

---

POST

No Retry

---

PUT

No Retry

---

DELETE

No Retry

---

Network Failure

Retry With Exponential Backoff

---

# Timeout

Default

30 Seconds

Uploads

120 Seconds

Reports

60 Seconds

---

# Caching

Products

10 Minutes

---

Categories

1 Hour

---

Dashboard

2 Minutes

---

Settings

24 Hours

---

# File Upload

Supported

PNG

JPEG

WEBP

PDF

---

Maximum

10 MB

---

Image Optimization

Automatic

---

Storage

Supabase Storage

---

# Logging

Every Request Logs

Method

URL

Status

Duration

User ID

Correlation ID

---

# Validation

Client Validation

↓

Server Validation

↓

Database Constraints

---

# Security

JWT Required

HTTPS Only

Row Level Security

Input Sanitization

Output Encoding

Rate Limiting

Signed Upload URLs

CSRF Protection (if cookie auth is added)

---

# API Versioning

Current

```
/v1/
```

Future

```
/v2/
```

---

# Service Naming

```
products.service.ts

orders.service.ts

checkout.service.ts

customers.service.ts

inventory.service.ts
```

---

# Hook Integration

```
useProducts()

↓

products.service

↓

API Client
```

---

# Testing

Unit Tests

Integration Tests

Mock API

Contract Tests

Error Handling Tests

Upload Tests

Pagination Tests

Authentication Tests

---

# Monitoring

Average Response Time

Failed Requests

Slow Endpoints

Upload Failures

Authentication Failures

Database Latency

---

# Best Practices

Single API Client

Typed Requests

Typed Responses

No Direct Fetch In Components

Reusable Services

Centralized Error Handling

Centralized Authentication

Cache Server Responses

Optimistic Updates

Graceful Failures

---

# Future Expansion

GraphQL Gateway

Webhook Support

Realtime Subscriptions

Background Jobs

Queue Processing

Batch APIs

Public API

Developer SDK

API Rate Dashboard

OpenAPI / Swagger Documentation