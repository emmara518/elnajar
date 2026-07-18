# TOKYO Store — Backup Strategy

## Overview

Multi-layered backup strategy ensuring business continuity and disaster recovery for the TOKYO Store POS/ERP system. Backups run at the PostgreSQL database level (via `pg_dump`) and Supabase storage level. The system is single-tenant; all backups are company-wide.

## Backup Schedule

### Daily Backups

| Property       | Detail                                |
| -------------- | ------------------------------------- |
| **When**       | Every day at 03:00 AM (store closed)  |
| **Method**     | `pg_dump --format=custom`             |
| **Scope**      | Full database dump                    |
| **Retention**  | 7 days (files auto-purged)            |
| **Location**   | Supabase storage bucket `backups/`    |
| **Filename**   | `daily/tokyo-{YYYY-MM-DD}.dump`       |

### Weekly Backups

| Property       | Detail                                      |
| -------------- | ------------------------------------------- |
| **When**       | Every Sunday at 04:00 AM                    |
| **Method**     | `pg_dump --format=custom` + `supabase storage cp` |
| **Scope**      | Full database + all storage bucket snapshots |
| **Retention**  | 4 weeks                                     |
| **Location**   | Supabase storage bucket `backups/weekly/`    |
| **Filename**   | `weekly/tokyo-{YYYY}-W{WW}.dump`            |

### Monthly Backups

| Property       | Detail                                          |
| -------------- | ----------------------------------------------- |
| **When**       | 1st of every month at 05:00 AM                  |
| **Method**     | `pg_dump --format=custom` + full storage sync   |
| **Scope**      | Full database + all storage buckets             |
| **Retention**  | 12 months                                       |
| **Location**   | Supabase storage bucket `backups/monthly/` + offsite cold storage |
| **Filename**   | `monthly/tokyo-{YYYY-MM}.dump`                  |

## Offsite Cold Storage

Monthly backups are additionally downloaded and transferred to offsite cold storage (e.g., AWS S3 Glacier or Google Cloud Archive). This protects against total Supabase account loss.

```bash
# Download monthly backup from Supabase storage
supabase storage cp supabase://backups/monthly/tokyo-2025-01.dump ./cold-storage/

# Upload to S3 Glacier
aws s3 cp ./cold-storage/tokyo-2025-01.dump s3://tokyo-backups/monthly/ \
  --storage-class DEEP_ARCHIVE
```

## Restore Process

### Step 1 — Identify Target

Determine the backup to restore based on the incident time:

| Scenario                | Target Backup                          |
| ----------------------- | -------------------------------------- |
| Accidental data change  | Most recent backup before the change   |
| Corruption detected     | Point-in-time recovery (PITR)          |
| Full disaster           | Latest daily backup                    |
| Audit / legal request   | Relevant monthly backup                |

### Step 2 — Create Target Project

Create a new Supabase project (or use staging environment). Do **not** restore into the production project directly.

### Step 3 — Restore Database

```bash
pg_restore -d "postgresql://postgres:password@aws-0-{region}.pooler.supabase.com:6543/postgres" \
  --clean --if-exists --no-owner --role=postgres \
  ./backups/daily/tokyo-2025-01-15.dump
```

| Flag            | Purpose                                    |
| --------------- | ------------------------------------------ |
| `--clean`       | Drop existing objects before recreating    |
| `--if-exists`   | Avoid errors if objects don't exist        |
| `--no-owner`    | Skip ownership commands (handled by Supabase) |
| `--role`        | Execute as the postgres role               |

### Step 4 — Verify Data Integrity

Run the following checks after restore:

```sql
-- Row count comparison
SELECT 'companies' AS tbl, COUNT(*) FROM companies
UNION ALL
SELECT 'branches', COUNT(*) FROM branches
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'inventory_items', COUNT(*) FROM inventory_items
ORDER BY tbl;

-- Spot-check recent sales
SELECT COUNT(*) FROM sales WHERE created_at > NOW() - INTERVAL '7 days';

-- Verify RLS policies are active
SELECT schemaname, tablename, policyname FROM pg_policies;
```

### Step 5 — Restore Storage Buckets

```bash
supabase storage cp supabase://receipts ./restored-storage/receipts --recursive
supabase storage cp supabase://product-images ./restored-storage/product-images --recursive
```

### Step 6 — Update Environment Variables

```bash
# Update DATABASE_URL in your application to point to the restored DB
# Update SUPABASE_URL and SUPABASE_ANON_KEY to match the new project
```

### Step 7 — Run Smoke Tests

| Test                    | Expected Result                          |
| ----------------------- | ---------------------------------------- |
| Login as admin          | JWT returned, no errors                  |
| Browse product catalog  | Products list loads correctly            |
| Create a sale           | Sale recorded, inventory decreases       |
| Check inventory         | Stock levels visible per branch          |
| Generate daily report   | Report renders with correct numbers      |

## Point-in-Time Recovery (PITR)

Supabase Pro plan includes PITR with up to 7-day retention.

```sql
-- Check available PITR time window
SELECT * FROM supabase_functions.pg_stat_statements;
```

| Aspect          | Detail                                               |
| --------------- | ---------------------------------------------------- |
| **Retention**   | Up to 7 days (varies by plan)                        |
| **Granularity** | Restore to any second within the window               |
| **Use Case**    | Accidental `DELETE` / `UPDATE` without `WHERE` clause |
| **Process**     | Initiated via Supabase Dashboard → Database → PITR   |

PITR creates a new database instance; update connection strings afterward.

## Monitoring & Alerts

### Daily Cron Job

A Supabase cron function runs daily at 03:05 AM (after backup completes) and emails the backup status:

```sql
SELECT
  backup_date,
  file_size_mb,
  status,
  duration_seconds
FROM backup_log
WHERE backup_date = CURRENT_DATE;
```

### Alert Rules

| Condition                                      | Action                      |
| ---------------------------------------------- | --------------------------- |
| Backup file size deviates >20% from 7-day avg  | Slack / email alert to admin |
| Backup step fails (pg_dump error)              | Immediate SMS + email        |
| Storage bucket unavailable                     | Retry after 15 min, then alert |
| Monthly backup not uploaded to cold storage    | Weekly reminder email        |

### Retention Cleanup

```bash
# Daily: remove backups older than 7 days
supabase storage rm --recursive supabase://backups/daily/ --older-than 7d

# Weekly: remove weekly backups older than 4 weeks
supabase storage rm --recursive supabase://backups/weekly/ --older-than 4w

# Monthly: remove monthly backups older than 12 months
supabase storage rm --recursive supabase://backups/monthly/ --older-than 12m
```

## Recovery Time Objectives

| Metric               | Target         |
| -------------------- | -------------- |
| RPO (Recovery Point) | Max 24 hours   |
| RTO (Recovery Time)  | Max 60 minutes |
| PITR RPO             | 1 second       |
| Cold storage RTO     | 12 hours       |

## Testing

Backup restoration drills must be performed quarterly:

1. Q1: Restore daily backup to staging, run smoke tests
2. Q2: Restore weekly backup, verify storage buckets
3. Q3: Test PITR recovery to a specific timestamp
4. Q4: Full disaster recovery drill (cold storage restore)

Document results in `backup/recovery-drills/YYYY-Q{Q}_results.md`.
