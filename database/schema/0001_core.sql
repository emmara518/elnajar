-- ============================================================================
-- TOKYO Store POS/ERP — 0001: Core Schema
-- ============================================================================
-- Domain: companies, branches, users, customers, employees, roles,
--         permissions, role_permissions, employee_roles, settings
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. COMPANIES — Top-level organization
-- ---------------------------------------------------------------------------
create table if not exists companies (
    id                  uuid primary key default gen_random_uuid(),
    name                text not null,
    legal_name          text not null,
    tax_id              text not null,
    commercial_register text not null,
    email               text not null,
    phone               text not null,
    address             jsonb not null,
    logo_url            text,
    website             text,
    is_active           boolean not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz
);

-- ---------------------------------------------------------------------------
-- 2. BRANCHES — Physical store locations
-- ---------------------------------------------------------------------------
create table if not exists branches (
    id           uuid primary key default gen_random_uuid(),
    company_id   uuid not null references companies(id),
    name         text not null,
    code         text not null unique,
    address      jsonb not null,
    phone        text not null,
    email        text not null,
    is_active    boolean not null default true,
    opening_time time not null,
    closing_time time not null,
    timezone     text not null,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    deleted_at   timestamptz,
    unique(name, company_id)
);

-- ---------------------------------------------------------------------------
-- 3. USERS — Registered customers (authenticated via Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists users (
    id                  uuid primary key default gen_random_uuid(),
    auth_user_id        uuid unique references auth.users(id),
    email               text not null unique,
    name                text not null,
    phone               text,
    avatar_url          text,
    is_email_verified   boolean not null default false,
    is_phone_verified   boolean not null default false,
    is_active           boolean not null default true,
    last_login_at       timestamptz,
    preferred_branch_id uuid references branches(id),
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz
);

-- ---------------------------------------------------------------------------
-- 4. CUSTOMERS — Store patrons (walk-in and registered)
-- ---------------------------------------------------------------------------
create table if not exists customers (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    email           text,
    phone           text,
    address         jsonb,
    loyalty_points  integer not null default 0,
    user_id         uuid references users(id),
    is_active       boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz
);

-- ---------------------------------------------------------------------------
-- 5. EMPLOYEES — Company staff
-- ---------------------------------------------------------------------------
create table if not exists employees (
    id            uuid primary key default gen_random_uuid(),
    branch_id     uuid not null references branches(id),
    user_id       uuid references users(id),
    employee_code text not null unique,
    name          text not null,
    email         text not null unique,
    phone         text,
    position      text not null,
    hire_date     date not null default current_date,
    is_active     boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now(),
    deleted_at    timestamptz
);

-- ---------------------------------------------------------------------------
-- 6. ROLES — Named permission sets
-- ---------------------------------------------------------------------------
create table if not exists roles (
    id          uuid primary key default gen_random_uuid(),
    name        text not null unique,
    description text not null,
    is_system   boolean not null default false,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    deleted_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- 7. PERMISSIONS — Granular action codes
-- ---------------------------------------------------------------------------
create table if not exists permissions (
    id          uuid primary key default gen_random_uuid(),
    code        text not null unique,
    name        text not null,
    description text not null,
    group_name  text not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    deleted_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- 8. ROLE_PERMISSIONS — Join table
-- ---------------------------------------------------------------------------
create table if not exists role_permissions (
    role_id       uuid not null references roles(id) on delete cascade,
    permission_id uuid not null references permissions(id) on delete cascade,
    primary key (role_id, permission_id)
);

-- ---------------------------------------------------------------------------
-- 9. EMPLOYEE_ROLES — Per-branch role assignments
-- ---------------------------------------------------------------------------
create table if not exists employee_roles (
    employee_id uuid not null references employees(id) on delete cascade,
    role_id     uuid not null references roles(id) on delete cascade,
    branch_id   uuid not null references branches(id) on delete cascade,
    primary key (employee_id, role_id, branch_id)
);

-- ---------------------------------------------------------------------------
-- 10. SETTINGS — Application configuration
-- ---------------------------------------------------------------------------
create table if not exists settings (
    id                              uuid primary key default gen_random_uuid(),
    company_id                      uuid not null references companies(id),
    currency                        text not null default 'EGP',
    default_tax_rate                numeric(5,2) not null default 14.00,
    branch_id                       uuid references branches(id),
    order_prefix                    text not null default 'ORD-',
    order_cutoff_time               time not null default '16:00',
    low_stock_threshold             integer not null default 10,
    enable_wholesale                boolean not null default false,
    enable_customer_registration    boolean not null default true,
    require_payment_verification    boolean not null default false,
    max_failed_login_attempts       integer not null default 5,
    session_timeout_minutes         integer not null default 480,
    created_at                      timestamptz not null default now(),
    updated_at                      timestamptz not null default now(),
    unique(company_id, branch_id) where branch_id is not null,
    unique(company_id) where branch_id is null
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_branches_company_id on branches(company_id);
create index if not exists idx_users_auth_user_id on users(auth_user_id);
create index if not exists idx_users_preferred_branch_id on users(preferred_branch_id);
create index if not exists idx_customers_user_id on customers(user_id);
create index if not exists idx_employees_branch_id on employees(branch_id);
create index if not exists idx_employees_user_id on employees(user_id);
create index if not exists idx_role_permissions_role_id on role_permissions(role_id);
create index if not exists idx_role_permissions_permission_id on role_permissions(permission_id);
create index if not exists idx_employee_roles_employee_id on employee_roles(employee_id);
create index if not exists idx_employee_roles_role_id on employee_roles(role_id);
create index if not exists idx_employee_roles_branch_id on employee_roles(branch_id);
create index if not exists idx_settings_company_id on settings(company_id);
create index if not exists idx_settings_branch_id on settings(branch_id);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

do $$ begin
    create trigger trg_companies_updated_at before update on companies
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_branches_updated_at before update on branches
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_users_updated_at before update on users
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_customers_updated_at before update on customers
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_employees_updated_at before update on employees
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_roles_updated_at before update on roles
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_permissions_updated_at before update on permissions
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_settings_updated_at before update on settings
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
