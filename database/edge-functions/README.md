# TOKYO Store — Edge Functions

## Overview

Supabase Edge Functions (Deno / TypeScript) that implement the business logic layer of the POS/ERP system. Each function follows the domain service patterns defined in `src/domain/services/` and communicates with the database via the `supabase-js` client.

## Structure

```
edge-functions/
├── auth/
│   ├── sign-up.ts           — User registration via Supabase Auth
│   ├── sign-in.ts           — Authenticate user, return JWT
│   └── verify.ts            — Email verification confirmation
├── employees/
│   ├── create.ts            — Create new employee record + user account
│   ├── update.ts            — Update employee profile, role, or branch
│   └── list.ts              — List employees by branch with role info
├── sales/
│   ├── create.ts            — Record a new sale (items, payments, tax)
│   ├── confirm.ts           — Confirm a pending sale (finalize transaction)
│   ├── cancel.ts            — Cancel/void a sale, restore inventory
│   └── list.ts              — List sales by shift ID or branch + date range
├── inventory/
│   ├── adjust.ts            — Adjust stock (write-off, correction, damage)
│   ├── transfer.ts          — Transfer stock between two branches
│   └── check.ts             — Check stock availability across all branches
├── reports/
│   ├── daily.ts             — Daily sales summary (revenue, items, tax)
│   ├── inventory.ts         — Inventory valuation and stock status report
│   └── cash-flow.ts         — Cash flow report (open/close balances, payments)
└── notifications/
    ├── send.ts              — Create and push a notification to a user
    └── list.ts              — List notifications for the authenticated user
```

## Conventions

| Concern              | Convention                                                       |
| -------------------- | ---------------------------------------------------------------- |
| **Runtime**          | Deno with `supabase-js` v2                                      |
| **HTTP Methods**     | `POST` for mutations, `GET` for queries                         |
| **Auth**             | JWT extracted from `Authorization: Bearer <token>` header       |
| **CORS**             | All functions include CORS headers for browser access            |
| **Input Validation** | Zod schemas at the top of each function                         |
| **Error Handling**   | Structured JSON response: `{ error: { code, message, details }}` |
| **Logging**          | `console.log` / `console.error` — captured in Supabase logs     |
| **Secrets**          | Access via `Deno.env.get()` — never hardcoded                    |

## Standard Response Format

```typescript
// Success
{
  "data": { ... },
  "status": 200
}

// Error
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Product XPS15-9530-SLV has only 2 units available",
    "details": { "sku": "XPS15-9530-SLV", "available": 2, "requested": 5 }
  },
  "status": 400
}
```

## CORS Template

Every edge function includes this CORS handler:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  // ... handler logic
});
```

## Development

```bash
# Serve functions locally
supabase functions serve --env-file ./supabase/.env.local

# Deploy a single function
supabase functions deploy sales/create --project-ref <ref>

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=<key>
```

## Dependencies

- `https://esm.sh/supabase-js` — Database client
- `https://deno.land/x/zod` — Input validation
- `https://deno.land/std` — Standard library utilities
