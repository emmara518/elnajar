# API Error Handling

**File:** `docs/api/05-error-handling.md`

---

# Purpose

يوضح هذا المستند استراتيجية إدارة الأخطاء (Error Handling) داخل واجهات برمجة التطبيقات، بهدف تقديم رسائل واضحة للمستخدم، ومعلومات مفيدة للمطور، مع الحفاظ على الأمان وعدم كشف تفاصيل النظام الداخلية.

---

# Objectives

- Consistent Error Responses
- Secure Error Messages
- Easy Client Integration
- Reliable Debugging
- Comprehensive Logging
- Production Safety

---

# Error Flow

```
Client Request

↓

Validation

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database

↓

Exception

↓

Error Handler

↓

JSON Response
```

---

# Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [],
    "request_id": "uuid",
    "timestamp": "2026-07-18T12:00:00Z"
  }
}
```

---

# Error Object

| Field | Type | Description |
|---------|------|-------------|
| code | String | Stable machine-readable code |
| message | String | Human-readable message |
| details | Array | Validation or field errors |
| request_id | UUID | Correlation ID |
| timestamp | ISO 8601 | UTC timestamp |

---

# Error Categories

```
Authentication

Authorization

Validation

Business Rules

Resources

Storage

Rate Limiting

Infrastructure

Unexpected Errors
```

---

# Authentication Errors

| Code | HTTP | Description |
|------|------|-------------|
| AUTH_UNAUTHORIZED | 401 | Login required |
| AUTH_TOKEN_EXPIRED | 401 | Session expired |
| AUTH_INVALID_TOKEN | 401 | Invalid JWT |
| AUTH_EMAIL_NOT_VERIFIED | 403 | Email verification required |
| AUTH_ACCOUNT_DISABLED | 403 | Account disabled |

---

# Authorization Errors

| Code | HTTP |
|------|------|
| AUTH_FORBIDDEN | 403 |
| ROLE_REQUIRED | 403 |
| OWNER_REQUIRED | 403 |
| ADMIN_REQUIRED | 403 |

---

# Validation Errors

| Code | HTTP |
|------|------|
| VALIDATION_ERROR | 422 |
| REQUIRED_FIELD | 422 |
| INVALID_EMAIL | 422 |
| INVALID_PHONE | 422 |
| INVALID_UUID | 422 |
| INVALID_DATE | 422 |
| INVALID_ENUM | 422 |

---

# Business Rule Errors

| Code | HTTP |
|------|------|
| OUT_OF_STOCK | 409 |
| INVALID_COUPON | 409 |
| COUPON_EXPIRED | 409 |
| PAYMENT_ALREADY_VERIFIED | 409 |
| ORDER_ALREADY_SHIPPED | 409 |
| ORDER_ALREADY_CANCELLED | 409 |
| REVIEW_ALREADY_EXISTS | 409 |

---

# Resource Errors

| Code | HTTP |
|------|------|
| RESOURCE_NOT_FOUND | 404 |
| PRODUCT_NOT_FOUND | 404 |
| CATEGORY_NOT_FOUND | 404 |
| ORDER_NOT_FOUND | 404 |
| PAYMENT_NOT_FOUND | 404 |

---

# Duplicate Resource Errors

| Code | HTTP |
|------|------|
| RESOURCE_ALREADY_EXISTS | 409 |
| EMAIL_ALREADY_EXISTS | 409 |
| SKU_ALREADY_EXISTS | 409 |
| BARCODE_ALREADY_EXISTS | 409 |

---

# File Upload Errors

| Code | HTTP |
|------|------|
| FILE_TOO_LARGE | 413 |
| INVALID_FILE_TYPE | 415 |
| STORAGE_UPLOAD_FAILED | 500 |
| STORAGE_NOT_AVAILABLE | 503 |

---

# Payment Errors

| Code | HTTP |
|------|------|
| PAYMENT_NOT_VERIFIED | 409 |
| INVALID_PAYMENT_METHOD | 422 |
| RECEIPT_REQUIRED | 422 |
| RECEIPT_ALREADY_UPLOADED | 409 |

---

# Inventory Errors

| Code | HTTP |
|------|------|
| INSUFFICIENT_STOCK | 409 |
| INVENTORY_NOT_FOUND | 404 |
| NEGATIVE_STOCK | 409 |

---

# Rate Limiting Errors

| Code | HTTP |
|------|------|
| RATE_LIMIT_EXCEEDED | 429 |

Headers

```
Retry-After
```

---

# Server Errors

| Code | HTTP |
|------|------|
| INTERNAL_SERVER_ERROR | 500 |
| DATABASE_ERROR | 500 |
| SERVICE_UNAVAILABLE | 503 |
| STORAGE_SERVICE_UNAVAILABLE | 503 |
| TIMEOUT | 504 |

---

# Validation Details

Example

```json
{
  "details": [
    {
      "field": "email",
      "message": "Email format is invalid."
    },
    {
      "field": "price",
      "message": "Price must be greater than zero."
    }
  ]
}
```

---

# HTTP Status Codes

| Status | Usage |
|---------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Invalid Request Syntax |
| 401 | Authentication Required |
| 403 | Permission Denied |
| 404 | Resource Not Found |
| 409 | Business Conflict |
| 413 | Payload Too Large |
| 415 | Unsupported Media Type |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Error |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

---

# Client Error Handling

Frontend Should

- Display User-Friendly Messages
- Highlight Invalid Fields
- Retry Safe Requests
- Redirect On Authentication Failure
- Log Unexpected Errors

---

# Retry Strategy

Automatically Retry

```
503

504

Network Errors
```

Never Retry

```
401

403

404

422
```

Maximum Retries

```
3
```

Backoff

```
Exponential
```

---

# Logging Strategy

Log

- Error Code
- Stack Trace
- Request ID
- User ID
- Endpoint
- HTTP Method
- IP Address (Optional)
- Timestamp

Never Log

- Passwords
- JWT Tokens
- Payment Credentials
- Personal Secrets

---

# Error Severity

| Level | Description |
|--------|-------------|
| INFO | Expected Business Event |
| WARNING | Recoverable Issue |
| ERROR | Failed Request |
| CRITICAL | Service Failure |

---

# Correlation ID

Request Header

```
X-Request-ID
```

Returned In

```
Response Headers
```

Used For

- Log Correlation
- Debugging
- Monitoring

---

# Production Rules

Production Responses

Never Include

- Stack Trace
- SQL Queries
- Internal Paths
- Environment Variables
- Database Structure

---

# Development Mode

May Include

- Stack Trace
- Exception Type
- Debug Metadata

Never Enabled

In Production

---

# Monitoring Integration

Track

- Error Rate
- 5xx Responses
- Validation Failures
- Authentication Failures
- Storage Failures
- Database Errors

Alerts

- High Error Rate
- Repeated Failures
- Service Downtime

---

# Error Lifecycle

```
Request

↓

Exception

↓

Classification

↓

Logging

↓

Response

↓

Monitoring

↓

Alerting
```

---

# Best Practices

- Use Stable Error Codes
- Never Expose Internal Exceptions
- Return Consistent JSON Structure
- Include Request IDs
- Log Every Unexpected Error
- Separate User Messages From Internal Logs
- Use Correct HTTP Status Codes
- Validate Input Before Business Logic
- Retry Only Safe Operations
- Monitor Error Trends Continuously

---

# Future Enhancements

- RFC 9457 Problem Details Support
- Automatic Error Categorization
- AI-Assisted Log Analysis
- Distributed Tracing (OpenTelemetry)
- Sentry Integration
- Structured JSON Logging
- Error Analytics Dashboard
- Automatic Incident Creation
- Localization of Error Messages
- Self-Healing Recovery Workflows