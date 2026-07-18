# Database Change Checklist

- [ ] Migration file created (ordered, idempotent)
- [ ] Schema change documented
- [ ] All tables have: primary key, created_at, updated_at
- [ ] Foreign keys with referential integrity
- [ ] RLS policies applied to all new tables
- [ ] Indexes created for filtered/joined columns
- [ ] Migration is reversible (down migration provided)
- [ ] No orphaned records possible
- [ ] Application code updated to match new schema
- [ ] Existing queries still work (or updated)
- [ ] Migration tested on staging
- [ ] Rollback tested on staging
