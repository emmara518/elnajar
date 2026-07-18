# OpenAPI Specification

**File:** `docs/api/10-openapi-spec.md`

---

# Purpose

يوضح هذا المستند مواصفات **OpenAPI 3.1** الخاصة بالنظام، والتي تُستخدم لتوثيق جميع واجهات برمجة التطبيقات (APIs) بطريقة قياسية تسمح بإنشاء وثائق تفاعلية، توليد SDKs، واختبار الـ API.

---

# Objectives

- Standardized API Documentation
- Interactive API Explorer
- Client SDK Generation
- Server Stub Generation
- API Validation
- Long-Term Maintainability

---

# OpenAPI Version

```
3.1.0
```

---

# Specification File

```
openapi.yaml
```

Alternative

```
openapi.json
```

---

# Project Structure

```
api/

    openapi.yaml

    components/

        schemas/

        parameters/

        responses/

        requestBodies/

        securitySchemes/

    paths/

        auth.yaml

        products.yaml

        categories.yaml

        orders.yaml

        payments.yaml

        users.yaml

        inventory.yaml
```

---

# API Information

```yaml
openapi: 3.1.0

info:
  title: Packaging Store API
  version: 1.0.0
  description: REST API for the Packaging & Disposable Products Platform.
```

---

# Servers

Production

```yaml
servers:
  - url: https://api.example.com/v1
```

Development

```yaml
servers:
  - url: http://localhost:5173/api/v1
```

Staging

```yaml
servers:
  - url: https://staging-api.example.com/v1
```

---

# API Tags

```
Authentication

Profile

Products

Categories

Cart

Wishlist

Orders

Payments

Inventory

Reviews

Notifications

Reports

Administration

Storage
```

---

# Security Schemes

Bearer Authentication

```yaml
securitySchemes:

  BearerAuth:

    type: http

    scheme: bearer

    bearerFormat: JWT
```

---

# Global Security

```yaml
security:

  - BearerAuth: []
```

Public Endpoints

Override

```yaml
security: []
```

---

# Components

Contains

```
Schemas

Parameters

Responses

Examples

Headers

Security Schemes

Request Bodies
```

---

# Common Schemas

```
User

Product

Category

Order

OrderItem

Payment

Review

Notification

Inventory

Error

Pagination
```

---

# Product Schema

Example

```yaml
Product:

  type: object

  properties:

    id:
      type: string

    name:
      type: string

    price:
      type: number

    stock_quantity:
      type: integer
```

---

# Error Schema

```yaml
Error:

  type: object

  properties:

    success:

      type: boolean

    error:

      type: object
```

---

# Pagination Schema

```yaml
Pagination:

  type: object

  properties:

    page:

      type: integer

    limit:

      type: integer

    total:

      type: integer
```

---

# Reusable Parameters

```
Page

Limit

Sort

Order

Search

Category

Product ID

Order ID

User ID
```

---

# Reusable Responses

```
Unauthorized

Forbidden

Not Found

Validation Error

Conflict

Internal Server Error
```

---

# Request Bodies

Reusable

```
Login

Register

Create Product

Update Product

Checkout

Payment Receipt

Review

Avatar Upload
```

---

# Path Organization

```
paths/

    auth.yaml

    profile.yaml

    products.yaml

    categories.yaml

    cart.yaml

    orders.yaml

    payments.yaml

    reviews.yaml

    inventory.yaml
```

---

# Example Endpoint

```yaml
/products:

  get:

    tags:

      - Products

    summary: List Products

    responses:

      '200':

        description: Successful Response
```

---

# Examples

Every Endpoint Should Include

- Request Example
- Success Response
- Validation Error
- Authentication Error
- Resource Not Found

---

# Response Documentation

Include

```
200

201

204

400

401

403

404

409

422

429

500

503
```

---

# File Upload Documentation

Use

```yaml
multipart/form-data
```

Schema

```yaml
type: object

properties:

  file:

    type: string

    format: binary
```

---

# Enum Documentation

Document

```
Order Status

Payment Status

User Roles

Review Status
```

Example

```yaml
enum:

  - PENDING

  - CONFIRMED

  - SHIPPED

  - DELIVERED
```

---

# Authentication Documentation

Document

- JWT
- Login Flow
- Refresh Flow
- Logout
- Password Reset
- Email Verification

---

# Error Documentation

Document

- Error Codes
- Validation Responses
- Rate Limits
- Retry Guidance

---

# Versioning

Current

```
v1
```

Future

```
v2
```

Breaking Changes

Require

New Major Version

---

# Documentation Tools

Supported

```
Swagger UI

Redoc

Scalar

Stoplight
```

---

# SDK Generation

Supported Languages

```
TypeScript

JavaScript

Flutter (Dart)

Kotlin

Swift

Python

Go

PHP

C#
```

Generated From

```
openapi.yaml
```

---

# Validation

Validate Specification Using

```
Swagger Editor

OpenAPI CLI

Spectral
```

Checks

- Schema Validity
- Broken References
- Duplicate Definitions
- Missing Examples

---

# CI/CD Integration

On Every Pull Request

- Validate OpenAPI Schema
- Check Breaking Changes
- Generate Documentation Preview
- Generate SDK (Optional)

---

# Documentation Hosting

Recommended

```
Swagger UI

or

Redoc
```

Hosted At

```
/docs

or

/api/docs
```

---

# Change Management

Every API Change Must

- Update Specification
- Update Examples
- Update Schemas
- Update Changelog
- Pass Validation

---

# Best Practices

- Use OpenAPI 3.1
- Reuse Components
- Document Every Endpoint
- Include Examples
- Keep Schemas DRY
- Version Breaking Changes
- Validate Automatically
- Generate SDKs From Spec
- Keep Documentation in Sync With Code
- Review Specification During Code Reviews

---

# Future Enhancements

- AsyncAPI Documentation
- Webhook Documentation Generation
- GraphQL Schema Documentation
- Automatic SDK Publishing
- Mock Server Generation
- AI-Assisted Documentation Validation
- API Change Impact Analysis
- Contract Testing Integration
- OpenAPI Diff Automation
- Interactive API Sandbox