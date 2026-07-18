# Folder Rules

## Structure
```
src/
├── app/              # Application initialization
├── assets/           # Static assets
├── components/       # Shared UI components (not feature-specific)
├── config/           # Application configuration
├── features/         # Feature modules (isolated, independent)
├── hooks/            # Global shared hooks
├── layouts/          # Layout components
├── lib/              # Library configuration
├── pages/            # Page composition (thin, delegates to features)
├── routes/           # Route configuration
├── services/         # Global shared services
├── stores/           # Global Zustand stores
├── styles/           # Global styles
├── types/            # Global TypeScript types
└── utils/            # Global utilities
```

## Feature Structure
Every feature under `src/features/<name>/` must follow:
```
features/<name>/
├── api/              # Repository interfaces, DTOs, mappers
├── components/       # Feature-specific UI components
├── hooks/            # Feature-specific hooks
├── pages/            # Feature pages (lazy-loaded)
├── routes/           # Feature route configuration
├── services/         # Service classes
├── stores/           # Feature Zustand stores
├── types/            # Feature-specific types
├── schemas/          # Zod validation schemas
├── constants/        # Feature constants
├── utils/            # Feature utilities
├── index.ts          # Barrel exports
└── README.md         # Feature documentation
```

## Rules
- Maximum 5 folder depth
- No shared folders across features
- No circular references between features
- Global code in `src/` top-level directories
- Feature-specific code in `src/features/<name>/`
- Reusable code extracted to global directories (hooks, utils, components)
