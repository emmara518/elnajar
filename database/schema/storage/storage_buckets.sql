-- ============================================================================
-- TOKYO Store POS/ERP — Supabase Storage Buckets
-- ============================================================================
-- Supabase Storage buckets are created via the management API or the
-- supabase CLI.  The SQL below uses supabase's built-in storage functions
-- to create buckets directly from a migration.
--
-- Run this AFTER all migrations to ensure the storage schema exists.
-- See: https://supabase.com/docs/guides/storage
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. avatars — User profile pictures
--    Public bucket, 2 MB limit, images only
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'avatars',
    jsonb_build_object(
        'public', true,
        'file_size_limit', 2097152,
        'allowed_mime_types', array['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    )
);

-- ---------------------------------------------------------------------------
-- 2. products — Product catalog images
--    Public bucket, 5 MB limit, images only
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'products',
    jsonb_build_object(
        'public', true,
        'file_size_limit', 5242880,
        'allowed_mime_types', array['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    )
);

-- ---------------------------------------------------------------------------
-- 3. receipts — Expense/purchase receipts
--    Private bucket, 10 MB limit, images + PDF
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'receipts',
    jsonb_build_object(
        'public', false,
        'file_size_limit', 10485760,
        'allowed_mime_types', array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf']
    )
);

-- ---------------------------------------------------------------------------
-- 4. attachments — General file attachments
--    Private bucket, 20 MB limit, any MIME type
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'attachments',
    jsonb_build_object(
        'public', false,
        'file_size_limit', 20971520,
        'allowed_mime_types', null
    )
);

-- ---------------------------------------------------------------------------
-- 5. exports — Generated export files (reports, data dumps)
--    Private bucket, 50 MB limit, CSV + XLSX + PDF only
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'exports',
    jsonb_build_object(
        'public', false,
        'file_size_limit', 52428800,
        'allowed_mime_types', array[
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/pdf'
        ]
    )
);

-- ---------------------------------------------------------------------------
-- 6. backups — Database backups
--    Private bucket, 100 MB limit, SQL only
-- ---------------------------------------------------------------------------
select storage.create_bucket(
    'backups',
    jsonb_build_object(
        'public', false,
        'file_size_limit', 104857600,
        'allowed_mime_types', array['application/sql', 'text/plain']
    )
);
