# API Overview

**File:** `docs/api/01-api-overview.md`

---

# Purpose

يوضح هذا المستند البنية العامة لواجهة برمجة التطبيقات (API) المستخدمة في المشروع، ومبادئ تصميمها، وآلية المصادقة، وإدارة الإصدارات، وأسلوب التواصل بين العميل (Frontend) والخادم (Backend).

---

# API Style

Architecture

```
REST API
```

Transport

```
HTTPS
```

Data Format

```
JSON
```

Encoding

```
UTF-8
```

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

# Technology Stack

- Supabase Edge Functions
- PostgreSQL
- Supabase Auth
- Supabase Storage
- TypeScript
- Deno Runtime

---

# API Responsibilities

- Authentication
- Authorization
- Product Management
- Category Management
- Customer Management
- Shopping Cart
- Checkout
- Order Management
- Payment Verification
- Inventory Updates
- Notifications
- Reports
- File Upload

---

# Architecture

```
Frontend

↓

HTTPS

↓

Edge Functions

↓

Business Logic

↓

PostgreSQL

↓

JSON Response
```

---

# API Modules

```
Authentication

Products

Categories

Customers

Cart

Wishlist

Orders

Payments

Inventory

Reviews

Notifications

Administration

Reports

Storage
```

---

# Request Lifecycle

```
Client Request

↓

Authentication

↓

Validation

↓

Authorization

↓

Business Logic

↓

Database

↓

Response
```

---

# HTTP Methods

| Method | Purpose |
|---------|----------|
| GET | Read Data |
| POST | Create Resource |
| PUT | Replace Resource |
| PATCH | Partial Update |
| DELETE | Delete Resource |

---

# Response Format

Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

---

Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}
```

---

# Authentication

Method

```
Bearer Token (JWT)
```

Header

```
Authorization: Bearer <token>
```

Provider

```
Supabase Auth
```

---

# Authorization

Controlled By

- Row Level Security (RLS)
- Role-Based Access Control (RBAC)

Roles

```
Guest

Customer

Admin

Owner
```

---

# Versioning

Strategy

```
URL Versioning
```

Example

```
/v1/products

/v1/orders

/v1/payments
```

Future

```
/v2/...
```

---

# Content Types

Requests

```
application/json
```

Uploads

```
multipart/form-data
```

Responses

```
application/json
```

---

# Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# API Principles

- Stateless Requests
- Predictable URLs
- Consistent Responses
- Secure by Default
- Idempotent Operations Where Applicable
- Clear Error Messages
- Backward Compatibility Within Major Version

---

# Validation

Every Request Is Validated For

- Authentication
- Required Fields
- Data Types
- Business Rules
- Resource Ownership

---

# Security

- HTTPS Only
- JWT Authentication
- RLS Enforcement
- Input Validation
- SQL Injection Protection
- Rate Limiting
- File Upload Validation
- Audit Logging

---

# Performance Targets

| Operation | Target |
|-----------|--------|
| Authentication | < 300 ms |
| Product Listing | < 200 ms |
| Product Details | < 150 ms |
| Cart Operations | < 150 ms |
| Checkout | < 500 ms |
| Order Lookup | < 200 ms |

---

# Error Strategy

Every Error Includes

- Error Code
- Human-Readable Message
- HTTP Status Code
- Optional Validation Details

---

# Pagination

Default

```
20 items
```

Maximum

```
100 items
```

Supports

- Limit
- Offset
- Cursor Pagination (Future)

---

# Filtering

Supported By

- Category
- Price
- Brand
- Availability
- Rating
- Search Query

---

# Sorting

Supported Fields

- Price
- Name
- Created Date
- Popularity
- Rating

---

# File Uploads

Supported Resources

- Product Images
- User Avatars
- Payment Receipts
- Documents

Managed Through

```
Supabase Storage
```

---

# Observability

Every Request May Be Logged With

- Request ID
- User ID
- Endpoint
- Duration
- Status Code
- Error Code (If Applicable)

---

# Future Enhancements

- OpenAPI 3.1 Specification
- SDK Generation
- GraphQL Gateway
- Webhooks
- API Keys for Integrations
- Real-Time Event Streaming
- Request Tracing
- Distributed Caching
- Multi-Tenant APIs
- Public Developer Portal