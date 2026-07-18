# TOKYO Store — Migration Strategy

## Overview

Database migrations are sequentially numbered, additive-only SQL files applied via the Supabase migration CLI. Every schema change goes through a controlled pipeline from development → staging → production.

---

## File Naming

```
[number]_[descriptive_name].sql
```

| Component        | Convention                        | Example                |
| ---------------- | --------------------------------- | ---------------------- |
| **Number**       | 4-digit zero-padded sequence      | `0001`, `0002`         |
| **Separator**    | Underscore                        | `_`                    |
| **Name**         | Lowercase snake_case, descriptive | `create_initial_schema` |

**Examples:**
```
0001_create_initial_schema.sql
0002_add_product_categories.sql
0003_add_rls_policies.sql
0004_add_inventory_triggers.sql
```

---

## Storage Location

```
supabase/
└── migrations/
    ├── 0001_create_initial_schema.sql
    ├── 0002_add_product_categories.sql
    ├── 0003_add_rls_policies.sql
    └── ...
```

---

## Applying Migrations

### Local Development

```bash
# Apply all pending migrations to local DB
supabase db push

# Apply a specific migration
supabase db push --version 0003

# Check migration status
supabase migration list
```

### Staging / Production

```bash
# Link local project to remote Supabase project
supabase link --project-ref <project-ref>

# Push migrations to remote
supabase db push

# Or for production, dry-run first
supabase db push --dry-run
```

### Migration Tracking

Supabase maintains a `_supabase_migrations` table that tracks which migrations have been applied:

```sql
SELECT * FROM _supabase_migrations ORDER BY version;
```

---

## Core Principles

| Principle        | Rule                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| **Additive only** | Never modify or drop a column/table that exists in production. Use `ALTER TABLE ADD COLUMN` instead of `DROP`. |
| **Idempotent**    | Use `IF NOT EXISTS`, `IF EXISTS`, `CREATE OR REPLACE` for all DDL.  |
| **Reversible**    | Each migration includes a `-- DOWN` comment block for manual rollback. |
| **Tested**        | Every migration is applied to staging at least 24 hours before production. |
| **Documented**    | Each migration file includes a header comment explaining the purpose. |

---

## Migration Template

```sql
-- ============================================================================
-- Migration: 0001_create_initial_schema.sql
-- Purpose: Create core tables for TOKYO Store POS/ERP system
-- Applied: 2025-01-15
-- ============================================================================

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create enums
CREATE TYPE movement_type AS ENUM (
  'receipt', 'sale', 'adjustment', 'transfer_out', 'transfer_in'
);

-- 3. Create tables
CREATE TABLE companies (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL,
  -- ...
);

-- ============================================================================
-- DOWN: Reverse this migration
-- ============================================================================
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TYPE IF EXISTS movement_type;
```

---

## Rollback Strategy

Rollbacks are **manual** — never automated in production. To reverse a migration:

```sql
-- 1. Execute the DOWN block from the migration file
-- 2. Remove the row from _supabase_migrations
DELETE FROM _supabase_migrations WHERE version = '0003';
-- 3. Verify the rollback
```

**Best Practice**: Instead of rolling back, create a new forward migration that reverts the change. This preserves the audit trail.

---

## Migration Testing Checklist

Before applying to production, verify on staging:

| Check                  | Command / Action                                                |
| ---------------------- | --------------------------------------------------------------- |
| Apply migration        | `supabase db push`                                              |
| Verify schema          | `\dt`, `\d table_name` in psql                                  |
| Verify indexes         | `SELECT * FROM pg_indexes WHERE tablename = 'table_name';`      |
| Run seed data          | `psql -f seeds/seed_data.sql`                                   |
| Run tests              | `npm run test`                                                   |
| Check RLS policies     | `SELECT * FROM pg_policies;`                                    |
| Performance check      | `EXPLAIN ANALYZE` on key queries                                 |
| Rollback test          | Execute DOWN block, verify reversal                             |

---

## Migration History Log

Each production migration is recorded:

| Version | Date       | Author  | Description              |
| ------- | ---------- | ------- | ------------------------ |
| 0001    | 2025-01-15 | Admin   | Initial schema creation  |
| 0002    | 2025-02-01 | Admin   | Add product categories   |
| 0003    | 2025-02-15 | Admin   | Add RLS policies         |
| ...     | ...        | ...     | ...                      |
