-- ============================================================================
-- TOKYO Store POS/ERP — 0007: Auxiliary Schema
-- ============================================================================
-- Domain: audit_logs, attachments, notifications
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. AUDIT_LOGS — Immutable system event log
-- ---------------------------------------------------------------------------
create table if not exists audit_logs (
    id          uuid primary key default gen_random_uuid(),
    actor_id    text not null,
    actor_type  text not null,
    action      text not null check (action in ('create','update','delete','restore','login','logout','export')),
    entity_type text not null,
    entity_id   text not null,
    changes     jsonb,
    ip_address  text,
    user_agent  text,
    branch_id   uuid references branches(id),
    created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. ATTACHMENTS — File attachments
-- ---------------------------------------------------------------------------
create table if not exists attachments (
    id             uuid primary key default gen_random_uuid(),
    entity_type    text not null,
    entity_id      uuid not null,
    file_name      text not null,
    file_size      integer not null,
    mime_type      text not null,
    storage_bucket text not null,
    storage_path   text not null,
    uploaded_by_id uuid references employees(id),
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now(),
    deleted_at     timestamptz
);

-- ---------------------------------------------------------------------------
-- 3. NOTIFICATIONS — System notifications
-- ---------------------------------------------------------------------------
create table if not exists notifications (
    id              uuid primary key default gen_random_uuid(),
    recipient_id    uuid not null,
    recipient_type  text not null check (recipient_type in ('user','employee')),
    type            text not null,
    title           text not null,
    body            text not null,
    data            jsonb,
    is_read         boolean not null default false,
    read_at         timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    deleted_at      timestamptz
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_audit_logs_actor on audit_logs(actor_id, actor_type);
create index if not exists idx_audit_logs_action on audit_logs(action);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_branch_id on audit_logs(branch_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at);
create index if not exists idx_attachments_entity on attachments(entity_type, entity_id);
create index if not exists idx_attachments_uploaded_by_id on attachments(uploaded_by_id);
create index if not exists idx_notifications_recipient on notifications(recipient_id, recipient_type);
create index if not exists idx_notifications_is_read on notifications(is_read);
create index if not exists idx_notifications_created_at on notifications(created_at);

-- ============================================================================
-- TRIGGER: auto-update updated_at
-- ============================================================================
do $$ begin
    create trigger trg_attachments_updated_at before update on attachments
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;

do $$ begin
    create trigger trg_notifications_updated_at before update on notifications
        for each row execute function update_updated_at_column();
exception when duplicate_object then null;
end $$;
