# TOKYO Store — Scaling Strategy

## Overview

This document outlines the future scaling strategy for the TOKYO Store POS/ERP database. The current single-tenant schema is designed to evolve incrementally as the business grows — more branches, higher transaction volume, and eventual multi-company support.

---

## 1. Partitioning

### Target Tables

| Table              | Partition Key                 | Strategy     | Reason                          |
| ------------------ | ----------------------------- | ------------ | ------------------------------- |
| `sales`            | `created_at`                  | Range/Month  | High write volume; time-series  |
| `sale_items`       | `sale_id` (inherits parent)   | Range/Month  | Follows sales partitioning      |
| `stock_movements`  | `created_at`                  | Range/Month  | Append-only; time-series        |

### Example

```sql
CREATE TABLE sales (
  id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- ... other columns
) PARTITION BY RANGE (created_at);

CREATE TABLE sales_2025_01 PARTITION OF sales
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE sales_2025_02 PARTITION OF sales
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Partition Management

```sql
-- Create monthly partitions proactively (6 months ahead)
-- Detach old partitions for archival
ALTER TABLE sales DETACH PARTITION sales_2023_01;
```

---

## 2. Read Replicas

### Architecture

```
                  ┌──────────────┐
                  │  Primary DB  │ (writes)
                  └──────┬───────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────┴───┐ ┌───┴────┐ ┌───┴────┐
         │Replica 1│ │Replica 2│ │Replica 3│
         └────────┘ └────────┘ └────────┘
              │          │          │
         Reports    Analytics   Dashboard
```

### Routing Rules

| Query Type          | Target    | Reason                          |
| ------------------- | --------- | ------------------------------- |
| POS transactions    | Primary   | Must read latest data           |
| Inventory checks    | Replica   | Eventually consistent OK         |
| Daily reports       | Replica   | Heavy aggregation, no real-time  |
| Admin dashboards    | Replica   | Read-only, historical data       |

### Supabase Implementation

Supabase Pro plan supports up to 5 read replicas. Connection strings:

```bash
# Primary (writes)
DATABASE_URL="postgresql://postgres:...@aws-0-{region}.pooler.supabase.com:6543/postgres"

# Read replica (queries)
DATABASE_URL_REPLICA="postgresql://postgres:...@aws-0-{region}.pooler.supabase.com:6543/postgres?options=project%3D<ref>&replica=true"
```

---

## 3. Connection Pooling

### Pooler Configuration (pgBouncer)

| Mode             | Use Case                  | Transaction Pooling? |
| ---------------- | ------------------------- | -------------------- |
| Transaction mode| Default                   | Yes (release after TXN) |
| Session mode     | Long-running queries      | No                   |

### Supabase Pooler

Supabase provides built-in connection pooling. Pooled connection URLs:

```bash
# Transaction mode (default)
postgresql://postgres:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres

# Session mode
postgresql://postgres:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres?pgbouncer_mode=session
```

### Max Connections

| Service           | Plan Limit | Pooled      |
| ----------------- | ---------- | ----------- |
| Supabase Pooler   | 15 direct  | ~200 pooled |
| Application       | —          | Use pooler  |
| Edge Functions    | —          | Use pooler  |

---

## 4. Caching (Redis)

### Caching Layer

```bash
supabase redis create --name tokyo-cache --tier mini
```

### Cache Strategy

| Data                         | TTL        | Invalidation Trigger          |
| ---------------------------- | ---------- | ----------------------------- |
| Product catalog              | 5 minutes  | Product update                |
| Inventory counts (per branch)| 30 seconds | Stock movement                |
| Active shifts                | 1 minute   | Shift open/close              |
| Settings                     | 1 hour     | Settings changed              |
| Customer lookups             | 1 hour     | Customer update               |

### Application Pattern

```typescript
// Cache-aside pattern
async function getProduct(sku: string) {
  const cached = await redis.get(`product:${sku}`);
  if (cached) return JSON.parse(cached);

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('sku', sku)
    .single();

  await redis.set(`product:${sku}`, JSON.stringify(data), { ex: 300 });
  return data;
}
```

---

## 5. Sharding (Future — Multi-Company)

### Company ID Prefix

Every table includes a `company_id` column. Future sharding can use this as a shard key:

```sql
-- Example shard routing function
CREATE OR REPLACE FUNCTION get_shard_for_company(company_id uuid)
RETURNS integer AS $$
  SELECT ABS(('x' || substr(company_id::text, 1, 8))::bit(32)::int) % 4 + 1;
$$ LANGUAGE sql IMMUTABLE;
```

### Shard Mapping

```yaml
shard_1: companies 1-100 (TOKYO Store)
shard_2: companies 101-200
shard_3: companies 201-300
shard_4: future growth
```

### Migration Path

1. Add `company_id` to all tables (already done for core tables)
2. Update RLS policies to filter by `company_id`
3. Extract company-specific data into shards
4. Route queries based on shard key

---

## 6. Data Archival

### Archival Target

Records older than **2 years** from `sales`, `sale_items`, `stock_movements`.

### Process

```sql
-- 1. Create archive table (same structure)
CREATE TABLE sales_archive (LIKE sales INCLUDING ALL);

-- 2. Move records
WITH archived AS (
  DELETE FROM sales
  WHERE created_at < NOW() - INTERVAL '2 years'
  RETURNING *
)
INSERT INTO sales_archive SELECT * FROM archived;

-- 3. Export to cold storage
COPY sales_archive TO '/tmp/sales_archive_2023.csv' CSV HEADER;
```

### Cold Storage Formats

| Format   | Compression | Retention |
| -------- | ----------- | --------- |
| CSV + gz | ~80%        | 7 years   |
| Parquet  | ~85%        | 7 years   |

---

## 7. Materialized Views

### Refresh Strategy

```sql
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT
  date_trunc('day', s.created_at) AS sale_date,
  b.code AS branch_code,
  COUNT(*) AS transaction_count,
  SUM(s.total_amount) AS total_revenue,
  SUM(s.tax_amount) AS total_tax,
  COUNT(DISTINCT s.customer_id) AS unique_customers
FROM sales s
JOIN branches b ON b.id = s.branch_id
WHERE s.status = 'confirmed'
GROUP BY 1, 2;

-- Refresh every 15 minutes
CREATE OR REPLACE FUNCTION refresh_daily_sales_summary()
RETURNS void AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
$$ LANGUAGE sql;
```

### View Inventory

| Materialized View           | Refresh     | Used By                     |
| --------------------------- | ----------- | --------------------------- |
| `daily_sales_summary`       | 15 min      | Dashboard, reports          |
| `inventory_valuation`       | 1 hour      | Accounting                  |
| `branch_performance`        | 1 hour      | Branch manager dashboard    |
| `low_stock_alerts`          | 5 min       | Inventory clerk alerts      |

---

## Scaling Roadmap

| Phase | Timeline | Action                                       |
| ----- | -------- | -------------------------------------------- |
| 1     | Now      | Connection pooling via Supabase pooler       |
| 2     | 3 months | Application-level Redis caching              |
| 3     | 6 months | Table partitioning for sales + movements     |
| 4     | 12 months| Read replicas for reporting queries          |
| 5     | 18 months| Data archival for records > 2 years          |
| 6     | 24 months| Multi-company sharding (if needed)           |
