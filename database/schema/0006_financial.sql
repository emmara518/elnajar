-- ============================================================================
-- TOKYO Store POS/ERP — 0006: Financial Schema
-- ============================================================================
-- Domain: expenses
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXPENSES — Operational expenses
-- ---------------------------------------------------------------------------
create table if not exists expenses (
    id                uuid primary key default gen_random_uuid(),
    branch_id         uuid not null references branches(id),
    category          text not null check (category in ('rent','utilities','salaries','supplies','maintenance','transport','marketing','other')),
    amount            numeric(12,2) not null check (amount > 0),
    currency          text not null default 'EGP',
    description       text not null,
    receipt_url       text,
    recorded_by_id    uuid not null references employees(id),
    expense_date      date not null,
    is_tax_deductible boolean not null default false,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now(),
    deleted_at        timestamptz
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_expenses_branch_id on expenses(branch_id);
create index if not exists idx_expenses_category on expenses(category);
create index if not exists idx_expenses_recorded_by_id on expenses(recorded_by_id);
create index if not exists idx_expenses_expense_date on expenses(expense_date);
create index if not exists idx_expenses_is_tax_deductible on expenses(is_tax_deductible);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
do $$ begin
    create trigger trg_expenses_updated_at before update on expenses
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
