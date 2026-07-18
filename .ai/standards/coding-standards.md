# Coding Standards

## TypeScript
- Strict mode enabled (see `tsconfig.app.json`)
- `exactOptionalPropertyTypes` enabled
- `verbatimModuleSyntax` enabled — use `import type` for type-only imports
- `noUncheckedIndexedAccess` enabled — check for undefined when accessing arrays/records
- No `any` unless explicitly justified with comment
- No type assertions (`as`) unless necessary and justified
- No `// @ts-ignore` or `// @ts-expect-error` without documented reason
- Prefer interfaces for object shapes, types for unions/utilities
- Use generics for reusable functions and components

## React
- All components are functions (no class components)
- `forwardRef` for reusable form components
- `displayName` set on every component
- Props interfaces prefixed with component name (e.g., `ButtonProps`)
- No inline styles — use Tailwind classes only
- No business logic in components — delegate to hooks/services
- Single responsibility per component
- Keep components small

## Naming
- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useProducts.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`PAGE_SIZE`)
- Types/Interfaces: PascalCase (`ProductItem`)
- Files: kebab-case for folders, PascalCase for components
- Stores: camelCase with `.store.ts` suffix (`auth.store.ts`)
- Services: PascalCase with `Service` suffix (`ProductService`)

## Exports
- Named exports for everything
- Default exports only for lazy-loaded page components
- Barrel `index.ts` in every module
- Export only public API — keep internal types private

## Imports
- Absolute imports with `@/` prefix only
- No deep relative imports (`../../types`)
- Group imports: React → Libraries → Components → Hooks → Services → Stores → Types → Utils → Styles
- `import type` for type-only imports
