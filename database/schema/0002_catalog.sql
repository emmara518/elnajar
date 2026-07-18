-- ============================================================================
-- TOKYO Store POS/ERP — 0002: Catalog Schema
-- ============================================================================
-- Domain: categories, suppliers, products, product_categories
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CATEGORIES — Hierarchical product classification
-- ---------------------------------------------------------------------------
create table if not exists categories (
    id                  uuid primary key default gen_random_uuid(),
    name                text not null,
    slug                text not null unique,
    description         text,
    parent_category_id  uuid references categories(id),
    image_url           text,
    sort_order          integer not null default 0,
    is_active           boolean not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz
);

-- ---------------------------------------------------------------------------
-- 2. SUPPLIERS — External vendors
-- ---------------------------------------------------------------------------
create table if not exists suppliers (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    contact_person  text not null,
    email           text not null,
    phone           text not null,
    address         jsonb not null,
    tax_id          text,
    payment_terms   text not null default 'net_30',
    lead_time_days  integer not null default 7,
    is_active       boolean not null default true,
    notes           text,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz
);

-- ---------------------------------------------------------------------------
-- 3. PRODUCTS — Sellable catalog items
-- ---------------------------------------------------------------------------
create table if not exists products (
    id                uuid primary key default gen_random_uuid(),
    name              text not null,
    slug              text not null unique,
    description       text not null default '',
    type              text not null check (type in ('simple','variant','bundle')),
    category_id       uuid not null references categories(id),
    sku               text not null unique,
    barcode           text unique,
    retail_price      numeric(12,2) not null check (retail_price >= 0),
    wholesale_price   numeric(12,2) check (wholesale_price >= 0),
    cost_price        numeric(12,2) not null check (cost_price >= 0),
    unit              text not null default 'piece',
    images            jsonb not null default '[]'::jsonb,
    tags              jsonb not null default '[]'::jsonb,
    is_active         boolean not null default true,
    is_featured       boolean not null default false,
    seo_title         text,
    seo_description   text,
    weight            numeric(10,2),
    weight_unit       text,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now(),
    deleted_at        timestamptz,
    constraint chk_retail_above_cost check (retail_price >= cost_price)
);

-- ---------------------------------------------------------------------------
-- 4. PRODUCT_CATEGORIES — Many-to-many product categorization
-- ---------------------------------------------------------------------------
create table if not exists product_categories (
    product_id  uuid not null references products(id) on delete cascade,
    category_id uuid not null references categories(id) on delete cascade,
    primary key (product_id, category_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_categories_parent_category_id on categories(parent_category_id);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_type on products(type);
create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_product_categories_category_id on product_categories(category_id);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
do $$ begin
    create trigger trg_categories_updated_at before update on categories
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_suppliers_updated_at before update on suppliers
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_products_updated_at before update on products
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
