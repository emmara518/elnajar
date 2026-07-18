# API Webhooks

**File:** `docs/api/09-webhooks.md`

---

# Purpose

يوضح هذا المستند آلية **Webhooks** المستخدمة لإرسال إشعارات لحظية (Event Notifications) إلى الأنظمة الخارجية عند حدوث أحداث مهمة داخل النظام.

تسمح الـ Webhooks بالتكامل مع:

- ERP Systems
- CRM Platforms
- Shipping Providers
- Payment Gateways
- Analytics Services
- Notification Platforms

---

# Objectives

- Event-Driven Integration
- Near Real-Time Notifications
- Secure Delivery
- Reliable Retry Mechanism
- Idempotent Processing
- Easy Integration

---

# Architecture

```
Application

↓

Business Event

↓

Webhook Dispatcher

↓

HTTPS POST

↓

External Service

↓

200 OK

↓

Success
```

---

# Event Flow

```
Order Created

↓

Webhook Queue

↓

Delivery Worker

↓

Target Endpoint

↓

Success / Retry
```

---

# Webhook Endpoint

Configured By

```
Owner

or

Administrator
```

Example

```
https://partner.example.com/webhooks/orders
```

---

# HTTP Method

```
POST
```

Content Type

```
application/json
```

Encoding

```
UTF-8
```

---

# Authentication

Supported Methods

```
Webhook Secret

HMAC Signature

Bearer Token

API Key
```

Recommended

```
HMAC SHA-256
```

---

# Request Headers

```
Content-Type

User-Agent

X-Webhook-ID

X-Webhook-Event

X-Webhook-Timestamp

X-Webhook-Signature
```

---

# Example Headers

```http
Content-Type: application/json

X-Webhook-Event: order.created

X-Webhook-ID: uuid

X-Webhook-Timestamp: 1721300000

X-Webhook-Signature: sha256=...
```

---

# Payload Structure

```json
{
  "id": "uuid",
  "event": "order.created",
  "occurred_at": "2026-07-18T15:00:00Z",
  "data": {}
}
```

---

# Event Types

Authentication

```
user.registered

user.login

user.password_changed
```

---

Products

```
product.created

product.updated

product.deleted
```

---

Categories

```
category.created

category.updated

category.deleted
```

---

Orders

```
order.created

order.confirmed

order.processing

order.shipped

order.delivered

order.cancelled
```

---

Payments

```
payment.created

payment.receipt_uploaded

payment.verified

payment.rejected
```

---

Inventory

```
inventory.updated

inventory.low_stock

inventory.out_of_stock
```

---

Reviews

```
review.created

review.approved

review.deleted
```

---

Customers

```
customer.created

customer.updated
```

---

Notifications

```
notification.created
```

---

Reports

```
report.generated
```

---

# Payload Example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "event": "order.created",
  "occurred_at": "2026-07-18T15:22:11Z",
  "data": {
    "order_id": "uuid",
    "customer_id": "uuid",
    "total": 345.50,
    "status": "PENDING"
  }
}
```

---

# Delivery Rules

Timeout

```
10 Seconds
```

Expected Response

```
HTTP 2xx
```

Any Other Response

↓

Retry

---

# Retry Policy

Attempts

```
5
```

Intervals

```
1 Minute

5 Minutes

15 Minutes

1 Hour

6 Hours
```

After Final Failure

```
Dead Letter Queue
```

---

# Idempotency

Every Event Contains

```
Webhook ID
```

Receivers

Must Ignore

Duplicate IDs

---

# Signature Verification

Algorithm

```
HMAC SHA-256
```

Example

```
HMAC(secret, request_body)
```

Receiver

Must Verify

Before Processing

---

# Event Ordering

Not Guaranteed

Consumers Must Handle

- Duplicate Events
- Delayed Events
- Out-of-Order Events

---

# Failure Handling

Temporary Failure

↓

Retry

Permanent Failure

↓

Log

↓

Alert

↓

Dead Letter Queue

---

# Webhook Management

Owner Can

- Register Endpoint
- Enable/Disable Endpoint
- Rotate Secret
- View Delivery Logs
- Retry Failed Deliveries
- Delete Endpoint

---

# Security Controls

- HTTPS Required
- Signature Verification
- Timestamp Validation
- Secret Rotation
- Replay Protection
- Audit Logging

---

# Replay Protection

Reject Requests Older Than

```
5 Minutes
```

Based On

```
X-Webhook-Timestamp
```

---

# Logging

Log

- Event ID
- Event Type
- Destination URL
- Response Status
- Duration
- Retry Count
- Timestamp

Never Log

- Shared Secrets
- Authorization Headers

---

# Monitoring

Track

- Successful Deliveries
- Failed Deliveries
- Retry Count
- Average Delivery Time
- Endpoint Availability
- Most Frequent Events

---

# Rate Limits

Maximum

```
100 Events

Per Minute

Per Endpoint
```

Burst

```
200 Events
```

---

# Event Versioning

Version Header

```
X-Webhook-Version: 1
```

Future

```
Versioned Payload Schema
```

---

# Testing

Support

- Test Events
- Manual Retries
- Endpoint Validation
- Signature Verification
- Delivery History

---

# Example Success Response

```http
HTTP/1.1 200 OK
```

Body

```json
{
  "received": true
}
```

---

# Best Practices

- Always Use HTTPS
- Verify HMAC Signature
- Respond Quickly
- Process Events Asynchronously
- Store Event IDs
- Handle Duplicate Deliveries
- Validate Timestamps
- Retry Transient Failures
- Monitor Delivery Health
- Rotate Secrets Regularly

---

# Future Enhancements

- Webhook Dashboard
- Event Filtering
- Per-Endpoint Event Selection
- Batch Event Delivery
- Signed JWT Webhooks
- Event Replay Console
- GraphQL Subscriptions
- Kafka/EventBridge Integration
- CloudEvents 1.0 Compatibility
- Real-Time Webhook Analytics