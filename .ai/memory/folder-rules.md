# Folder Rules (Memory)

## Key Rules
- Features: `src/features/<name>/` with `_example` template structure
- Global code: `src/` top-level directories (hooks, utils, types, etc.)
- No cross-feature imports — shared code extracted to global
- Feature structure: api, components, hooks, pages, routes, services, stores, types, schemas, constants, utils
- Max 5 folder depth
- Every module has `index.ts` barrel

## Sources
- Full rules: `.ai/standards/folder-rules.md`
- `docs/architecture/folder-structure.md`
