# Example Feature Template

## Purpose

This is a template feature for the TOKYO Store frontend. Every future feature MUST follow this exact structure. No exceptions.

## Folder Responsibilities

```
_example/
├── api/            # Repository interfaces, DTOs, mappers, response models
├── components/     # Feature-specific UI components (no implementation in template)
├── hooks/          # Feature-specific React hooks
├── pages/          # Feature page components (lazy-loaded)
├── routes/         # Feature routing configuration (lazy, nested, permission-ready)
├── services/       # Business logic abstraction, DI-ready service classes
├── stores/         # Zustand store (state, actions, selectors)
├── types/          # Feature-specific TypeScript types
├── schemas/        # Zod validation schemas
├── constants/      # Feature-specific constants
├── utils/          # Feature-specific pure utility functions
├── index.ts        # Barrel exports
└── README.md       # This file
```

## Communication Between Layers

```
Components
    ↓
   Hooks
    ↓
  Services
    ↓
Repository (API Layer)
    ↓
Infrastructure (HTTP client, Supabase, etc.)
```

### Rules

- Components call hooks only.
- Hooks call services and stores.
- Services call repositories.
- Repositories call infrastructure.
- **Never reverse this direction.**
- Components never call services or repositories directly.
- Services never import from components or hooks.
- Stores never import from components or hooks.

## Dependency Direction

```
pages/ → hooks/ → services/ → api/ → infrastructure
                     ↕
                  stores/
```

## Example Workflow: List Feature Items

1. User visits `/examples` (route defined in `routes/index.tsx`)
2. `ExamplePage` renders and calls `useExample()`
3. `useExample()` accesses store for cached data, triggers fetch if needed
4. Store calls `ExampleService.list()`
5. `ExampleService` calls `ExampleRepository.list()`
6. Repository calls HTTP infrastructure and maps response via `fromDTO()`
7. Result flows back through the same chain
8. UI updates reactively via Zustand selectors

## Naming Conventions

- **Folders**: kebab-case (`example-card/`)
- **Components**: PascalCase (`ExampleCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useExample.ts`)
- **Services**: PascalCase with `Service` suffix (`ExampleService`)
- **Stores**: camelCase with `.store.ts` suffix (`example.store.ts`)
- **Types**: PascalCase (`ExampleItem`)
- **Schemas**: camelCase with `Schema` suffix (`createExampleSchema`)
- **Constants**: UPPER_SNAKE_CASE (`EXAMPLE_PAGE_SIZE`)
- **Utilities**: camelCase (`sortExamples`)
- **API types**: PascalCase with `DTO`/`Request`/`Response` suffix

## Do

- Use absolute imports only: `@/features/example/types`
- Export everything through barrel `index.ts`
- Use `import type` for type-only imports
- Keep files small and single-responsibility
- Make services DI-ready (repository injected via constructor)
- Use Zustand selectors for granular subscriptions
- Lazy-load all pages
- Add permission metadata to route handles
- Validate all inputs with Zod schemas

## Don't

- Use deep relative imports (`../../types`)
- Call repositories directly from components
- Import from features across feature boundaries
- Put business logic in components
- Use inline styles (use Tailwind classes)
- Expose store internals outside hooks
- Create circular dependencies between layers
- Hardcode API URLs or endpoints
- Skip error handling in services
- Store derived state (compute it instead)

## License

TOKYO Store - All rights reserved.
