-- ============================================================================
-- TOKYO Store POS/ERP — 0004: Sales Schema
-- ============================================================================
-- Domain: shifts, sales, sale_items, payments
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. SHIFTS — Cashier work sessions
-- ---------------------------------------------------------------------------
create table if not exists shifts (
    id             uuid primary key default gen_random_uuid(),
    branch_id      uuid not null references branches(id),
    employee_id    uuid not null references employees(id),
    status         text not null default 'open' check (status in ('open','closed')),
    opened_at      timestamptz not null default now(),
    closed_at      timestamptz,
    opening_cash   numeric(12,2) not null default 0,
    closing_cash   numeric(12,2),
    expected_cash  numeric(12,2),
    cash_difference numeric(12,2),
    total_sales    integer not null default 0,
    currency       text not null default 'EGP',
    notes          text,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now(),
    deleted_at     timestamptz
);

-- ---------------------------------------------------------------------------
-- 2. SALES — Customer purchase transactions
-- ---------------------------------------------------------------------------
create table if not exists sales (
    id                 uuid primary key default gen_random_uuid(),
    branch_id          uuid not null references branches(id),
    shift_id           uuid not null references shifts(id),
    customer_id        uuid references customers(id),
    employee_id        uuid not null references employees(id),
    order_number       text not null unique,
    status             text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
    subtotal           numeric(12,2) not null default 0,
    discount_total     numeric(12,2) not null default 0,
    tax_total          numeric(12,2) not null default 0,
    shipping_total     numeric(12,2) not null default 0,
    grand_total        numeric(12,2) not null default 0,
    paid_amount        numeric(12,2) not null default 0,
    change_amount      numeric(12,2) not null default 0,
    currency           text not null default 'EGP',
    notes              text,
    confirmed_at       timestamptz,
    cancelled_at       timestamptz,
    cancellation_reason text,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    deleted_at         timestamptz
);

-- ---------------------------------------------------------------------------
-- 3. SALE_ITEMS — Sale line items (immutable after confirmation)
-- ---------------------------------------------------------------------------
create table if not exists sale_items (
    id              uuid primary key default gen_random_uuid(),
    sale_id         uuid not null references sales(id) on delete cascade,
    product_id      uuid not null references products(id),
    product_name    text not null,
    sku             text not null,
    quantity        integer not null check (quantity > 0),
    unit_price      numeric(12,2) not null,
    discount_amount numeric(12,2) not null default 0,
    tax_amount      numeric(12,2) not null default 0,
    total_price     numeric(12,2) not null,
    currency        text not null default 'EGP',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. PAYMENTS — Payments against sales
-- ---------------------------------------------------------------------------
create table if not exists payments (
    id              uuid primary key default gen_random_uuid(),
    sale_id         uuid not null references sales(id) on delete cascade,
    method          text not null check (method in ('cash','bank_transfer','credit_card','wallet','other')),
    status          text not null default 'pending' check (status in ('pending','paid','partially_paid','overpaid','refunded','failed')),
    amount          numeric(12,2) not null check (amount > 0),
    currency        text not null default 'EGP',
    reference_number text,
    notes           text,
    verified_by_id  uuid references employees(id),
    verified_at     timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_shifts_branch_id on shifts(branch_id);
create index if not exists idx_shifts_employee_id on shifts(employee_id);
create index if not exists idx_shifts_status on shifts(status);
create index if not exists idx_sales_branch_id on sales(branch_id);
create index if not exists idx_sales_shift_id on sales(shift_id);
create index if not exists idx_sales_customer_id on sales(customer_id);
create index if not exists idx_sales_employee_id on sales(employee_id);
create index if not exists idx_sales_status on sales(status);
create index if not exists idx_sales_order_number on sales(order_number);
create index if not exists idx_sales_created_at on sales(created_at);
create index if not exists idx_sale_items_sale_id on sale_items(sale_id);
create index if not exists idx_sale_items_product_id on sale_items(product_id);
create index if not exists idx_payments_sale_id on payments(sale_id);
create index if not exists idx_payments_method on payments(method);
create index if not exists idx_payments_status on payments(status);
create index if not exists idx_payments_verified_by_id on payments(verified_by_id);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
do $$ begin
    create trigger trg_shifts_updated_at before update on shifts
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_sales_updated_at before update on sales
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_sale_items_updated_at before update on sale_items
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_payments_updated_at before update on payments
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
