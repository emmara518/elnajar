# Dependency Rules

## Direction
Dependencies must flow in one direction only:

```
Components (UI only)
    ↓
   Hooks (Logic)
    ↓
  Services (Business Logic)
    ↓
Repository (Data Access)
    ↓
Infrastructure (HTTP, Supabase, Storage)
```

## Rules
1. **Components** may only depend on:
   - Hooks
   - Design system components
   - Types
   - Constants
   - Utils (pure functions)

2. **Hooks** may only depend on:
   - Services
   - Stores
   - Types
   - Constants
   - Utils

3. **Services** may only depend on:
   - Repositories
   - Types
   - Constants
   - Utils

4. **Repositories** may only depend on:
   - Infrastructure (HTTP client, Supabase client)
   - Types/DTOs

5. **Stores** may only depend on:
   - Types
   - Constants

## Forbidden Dependencies
- Components → Services (must go through hooks)
- Components → Repositories
- Components → Infrastructure
- Hooks → Components
- Services → Components
- Services → Hooks
- Stores → Components
- Stores → Services

## Cross-Feature Imports
- Features must never import from other features
- Shared code must be extracted to global directories (hooks, utils, types, components)
- If two features need the same type, move it to `src/types/`
- If two features need the same hook, move it to `src/hooks/`
- If two features need the same component, move it to `src/components/common/`

## Circular Dependencies
- Circular dependencies are strictly forbidden
- If a circular dependency is detected, extract the shared dependency into a new module
- Run `madge` or similar tool to verify before releases
