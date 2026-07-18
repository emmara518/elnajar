# API Authentication

**File:** `docs/api/02-authentication.md`

---

# Purpose

يوضح هذا المستند آلية المصادقة (Authentication) وإدارة الجلسات (Session Management) داخل النظام باستخدام **Supabase Auth** و **JWT**.

يشمل:

- User Registration
- Login
- Logout
- Session Management
- Token Refresh
- Password Reset
- Email Verification
- Authorization Flow
- Security Best Practices

---

# Authentication Provider

```
Supabase Auth
```

Authentication Method

```
JWT Bearer Token
```

Session Storage

```
Secure HTTP Storage

+ In-Memory Client State
```

---

# Authentication Flow

```
User

↓

Login

↓

Supabase Auth

↓

JWT Issued

↓

Frontend Stores Session

↓

API Requests

↓

JWT Validation

↓

RLS Policies

↓

Database
```

---

# User Roles

```
Guest

↓

Customer

↓

Admin

↓

Owner
```

---

# Identity Model

Authentication Identity

```
auth.users
```

Business Profile

```
profiles
```

Relationship

```
auth.users

↓

profiles

↓

customers
```

---

# Registration Flow

```
Visitor

↓

Sign Up Form

↓

Validation

↓

Supabase Auth

↓

Email Verification

↓

Create Profile

↓

Create Customer Record

↓

Success
```

---

# Registration Fields

Required

```
Full Name

Email

Password

Phone Number
```

Optional

```
Avatar
```

---

# Password Rules

Minimum

```
8 Characters
```

Must Include

- Uppercase Letter
- Lowercase Letter
- Number
- Special Character

Rejected

- Weak Passwords
- Common Passwords
- Empty Passwords

---

# Email Verification

Required

Before

```
First Login
```

Flow

```
Register

↓

Verification Email

↓

User Clicks Link

↓

Account Activated
```

---

# Login Flow

```
Email

+

Password

↓

Supabase Auth

↓

JWT

↓

Session Created

↓

Redirect
```

---

# Login Request

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

---

# Login Response

```json
{
  "success": true,
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": {
    "id": "...",
    "role": "Customer"
  }
}
```

---

# Logout Flow

```
User Clicks Logout

↓

Revoke Session

↓

Clear Local State

↓

Redirect To Home
```

---

# Session Management

Session Lifetime

```
Managed By Supabase
```

Access Token

```
Short-Lived
```

Refresh Token

```
Long-Lived
```

Automatic Refresh

```
Enabled
```

---

# Token Lifecycle

```
Login

↓

Access Token

↓

Expiration

↓

Refresh Token

↓

New Access Token
```

---

# Token Storage

Preferred

```
Supabase Auth Session
```

Avoid

```
localStorage
```

Sensitive Data

Never Stored

Inside Browser Storage

---

# Authorization Header

```
Authorization: Bearer <JWT>
```

Sent

With Every Protected Request

---

# JWT Claims

Contains

```
User ID

Role

Email

Expiration

Issuer

Audience
```

Never Trust

Custom Client Claims

Without Validation

---

# Role Resolution

```
JWT

↓

Profile

↓

Role

↓

Permissions

↓

RLS
```

---

# Password Reset

Flow

```
Forgot Password

↓

Email Link

↓

Reset Page

↓

New Password

↓

Login
```

---

# Change Password

Requires

```
Current Password
```

Flow

```
Authenticate

↓

Validate

↓

Update Password

↓

Invalidate Old Sessions
```

---

# Email Change

Flow

```
Authenticate

↓

New Email

↓

Verification

↓

Confirmation

↓

Update Profile
```

---

# Phone Number Update

Requires

```
Authenticated Session
```

Validation

```
Phone Format

Uniqueness
```

---

# Avatar Update

Upload

↓

Supabase Storage

↓

Update Profile

↓

Return Public URL

---

# Account Deactivation

Customer

Can

```
Request Deactivation
```

Owner

Can

```
Deactivate Account
```

Instead Of

```
Permanent Delete
```

---

# Session Revocation

Triggers

- Password Change
- Manual Logout
- Admin Revocation
- Suspicious Activity

---

# Failed Login Protection

Maximum Attempts

```
5 Attempts
```

Lock Duration

```
15 Minutes
```

Log

```
Security Event
```

---

# Multi-Device Sessions

Supported

Each Session Has

- Device Identifier
- Last Activity
- IP Address (Optional)
- Created Time

Users May

```
Revoke Individual Sessions
```

---

# Authentication Middleware

Every Protected Endpoint

Validates

- JWT Signature
- Expiration
- User Exists
- Account Active
- Required Role

---

# Authentication States

| State | Description |
|--------|-------------|
| Anonymous | Not Logged In |
| Authenticated | Logged In |
| Verified | Email Verified |
| Suspended | Access Blocked |
| Deactivated | Account Disabled |

---

# Error Codes

| Code | Meaning |
|------|---------|
| AUTH_INVALID_CREDENTIALS | Invalid Email or Password |
| AUTH_EMAIL_NOT_VERIFIED | Email Not Verified |
| AUTH_ACCOUNT_DISABLED | Account Disabled |
| AUTH_TOKEN_EXPIRED | Session Expired |
| AUTH_UNAUTHORIZED | Login Required |
| AUTH_FORBIDDEN | Permission Denied |

---

# Security Controls

- HTTPS Only
- JWT Validation
- Email Verification
- Strong Password Policy
- Automatic Session Refresh
- Session Revocation
- Rate Limiting
- Audit Logging
- RLS Enforcement
- CSRF Protection (Where Applicable)

---

# Audit Events

Log

- Registration
- Login
- Logout
- Password Reset
- Email Change
- Password Change
- Failed Login
- Session Revocation

---

# Sequence Diagram

```text
User
 │
 │ Login
 ▼
Frontend
 │
 ▼
Supabase Auth
 │
 │ JWT
 ▼
Frontend
 │
 │ Bearer Token
 ▼
Edge Function
 │
 │ Validate JWT
 ▼
PostgreSQL
 │
 │ RLS
 ▼
Response
```

---

# Best Practices

- Never Trust Client Authentication State
- Validate JWT On Every Protected Request
- Keep Access Tokens Short-Lived
- Use Refresh Tokens Securely
- Require Email Verification
- Log Authentication Events
- Revoke Sessions After Sensitive Changes
- Enforce Strong Password Policies
- Keep Business Roles Separate From Authentication
- Delegate Authorization To RLS Whenever Possible

---

# Future Enhancements

- Multi-Factor Authentication (MFA)
- Passkeys (WebAuthn)
- Social Login (Google, Apple)
- Single Sign-On (SSO)
- Enterprise Identity Providers (SAML/OIDC)
- Trusted Device Management
- Risk-Based Authentication
- Adaptive Login Challenges
- Biometric Authentication (Mobile)
- Account Recovery Dashboard