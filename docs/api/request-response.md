# API Request & Response Specification

**File:** `docs/api/04-request-response.md`

---

# Purpose

يوضح هذا المستند المعيار الموحد (API Contract) لجميع الطلبات (Requests) والاستجابات (Responses) داخل النظام، لضمان الاتساق وسهولة التكامل بين الـ Frontend والـ Backend.

---

# Design Principles

- Consistent Response Structure
- Predictable Error Format
- HTTP Status Code Compliance
- Machine-Readable Error Codes
- Human-Readable Messages
- Extensible Metadata

---

# Request Format

Content Type

```
application/json
```

Encoding

```
UTF-8
```

Example

```http
POST /v1/products
Content-Type: application/json
Authorization: Bearer <JWT>
```

```json
{
  "name": "Disposable Cup 250ml",
  "category_id": "uuid",
  "price": 55.00,
  "stock_quantity": 120
}
```

---

# Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "details": []
  }
}
```

---

# Response Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| success | Boolean | Yes | Indicates success or failure |
| message | String | Success Only | Human-readable message |
| data | Object / Array | Success Only | Returned resource(s) |
| meta | Object | Optional | Pagination or metadata |
| error | Object | Error Only | Error details |

---

# Success Example

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": "uuid",
    "name": "Disposable Cup",
    "price": 55
  }
}
```

---

# Validation Error Example

HTTP

```
422 Unprocessable Entity
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than zero."
      }
    ]
  }
}
```

---

# Unauthorized Example

HTTP

```
401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "message": "Authentication required."
  }
}
```

---

# Forbidden Example

HTTP

```
403 Forbidden
```

```json
{
  "success": false,
  "error": {
    "code": "AUTH_FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

---

# Not Found Example

HTTP

```
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource does not exist."
  }
}
```

---

# Conflict Example

HTTP

```
409 Conflict
```

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_ALREADY_EXISTS",
    "message": "A product with this SKU already exists."
  }
}
```

---

# Internal Server Error

HTTP

```
500 Internal Server Error
```

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

---

# Validation Details Format

```json
{
  "field": "email",
  "message": "Email address is invalid."
}
```

Multiple Errors

```json
{
  "details": [
    {
      "field": "name",
      "message": "Name is required."
    },
    {
      "field": "price",
      "message": "Price must be greater than zero."
    }
  ]
}
```

---

# Pagination Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 248,
    "total_pages": 13,
    "has_next": true,
    "has_previous": false
  }
}
```

---

# Collection Response

```json
{
  "success": true,
  "data": [
    {},
    {},
    {}
  ]
}
```

---

# Single Resource Response

```json
{
  "success": true,
  "data": {
    "id": "uuid"
  }
}
```

---

# Empty Response

HTTP

```
204 No Content
```

Body

```
None
```

Used For

- Successful Delete
- Idempotent Operations
- Background Actions

---

# File Upload Response

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "path": "products/uuid/image.webp"
  }
}
```

---

# Authentication Response

```json
{
  "success": true,
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "role": "Customer"
    }
  }
}
```

---

# Timestamp Format

Standard

```
ISO 8601
```

Example

```text
2026-07-18T15:45:30Z
```

Timezone

```
UTC
```

---

# UUID Format

All Resource IDs

```
UUID v4
```

Example

```text
550e8400-e29b-41d4-a716-446655440000
```

---

# Boolean Values

Always

```json
true

false
```

Never

```json
1

0

"true"
```

---

# Decimal Values

Example

```json
{
  "price": 125.50
}
```

Never

```json
"125.50"
```

---

# Date Values

```json
{
  "created_at": "2026-07-18T12:15:00Z"
}
```

---

# Enum Values

Example

```json
{
  "order_status": "CONFIRMED",
  "payment_status": "PENDING"
}
```

Enums

Always

Uppercase

Snake Case

---

# Metadata

Optional

```json
{
  "meta": {
    "request_id": "uuid",
    "execution_time_ms": 42,
    "api_version": "v1"
  }
}
```

---

# Error Codes

Authentication

```
AUTH_UNAUTHORIZED

AUTH_FORBIDDEN

AUTH_TOKEN_EXPIRED
```

Validation

```
VALIDATION_ERROR

INVALID_REQUEST
```

Resources

```
RESOURCE_NOT_FOUND

RESOURCE_ALREADY_EXISTS
```

Business

```
OUT_OF_STOCK

PAYMENT_NOT_VERIFIED

ORDER_ALREADY_SHIPPED

INVALID_COUPON
```

System

```
RATE_LIMIT_EXCEEDED

INTERNAL_SERVER_ERROR

SERVICE_UNAVAILABLE
```

---

# HTTP Status Mapping

| Status | Meaning |
|---------|---------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Invalid Request |
| 401 | Authentication Required |
| 403 | Permission Denied |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

# Correlation ID

Every Request Should Include

```
X-Request-ID
```

Returned Back

In Response Headers

Purpose

- Traceability
- Debugging
- Logging

---

# Response Headers

Standard Headers

```
Content-Type

Cache-Control

X-Request-ID

X-API-Version
```

Optional

```
Retry-After

ETag

Last-Modified
```

---

# Best Practices

- Always Return Valid JSON
- Keep Response Structure Consistent
- Never Expose Internal Errors
- Use Appropriate HTTP Status Codes
- Include Validation Details When Applicable
- Return UTC Timestamps
- Use UUIDs for Resource Identifiers
- Keep Error Codes Stable Across Versions
- Include Request IDs for Observability
- Maintain Backward Compatibility Within the Same API Version

---

# Future Enhancements

- JSON:API Compatibility
- RFC 9457 Problem Details Support
- Cursor-Based Pagination Metadata
- Localization of Error Messages
- Field Selection (`?fields=`)
- Sparse Resource Responses
- Partial Response Compression
- GraphQL Response Adapter
- Batch Request Support
- Streaming Responses