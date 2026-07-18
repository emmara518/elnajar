# State Management Architecture

**File:** `docs/architecture/04-state-management.md`

---

# Purpose

يوضح هذا المستند كيفية إدارة حالة التطبيق (Application State) لضمان:

- Predictable State
- High Performance
- Minimal Re-renders
- Offline Ready
- Easy Debugging
- Scalable Architecture

---

# State Management Stack

Global State

Zustand

---

Server State

TanStack Query

---

Form State

React Hook Form

---

Validation

Zod

---

URL State

React Router

Search Params

---

Theme State

Zustand Persist

---

Authentication State

Supabase Auth

+

Zustand

---

# State Classification

Application State

↓

Server State

↓

UI State

↓

Local State

↓

Persistent State

---

# State Responsibilities

## Global State

Used For

Authentication

Shopping Cart

Theme

Notifications

Settings

Current User

Language

Permissions

---

## Server State

Used For

Products

Categories

Orders

Customers

Inventory

Reports

Reviews

Offers

Coupons

Analytics

---

## Local Component State

Used For

Modal

Dropdown

Accordion

Tooltip

Hover

Temporary Inputs

Animations

---

## Form State

Used For

Checkout

Login

Register

Profile

Product Form

Coupon Form

Address Form

---

# Store Architecture

```
stores/

auth.store.ts

cart.store.ts

theme.store.ts

settings.store.ts

notification.store.ts
```

---

# Feature Stores

Each Feature Can Have

```
features/

products/

store/

products.store.ts

orders/

store/

orders.store.ts

dashboard/

store/

dashboard.store.ts
```

---

# Auth Store

Responsibilities

User

Session

Token

Role

Permissions

Authentication Status

Refresh Session

Logout

---

State

```
user

session

role

permissions

isAuthenticated

isLoading

error
```

---

Actions

```
login()

logout()

refresh()

setUser()

clearSession()

updateProfile()
```

---

# Cart Store

Responsibilities

Cart Items

Totals

Discounts

Coupon

Shipping Estimate

---

State

```
items

subtotal

discount

shipping

tax

total

coupon

loading
```

---

Actions

```
addItem()

removeItem()

increase()

decrease()

clear()

applyCoupon()

removeCoupon()

calculate()
```

---

# Theme Store

State

```
theme

darkMode

primaryColor

fontSize
```

Actions

```
toggleTheme()

changeColor()

reset()
```

---

# Notification Store

State

```
notifications

unreadCount

loading
```

Actions

```
add()

remove()

markRead()

clear()
```

---

# Settings Store

State

```
language

currency

country

measurement

preferences
```

Actions

```
changeLanguage()

changeCurrency()

updatePreferences()
```

---

# Server State

Managed By

TanStack Query

---

Queries

Products

Categories

Orders

Customers

Reports

Inventory

Reviews

Offers

Coupons

---

Mutations

Create

Update

Delete

Approve

Cancel

Upload

Restore

---

# Query Keys

```
products

product

categories

orders

customers

inventory

reports

dashboard

analytics

settings

profile
```

---

Examples

```
["products"]

["products", category]

["product", slug]

["orders", id]

["dashboard"]

["reports", month]
```

---

# Cache Strategy

Products

10 Minutes

---

Categories

1 Hour

---

Settings

24 Hours

---

Dashboard

2 Minutes

---

Reports

5 Minutes

---

Profile

15 Minutes

---

# Cache Invalidation

After

Create Product

↓

Invalidate Products

---

Update Product

↓

Invalidate Product

↓

Invalidate Products

---

Delete Product

↓

Invalidate Products

---

Checkout

↓

Invalidate Cart

↓

Invalidate Orders

↓

Invalidate Dashboard

---

# Optimistic Updates

Used In

Wishlist

Cart

Notifications

Reviews

Profile

---

Rollback

If Mutation Fails

↓

Restore Previous Cache

---

# Forms

Managed By

React Hook Form

---

Validation

Zod

---

Forms

Login

Register

Checkout

Address

Product

Coupon

Settings

Employee

---

Form Lifecycle

Initialize

↓

Validate

↓

Submit

↓

Server Validation

↓

Success

↓

Reset

---

# URL State

Managed By

Search Params

---

Examples

```
?page=2

?sort=price

?category=paper

?q=foam

?brand=abc
```

---

# Persistent State

Persisted

Theme

Cart

Language

Currency

Preferences

---

Not Persisted

JWT

Sensitive Tokens

Permissions

Temporary Forms

Server Cache

---

# Offline Strategy

Persist

Cart

Theme

Language

Pending Actions

---

Sync

When Connection Returns

---

# Derived State

Never Stored

Calculated

Examples

```
Cart Total

Discount

Remaining Stock

Average Rating

Order Count

Dashboard Metrics
```

---

# Loading State

Global Loading

Route Loading

Mutation Loading

Form Loading

Upload Loading

Skeleton Loading

---

# Error State

Network Error

Validation Error

Permission Error

Authentication Error

Timeout

Server Error

---

# State Flow

```
User Action

↓

Store Action

↓

API

↓

Mutation

↓

Database

↓

Response

↓

Cache Update

↓

UI Update
```

---

# Dependency Rules

Components

↓

Hooks

↓

Stores

↓

Services

↓

API

---

Components Never Call

Database

Supabase Client

Direct SQL

---

# Naming Convention

Stores

```
cart.store.ts

auth.store.ts
```

Actions

```
addItem()

removeItem()

checkout()
```

Selectors

```
useCart()

useAuth()

useTheme()
```

---

# Performance Rules

Use Selectors

Avoid Large Stores

Normalize State

Memoize Components

Split Feature Stores

Avoid Nested Objects

Avoid Duplicate State

---

# Security

Never Store

Passwords

Access Tokens

Refresh Tokens

Sensitive Payment Data

OTP Codes

CVV

---

# Testing

Unit Test

Store Actions

Selectors

Mutations

Cache

Optimistic Updates

Persistence

---

# Debugging

Redux DevTools Middleware

Query Devtools

Logger Middleware

Error Boundary

Development Only

---

# Best Practices

Single Source Of Truth

Minimal Global State

Keep Server State On Server

Keep UI State Local

Avoid State Duplication

Feature Isolation

Immutable Updates

Typed Stores

Persistent Only When Necessary

---

# Future Expansion

Realtime Synchronization

Offline Queue

Background Sync

Multi-Tab Synchronization

Cross Device Sync

Realtime Dashboard

WebSocket Integration

Conflict Resolution Engine