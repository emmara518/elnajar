# TOKYO Store — Performance Strategy

---

## 1. Index Strategy

### Primary Indexes (Covered in `indexes/performance_indexes.sql`)

#### Query Patterns

| Pattern                    | Index                          | Type        |
| -------------------------- | ------------------------------ | ----------- |
| Lookup by SKU              | `idx_products_sku`             | UNIQUE BTREE |
| Lookup by barcode          | `idx_products_barcode`         | UNIQUE BTREE |
| Products by category       | `idx_products_category`        | BTREE       |
| Active products only       | `idx_products_active`          | PARTIAL BTREE (WHERE is_active) |
| Sales by branch + date     | `idx_sales_branch_created`     | COMPOSITE BTREE (branch_id, created_at) |
| Sales by shift             | `idx_sales_shift`              | BTREE       |
| Sale items by sale         | `idx_sale_items_sale`          | BTREE       |
| Payments by sale           | `idx_payments_sale`            | BTREE       |
| Inventory by branch        | `idx_inventory_branch`         | BTREE       |
| Inventory by product       | `idx_inventory_product`        | BTREE       |
| Stock movements by item    | `idx_stock_movements_item`     | BTREE       |
| Stock movements by date    | `idx_stock_movements_created`  | BTREE       |
| Employees by branch        | `idx_employees_branch`         | BTREE       |
| Customers by email         | `idx_customers_email`          | BTREE       |
| Roles by slug              | `idx_roles_slug`               | UNIQUE BTREE |
| Settings by company + key  | `idx_settings_company_key`     | UNIQUE COMPOSITE |
| Shifts by employee + status| `idx_shifts_employee_status`   | PARTIAL BTREE (WHERE status = 'open') |

### Index Creation Pattern

```sql
CREATE UNIQUE INDEX idx_products_sku ON products(sku) WHERE is_active = true;
CREATE INDEX idx_sales_branch_created ON sales(branch_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_inventory_branch ON inventory_items(branch_id);
```

---

## 2. Query Optimization

### Methodology

1. Identify slow queries via `pg_stat_statements`
2. Run `EXPLAIN ANALYZE` on candidate queries
3. Add missing indexes or rewrite the query
4. Re-test with `EXPLAIN ANALYZE`
5. Monitor for regressions

### Common Anti-Patterns

| Anti-Pattern                         | Fix                              |
| ------------------------------------ | -------------------------------- |
| `SELECT *` on wide tables            | Select only needed columns       |
| `OFFSET` + `LIMIT` pagination        | Use keyset pagination            |
| N+1 queries in loops                 | Batch into single query          |
| `COUNT(*)` on large tables           | Use approximate count or materialized view |
| Unnecessary `JOIN` on unindexed FK   | Add FK index                     |
| `WHERE func(column) = value`         | Create expression index          |

---

## 3. Connection Pooling

### Configuration (pgBouncer)

```ini
[databases]
postgres = host=localhost port=5432 dbname=tokyo_store

[pgbouncer]
pool_mode = transaction
max_client_conn = 200
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3.0
server_reset_query = DISCARD ALL
```

### Connection String

```bash
# Application connects to pooler, not directly to PostgreSQL
DATABASE_URL="postgresql://postgres:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres"
```

### Pool Usage

| Application Component | Pool Preference          |
| --------------------- | ------------------------ |
| POS Frontend          | Transaction pool         |
| Admin Dashboard       | Transaction pool         |
| Reports (heavy)       | Session pool (or replica)|
| Edge Functions        | Transaction pool         |
| Cron Jobs             | Session pool             |

---

## 4. Vacuum & Autovacuum

### Current Configuration (Supabase Default)

```sql
-- Autovacuum is ON by default
-- Verify settings
SELECT name, setting FROM pg_settings
WHERE name LIKE 'autovacuum%';

-- Key settings
-- autovacuum_vacuum_threshold = 50
-- autovacuum_vacuum_scale_factor = 0.2
-- autovacuum_analyze_threshold = 50
-- autovacuum_analyze_scale_factor = 0.1
```

### High-Write Tables — Tuned Autovacuum

```sql
ALTER TABLE sales SET (
  autovacuum_vacuum_threshold = 1000,
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_threshold = 500,
  autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE stock_movements SET (
  autovacuum_vacuum_threshold = 1000,
  autovacuum_vacuum_scale_factor = 0.05
);
```

### Manual Vacuum

```sql
-- Analyze for query planner
ANALYZE sales;
ANALYZE inventory_items;

-- Vacuum high-write tables (low-trafik hours)
VACUUM ANALYZE sales;
VACUUM ANALYZE stock_movements;
```

---

## 5. Monitoring (pg_stat_statements)

### Enable Extension

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

### Key Queries

```sql
-- Top 10 queries by total execution time
SELECT
  queryid,
  LEFT(query, 100) AS query_preview,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time AS avg_ms,
  rows,
  shared_blks_hit::numeric / (shared_blks_hit + shared_blks_read)::numeric * 100 AS hit_ratio
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Queries with worst average execution time
SELECT
  queryid,
  LEFT(query, 100) AS query_preview,
  calls,
  mean_exec_time AS avg_ms
FROM pg_stat_statements
WHERE calls > 100
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Index usage stats
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC
LIMIT 20;  -- Least-used indexes (candidates for removal)
```

### Performance Alerts

| Metric                      | Threshold                | Action                         |
| --------------------------- | ------------------------ | ------------------------------ |
| Query execution time        | > 500ms avg              | Optimize query / add index     |
| Cache hit ratio             | < 95%                    | Increase `shared_buffers`      |
| Index scan count            | < 100 in 24h             | Consider dropping unused index |
| Connection pool utilization | > 80%                    | Increase `default_pool_size`   |
| Dead tuple ratio            | > 20%                    | Manual VACUUM needed           |

---

## 6. Caching Layer (Application-Level)

### Cache Targets

| Data            | TTL        | Cache Key Pattern                | Storage       |
| --------------- | ---------- | -------------------------------- | ------------- |
| Product catalog | 5 min      | `product:{sku}`                  | Redis / In-memory |
| Active settings | 1 hour     | `setting:{company_id}:{key}`     | Redis         |
| Branch list     | 10 min     | `branches:{company_id}`          | Redis         |
| Category tree   | 1 hour     | `categories`                     | Redis         |
| Employee role   | 15 min     | `role:{employee_id}`             | Redis         |

### Cache-Aside Implementation

```typescript
async function getFromCacheOrDB<T>(key: string, fetch: () => Promise<T>, ttl: number): Promise<T> {
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetch();
  await cache.set(key, JSON.stringify(data), { ex: ttl });
  return data;
}
```

### Invalidation Events

| Event              | Cache Keys to Invalidate                      |
| ------------------ | --------------------------------------------- |
| Product updated    | `product:{sku}`, `products:category:{id}`     |
| Settings changed   | `setting:{company_id}:*`                       |
| Stock movement     | `inventory:{branch_id}:{product_id}`          |
| Branch created     | `branches:{company_id}`                       |

---

## 7. Pagination

### Keyset Pagination (Recommended)

```sql
-- First page
SELECT id, name, retail_price
FROM products
WHERE is_active = true
ORDER BY name ASC, id ASC
LIMIT 20;

-- Next page (pass last_seen_name, last_seen_id from previous page)
SELECT id, name, retail_price
FROM products
WHERE is_active = true
  AND (name, id) > ('MacBook Air M3', 'uuid-from-last-row')
ORDER BY name ASC, id ASC
LIMIT 20;
```

### Why Not OFFSET

| Approach            | Performance on Large Dataset          |
| ------------------- | ------------------------------------- |
| `OFFSET 100000`     | Must scan + sort all rows, then skip  |
| Keyset (`WHERE >`)  | Uses index, constant-time per page    |

### When OFFSET Is Acceptable

- Admin panels with small result sets (< 1000 rows)
- Dropdown selectors
- Internal tools where simplicity > performance

---

## 8. Performance Budget

| Operation               | Max Time     | Notes                |
| ----------------------- | ------------ | -------------------- |
| POS sale creation       | 200ms        | Must feel instant    |
| Product search          | 100ms        | Typing autocomplete  |
| Inventory check         | 50ms         | F5 stock lookup      |
| Daily report            | 2 seconds    | Background generation|
| Admin dashboard load    | 3 seconds    | Full page render     |
| Monthly report          | 10 seconds   | Scheduled, async     |
