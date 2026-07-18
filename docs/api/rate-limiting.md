# API Rate Limiting

**File:** `docs/api/08-rate-limiting.md`

---

# Purpose

يوضح هذا المستند استراتيجية **Rate Limiting** المستخدمة لحماية واجهات برمجة التطبيقات من إساءة الاستخدام (Abuse)، والهجمات الآلية، ومحاولات التخمين (Brute Force)، مع ضمان عدالة توزيع الموارد بين المستخدمين.

---

# Objectives

- Prevent Abuse
- Protect Infrastructure
- Prevent Brute Force Attacks
- Fair Resource Usage
- Improve API Stability
- Mitigate DDoS Effects

---

# Rate Limiting Strategy

Primary Identifier

```
Authenticated User ID
```

Fallback

```
IP Address
```

Additional Signals

- Device Fingerprint (Future)
- API Key (Future)
- Session ID

---

# Limiting Scope

Rate limits are applied per:

- User
- IP Address
- Endpoint
- Authentication State

---

# Time Windows

Supported Windows

```
1 Minute

5 Minutes

1 Hour

24 Hours
```

---

# Default Limits

| Endpoint Type | Limit |
|---------------|-------|
| Public GET | 120 requests/minute |
| Authenticated GET | 300 requests/minute |
| POST | 60 requests/minute |
| PATCH | 60 requests/minute |
| DELETE | 30 requests/minute |
| File Upload | 20 requests/hour |

---

# Authentication Limits

## Login

```
5 Attempts

Per 15 Minutes

Per IP
```

Exceeded

↓

Temporary Lock

```
15 Minutes
```

---

## Registration

```
3 Accounts

Per Hour

Per IP
```

---

## Password Reset

```
3 Requests

Per Hour

Per Email
```

---

## Email Verification

```
5 Requests

Per Hour
```

---

# Product API Limits

List Products

```
300 Requests

Per Minute
```

Product Details

```
500 Requests

Per Minute
```

Search

```
100 Requests

Per Minute
```

---

# Shopping Limits

Cart Updates

```
120 Requests

Per Minute
```

Wishlist

```
60 Requests

Per Minute
```

Checkout

```
10 Requests

Per Hour
```

---

# Order Limits

Create Order

```
10 Requests

Per Hour
```

Cancel Order

```
5 Requests

Per Hour
```

Status Updates

```
60 Requests

Per Hour
```

---

# Payment Limits

Upload Receipt

```
10 Requests

Per Hour
```

Payment Verification

```
120 Requests

Per Hour

(Admin Only)
```

---

# File Upload Limits

Avatar

```
10 Uploads

Per Day
```

Product Images

```
200 Uploads

Per Day

(Admin)
```

Documents

```
50 Uploads

Per Day
```

---

# Admin API Limits

Dashboard

```
600 Requests

Per Minute
```

Reports

```
60 Requests

Per Hour
```

Exports

```
20 Requests

Per Day
```

---

# Health Endpoint

```
Unlimited

Internal Monitoring
```

Public

```
60 Requests

Per Minute
```

---

# Rate Limit Response

HTTP

```
429 Too Many Requests
```

Body

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

# Response Headers

Every Limited Endpoint Returns

```
X-RateLimit-Limit

X-RateLimit-Remaining

X-RateLimit-Reset

Retry-After
```

Example

```
X-RateLimit-Limit: 300

X-RateLimit-Remaining: 42

Retry-After: 60
```

---

# Retry Strategy

Clients Should

- Respect `Retry-After`
- Retry Safe Requests Only
- Use Exponential Backoff
- Avoid Parallel Retries

---

# Exemptions

No Limits

For

- Internal Background Jobs
- Scheduled Tasks
- Database Migrations

Higher Limits

For

- Owner
- Trusted Internal Services

---

# Abuse Detection

Automatically Detect

- Rapid Login Attempts
- Credential Stuffing
- High Request Rates
- Suspicious Upload Patterns
- Excessive Search Requests

Actions

- Temporary Block
- Security Alert
- Audit Log Entry

---

# Distributed Rate Limiting

Future Support

Shared Counters

Across

- Multiple API Instances
- Multiple Regions

Storage

```
Redis

or

Supabase Cache
```

---

# Monitoring

Track

- Requests Per Minute
- Blocked Requests
- Top Endpoints
- Top IP Addresses
- Failed Authentication Attempts
- Upload Frequency

---

# Alerting

Generate Alerts When

- Brute Force Suspected
- High 429 Rate
- API Traffic Spike
- Repeated Upload Abuse
- Distributed Attack Indicators

---

# Logging

Log

- User ID
- IP Address
- Endpoint
- HTTP Method
- Timestamp
- Remaining Quota
- Block Duration

Never Log

- Passwords
- JWT Tokens
- Payment Credentials

---

# Rate Limit Algorithm

Current

```
Token Bucket
```

Alternative

```
Sliding Window
```

Future

```
Adaptive Rate Limiting
```

Based On

- User Reputation
- Endpoint Cost
- System Load

---

# Client Recommendations

Clients Should

- Cache Read Requests
- Debounce Search
- Batch Operations Where Possible
- Avoid Polling
- Respect Response Headers

---

# Security Integration

Combined With

- JWT Authentication
- RLS Policies
- Audit Logging
- WAF (Future)
- Bot Detection (Future)

---

# Performance Considerations

- Lightweight Counters
- Minimal Latency
- Distributed Cache Support
- Configurable Per Endpoint
- Environment-Specific Limits

---

# Environment Configuration

Development

```
Relaxed Limits
```

Staging

```
Production-Like Limits
```

Production

```
Strict Limits
```

---

# Best Practices

- Apply Limits Per Endpoint
- Use User ID Before IP When Available
- Return Standard HTTP 429 Responses
- Include Retry Headers
- Log Rate Limit Violations
- Monitor Usage Trends
- Tune Limits Based on Real Traffic
- Protect Authentication Endpoints Aggressively
- Exempt Internal Services Carefully
- Review Limits Regularly

---

# Future Enhancements

- Dynamic Per-Tenant Limits
- API Key Quotas
- Premium Tier Limits
- Geographic Rate Policies
- AI-Based Abuse Detection
- CAPTCHA Integration After Repeated Failures
- Adaptive Limits During Peak Traffic
- Self-Service Usage Dashboard
- Webhook Notifications for Quota Usage
- Automatic Temporary IP Reputation System