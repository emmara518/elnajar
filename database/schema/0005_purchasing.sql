-- ============================================================================
-- TOKYO Store POS/ERP — 0005: Purchasing Schema
-- ============================================================================
-- Domain: purchases, purchase_items
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PURCHASES — Supplier orders
-- ---------------------------------------------------------------------------
create table if not exists purchases (
    id                    uuid primary key default gen_random_uuid(),
    branch_id             uuid not null references branches(id),
    supplier_id           uuid not null references suppliers(id),
    order_number          text not null unique,
    status                text not null default 'draft' check (status in ('draft','ordered','partially_received','received','cancelled')),
    subtotal              numeric(12,2) not null default 0,
    discount_total        numeric(12,2) not null default 0,
    tax_total             numeric(12,2) not null default 0,
    shipping_total        numeric(12,2) not null default 0,
    grand_total           numeric(12,2) not null default 0,
    currency              text not null default 'EGP',
    ordered_by_id         uuid not null references employees(id),
    received_by_id        uuid references employees(id),
    ordered_at            timestamptz not null default now(),
    received_at           timestamptz,
    expected_delivery_date date,
    notes                 text,
    created_at            timestamptz not null default now(),
    updated_at            timestamptz not null default now(),
    deleted_at            timestamptz
);

-- ---------------------------------------------------------------------------
-- 2. PURCHASE_ITEMS — Purchase order line items
-- ---------------------------------------------------------------------------
create table if not exists purchase_items (
    id                 uuid primary key default gen_random_uuid(),
    purchase_id        uuid not null references purchases(id) on delete cascade,
    product_id         uuid not null references products(id),
    product_name       text not null,
    sku                text not null,
    ordered_quantity   integer not null check (ordered_quantity > 0),
    received_quantity  integer not null default 0 check (received_quantity >= 0),
    unit_cost          numeric(12,2) not null,
    total_cost         numeric(12,2) not null,
    currency           text not null default 'EGP',
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    constraint chk_received_not_exceed_ordered check (received_quantity <= ordered_quantity)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_purchases_branch_id on purchases(branch_id);
create index if not exists idx_purchases_supplier_id on purchases(supplier_id);
create index if not exists idx_purchases_ordered_by_id on purchases(ordered_by_id);
create index if not exists idx_purchases_received_by_id on purchases(received_by_id);
create index if not exists idx_purchases_status on purchases(status);
create index if not exists idx_purchases_order_number on purchases(order_number);
create index if not exists idx_purchase_items_purchase_id on purchase_items(purchase_id);
create index if not exists idx_purchase_items_product_id on purchase_items(product_id);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
do $$ begin
    create trigger trg_purchases_updated_at before update on purchases
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_purchase_items_updated_at before update on purchase_items
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
