# Folder Structure

**File:** `docs/architecture/02-folder-structure.md`

---

# Purpose

تحديد الهيكل الرسمي للمشروع بحيث يكون:

- Scalable
- Maintainable
- Feature-Based
- Easy To Navigate
- AI Friendly
- Team Friendly

يعتمد المشروع على Feature First Architecture وليس Pages First.

---

# Project Structure

```
project-root/
│
├── docs/
├── public/
├── src/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

# docs/

يحتوي على جميع ملفات التوثيق الخاصة بالمشروع.

```
docs/
│
├── architecture/
├── api/
├── components/
├── database/
├── design/
├── modules/
├── testing/
├── workflows/
└── assets/
```

---

# public/

الملفات الثابتة.

```
public/

favicon.ico

robots.txt

manifest.json

images/

icons/

logos/

banners/

placeholder.webp
```

---

# src/

المجلد الرئيسي للتطبيق.

```
src/

app/

assets/

components/

config/

constants/

features/

hooks/

layouts/

lib/

pages/

router/

services/

stores/

styles/

types/

utils/

validators/
```

---

# app/

تهيئة التطبيق بالكامل.

```
app/

App.tsx

main.tsx

providers.tsx

error-boundary.tsx

query-provider.tsx

theme-provider.tsx

auth-provider.tsx
```

---

# assets/

الأصول الخاصة بالمشروع.

```
assets/

images/

icons/

illustrations/

fonts/

animations/

videos/
```

---

# components/

Reusable Components

```
components/

ui/

forms/

tables/

charts/

layout/

navigation/

feedback/

modals/

cards/

buttons/

inputs/

loaders/

dialogs/

empty-state/

error-state/
```

---

# ui/

Primitive Components

```
ui/

Button

Card

Badge

Avatar

Input

Textarea

Checkbox

Radio

Switch

Tooltip

Popover

Tabs

Dropdown

Accordion

Pagination

Breadcrumb

Skeleton

Spinner

Toast
```

---

# config/

إعدادات المشروع.

```
config/

api.ts

auth.ts

routes.ts

theme.ts

storage.ts

permissions.ts

seo.ts
```

---

# constants/

الثوابت.

```
constants/

roles.ts

permissions.ts

order-status.ts

payment-status.ts

inventory.ts

colors.ts

breakpoints.ts

api.ts
```

---

# features/

أهم مجلد بالمشروع.

كل Feature مستقلة تمامًا.

```
features/

auth/

products/

categories/

cart/

checkout/

orders/

customers/

dashboard/

inventory/

wishlist/

reviews/

offers/

coupons/

reports/

settings/

notifications/

employees/

analytics/
```

---

# Feature Structure

مثال:

```
products/

components/

hooks/

pages/

services/

store/

types/

utils/

schemas/

api/

constants/

index.ts
```

---

# Example

```
products/

components/

ProductCard.tsx

ProductGallery.tsx

ProductPrice.tsx

ProductFilters.tsx

ProductGrid.tsx

ProductToolbar.tsx

ProductReview.tsx

ProductForm.tsx

hooks/

useProducts.ts

useProduct.ts

useFilters.ts

useSearch.ts

pages/

ProductsPage.tsx

ProductDetailsPage.tsx

services/

products.service.ts

store/

products.store.ts

types/

product.ts

category.ts

review.ts

schemas/

product.schema.ts

utils/

price.ts

discount.ts

rating.ts

constants/

product-status.ts

index.ts
```

---

# hooks/

Global Hooks

```
hooks/

useAuth.ts

useTheme.ts

useToast.ts

usePagination.ts

useDebounce.ts

useInfiniteScroll.ts

useMediaQuery.ts

useLocalStorage.ts

useNetwork.ts
```

---

# layouts/

```
layouts/

MainLayout.tsx

AdminLayout.tsx

AuthLayout.tsx

CheckoutLayout.tsx

AccountLayout.tsx
```

---

# lib/

تهيئة المكتبات الخارجية.

```
lib/

supabase.ts

axios.ts

dayjs.ts

zod.ts
```

---

# pages/

صفحات التجميع فقط.

```
pages/

Home.tsx

Categories.tsx

Products.tsx

ProductDetails.tsx

Cart.tsx

Checkout.tsx

TrackOrder.tsx

Account.tsx

Admin.tsx

NotFound.tsx
```

ملاحظة:

لا يحتوي هذا المجلد على Business Logic.

---

# router/

```
router/

index.tsx

public.routes.ts

protected.routes.ts

admin.routes.ts
```

---

# services/

Global Services

```
services/

api.ts

storage.ts

upload.ts

analytics.ts

notification.ts

logger.ts
```

---

# stores/

Global Zustand Stores

```
stores/

auth.store.ts

theme.store.ts

cart.store.ts

notification.store.ts

settings.store.ts
```

---

# styles/

```
styles/

globals.css

tailwind.css

animations.css

variables.css
```

---

# types/

Global Types

```
types/

api.ts

auth.ts

user.ts

order.ts

product.ts

common.ts
```

---

# utils/

```
utils/

currency.ts

date.ts

format.ts

validation.ts

download.ts

upload.ts

pagination.ts

seo.ts

storage.ts
```

---

# validators/

```
validators/

auth.ts

checkout.ts

product.ts

customer.ts

coupon.ts
```

---

# Naming Convention

Components

```
ProductCard.tsx
```

Hooks

```
useProducts.ts
```

Stores

```
cart.store.ts
```

Services

```
products.service.ts
```

Types

```
product.types.ts
```

Schemas

```
product.schema.ts
```

---

# Import Order

```
React

Libraries

Components

Hooks

Services

Stores

Types

Utils

Styles
```

---

# File Naming Rules

Components

PascalCase

Hooks

camelCase

Utilities

camelCase

Constants

kebab-case

Folders

kebab-case

---

# Maximum Folder Depth

Recommended

4 Levels

Maximum

5 Levels

---

# Barrel Files

كل Feature يحتوي على

```
index.ts
```

لتسهيل الاستيراد.

---

# Aliases

```
@

@/app

@/components

@/features

@/hooks

@/services

@/stores

@/utils

@/types

@/config
```

---

# Separation Of Concerns

Components

UI Only

Hooks

Logic

Services

API Calls

Stores

Global State

Utils

Pure Functions

Validators

Validation

Pages

Composition

---

# Forbidden Practices

❌ API Calls داخل Components

❌ Business Logic داخل JSX

❌ Direct Database Access

❌ Deep Relative Imports

❌ Duplicate Components

❌ Shared State داخل Component

❌ Inline Validation

❌ Inline Styles

---

# Best Practices

Feature First Architecture

Atomic Components

Reusable Hooks

Strict TypeScript

Centralized Constants

Centralized Types

Centralized Validation

Code Splitting

Lazy Loading

Tree Shaking

Barrel Exports

Small Components

Single Responsibility Principle

Dependency Injection Where Needed

Documentation Driven Development

---

# Future Expansion

هيكل المشروع يسمح بإضافة:

- Mobile App (React Native)
- ERP Module
- POS Module
- Multi-Tenant Support
- Multi-Branch Management
- Warehouse Management
- Shipping Integrations
- Payment Gateways
- AI Recommendation Engine
- CRM
- Marketing Automation

بدون إعادة هيكلة المشروع.