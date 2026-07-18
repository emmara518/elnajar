-- ============================================================================
-- TOKYO Store POS/ERP — 0003: Inventory Schema
-- ============================================================================
-- Domain: inventory_items, stock_movements
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. INVENTORY_ITEMS — Per-branch stock records
-- ---------------------------------------------------------------------------
create table if not exists inventory_items (
    id                uuid primary key default gen_random_uuid(),
    product_id        uuid not null references products(id),
    branch_id         uuid not null references branches(id),
    quantity          integer not null default 0 check (quantity >= 0),
    reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
    min_stock_level   integer not null default 0,
    max_stock_level   integer,
    reorder_point     integer not null default 0,
    location          text,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now(),
    deleted_at        timestamptz,
    unique(product_id, branch_id),
    constraint chk_reserved_not_exceed_quantity check (reserved_quantity <= quantity)
);

-- ---------------------------------------------------------------------------
-- 2. STOCK_MOVEMENTS — Immutable inventory audit trail
-- ---------------------------------------------------------------------------
create table if not exists stock_movements (
    id                     uuid primary key default gen_random_uuid(),
    inventory_item_id      uuid not null references inventory_items(id),
    product_id             uuid not null references products(id),
    branch_id              uuid not null references branches(id),
    type                   text not null check (type in ('in','out','adjustment','transfer')),
    quantity               integer not null,
    before_quantity        integer not null,
    after_quantity         integer not null,
    reference_type         text not null,
    reference_id           uuid not null,
    reason                 text not null,
    created_by_employee_id uuid not null references employees(id),
    created_at             timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_inventory_items_product_id on inventory_items(product_id);
create index if not exists idx_inventory_items_branch_id on inventory_items(branch_id);
create index if not exists idx_inventory_items_low_stock on inventory_items(branch_id, product_id)
    where quantity <= reorder_point;
create index if not exists idx_stock_movements_inventory_item_id on stock_movements(inventory_item_id);
create index if not exists idx_stock_movements_product_id on stock_movements(product_id);
create index if not exists idx_stock_movements_branch_id on stock_movements(branch_id);
create index if not exists idx_stock_movements_type on stock_movements(type);
create index if not exists idx_stock_movements_reference on stock_movements(reference_type, reference_id);
create index if not exists idx_stock_movements_created_at on stock_movements(created_at);

-- ============================================================================
-- TRIGGER: auto-update updated_at on inventory_items only
-- ============================================================================
do $$ begin
    create trigger trg_inventory_items_updated_at before update on inventory_items
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
