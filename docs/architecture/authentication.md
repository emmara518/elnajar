# Authentication Architecture

**File:** `docs/architecture/06-authentication.md`

---

# Purpose

يوضح هذا المستند آلية المصادقة (Authentication) المستخدمة داخل النظام، وكيفية تسجيل الدخول، إدارة الجلسات، حماية الحسابات، وتجديد الجلسات.

الهدف هو توفير نظام Authentication آمن، قابل للتوسع، ومتوافق مع أفضل الممارسات الأمنية.

---

# Authentication Provider

Supabase Auth

Authentication Type

JWT Based Authentication

Session Management

Supabase Session

Identity Provider

Email & Password

Future Ready

- Google OAuth
- Facebook OAuth
- Apple Sign-In
- Microsoft Login

---

# Authentication Flow

```
User

↓

Login Form

↓

Client Validation

↓

Supabase Auth

↓

JWT Token

↓

Session Created

↓

Fetch User Profile

↓

Load Permissions

↓

Redirect
```

---

# Login Flow

```
Enter Email

↓

Enter Password

↓

Client Validation

↓

Server Validation

↓

Authentication

↓

JWT Generated

↓

Session Stored

↓

Load User Profile

↓

Navigate Dashboard / Account
```

---

# Registration Flow

```
User Registration

↓

Validate Inputs

↓

Create Auth User

↓

Create Profile Record

↓

Assign Default Role

↓

Send Email Verification

↓

Login After Verification
```

---

# Password Reset Flow

```
Forgot Password

↓

Enter Email

↓

Reset Email Sent

↓

Open Reset Link

↓

New Password

↓

Password Updated

↓

Login
```

---

# Email Verification Flow

```
Register

↓

Verification Email

↓

Click Link

↓

Email Confirmed

↓

Account Activated
```

---

# Authentication States

Unauthenticated

↓

Authenticating

↓

Authenticated

↓

Refreshing Session

↓

Expired

↓

Logged Out

---

# Session Lifecycle

```
Login

↓

Session Created

↓

User Activity

↓

Refresh Token

↓

Continue Session

↓

Logout

↓

Destroy Session
```

---

# Session Data

The authenticated session contains:

```
User ID

Email

Role

Permissions

Access Token

Refresh Token

Expires At
```

---

# Auth Store

Managed By

Zustand

State

```ts
user

session

role

permissions

isAuthenticated

isLoading

error
```

Actions

```ts
login()

logout()

refreshSession()

loadProfile()

clearSession()

updateProfile()
```

---

# User Roles

Customer

Admin

Owner

Future

Employee

Warehouse Manager

Sales Manager

Delivery Agent

---

# Default Role

New Registered User

↓

Customer

---

# Authentication Guards

Public Routes

No Authentication Required

Protected Routes

Authentication Required

Admin Routes

Authentication + Role Required

Owner Routes

Authentication + Owner Role Required

---

# Login Validation

Client Validation

- Required Email
- Required Password
- Email Format
- Minimum Password Length

Server Validation

- User Exists
- Password Correct
- Email Verified
- Account Active

---

# Password Policy

Minimum Length

8 Characters

Recommended

12+

Must Include

- Uppercase
- Lowercase
- Number
- Special Character

Disallow

- Common Passwords
- User Email
- Sequential Characters

---

# Session Expiration

Access Token

Managed By Supabase

Refresh Token

Automatic

Inactive Sessions

Expire Automatically

---

# Remember Me

Supported

Behavior

Persistent Session Until Logout

---

# Logout Flow

```
User Clicks Logout

↓

Invalidate Session

↓

Clear Local State

↓

Clear Cached Data

↓

Redirect Login
```

---

# Account Lock Policy

Failed Attempts

5 Consecutive Attempts

↓

Temporary Lock

15 Minutes

↓

Allow Retry

Future Enhancement

Progressive Delay

CAPTCHA

---

# Multi Device Support

Supported

Each Device Has

Independent Session

Independent Refresh Token

Independent Logout

---

# Concurrent Sessions

Allowed

Future Option

Admin Can Force Logout All Devices

---

# User Profile Loading

After Authentication

↓

Fetch Profile

↓

Fetch Role

↓

Fetch Permissions

↓

Load Preferences

↓

Initialize Application

---

# Route Protection

```
Guest

↓

Protected Route

↓

Authenticated?

↓

YES

↓

Role Check

↓

Allowed?

↓

Render

↓

NO

↓

403

↓

NOT AUTHENTICATED

↓

Redirect Login
```

---

# Authentication Errors

401 Unauthorized

Invalid Credentials

Email Not Verified

Session Expired

Account Disabled

Too Many Login Attempts

Network Failure

---

# Token Storage

Managed By

Supabase Auth

Application Stores

- User Metadata
- Role
- UI State

Never Store

- Password
- Raw Credentials
- OTP
- Security Answers

---

# Secure Communication

HTTPS Required

JWT Authorization

Encrypted Traffic

No Plain Text Credentials

---

# Authentication Events

Login

Logout

Session Refresh

Password Reset

Profile Update

Email Verification

Failed Login

Account Locked

---

# Audit Logging

Record

- Login Time
- Logout Time
- Failed Login Attempts
- Password Changes
- Email Changes
- Session Refresh
- Device Information
- IP Address (Server Side)

---

# Recovery Scenarios

Session Expired

↓

Refresh Automatically

If Refresh Fails

↓

Redirect Login

Network Lost

↓

Retry Session Validation

Server Unavailable

↓

Display Friendly Error

---

# Testing Requirements

Unit Tests

- Login
- Logout
- Session Refresh
- Password Reset

Integration Tests

- Protected Routes
- Role Loading
- Session Recovery

Security Tests

- Invalid Token
- Expired Token
- Tampered Token
- Unauthorized Access

---

# Performance Considerations

Lazy Load Protected Areas

Cache User Profile

Avoid Duplicate Profile Requests

Refresh Session Silently

Minimize Authentication Requests

---

# Security Best Practices

- HTTPS Only
- Strong Password Policy
- Email Verification Required
- JWT Validation On Every Request
- Automatic Session Refresh
- Secure Logout
- No Sensitive Data In Local Storage
- Audit Authentication Events
- Rate Limit Login Attempts
- Never Trust Client Authentication State

---

# Future Expansion

- Google OAuth
- Apple Sign-In
- Facebook Login
- Microsoft Login
- Two-Factor Authentication (2FA)
- Passkeys (WebAuthn)
- Biometric Authentication
- Single Sign-On (SSO)
- Enterprise Identity Providers
- Device Trust Management
- Session Management Dashboard