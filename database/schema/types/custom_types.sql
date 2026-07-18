-- ============================================================================
-- TOKYO Store POS/ERP — Custom ENUM Types
-- ============================================================================
-- This file MUST be executed BEFORE any migration files that reference
-- these types. Run this first, then run 0001_core.sql through 0007_auxiliary.sql
-- in order.
-- ============================================================================

-- Product types
do $$ begin
  create type product_type as enum ('simple','variant','bundle');
exception
  when duplicate_object then null;
end $$;

-- Sale order lifecycle statuses
do $$ begin
  create type sale_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled','refunded');
exception
  when duplicate_object then null;
end $$;

-- Payment lifecycle statuses
do $$ begin
  create type payment_status as enum ('pending','paid','partially_paid','overpaid','refunded','failed');
exception
  when duplicate_object then null;
end $$;

-- Payment methods / tender types
do $$ begin
  create type payment_method as enum ('cash','bank_transfer','credit_card','wallet','other');
exception
  when duplicate_object then null;
end $$;

-- Cashier shift states
do $$ begin
  create type shift_status as enum ('open','closed');
exception
  when duplicate_object then null;
end $$;

-- Inventory movement directions
do $$ begin
  create type movement_type as enum ('in','out','adjustment','transfer');
exception
  when duplicate_object then null;
end $$;

-- Operational expense categories
do $$ begin
  create type expense_category as enum ('rent','utilities','salaries','supplies','maintenance','transport','marketing','other');
exception
  when duplicate_object then null;
end $$;

-- Purchase order lifecycle statuses
do $$ begin
  create type purchase_status as enum ('draft','ordered','partially_received','received','cancelled');
exception
  when duplicate_object then null;
end $$;

-- Audit trail action types
do $$ begin
  create type audit_action as enum ('create','update','delete','restore','login','logout','export');
exception
  when duplicate_object then null;
end $$;
