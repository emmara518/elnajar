# Naming Rules

## Files
| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase.tsx | `ProductCard.tsx` |
| Hooks | camelCase.ts | `useProducts.ts` |
| Utilities | camelCase.ts | `formatDate.ts` |
| Stores | camelCase.store.ts | `auth.store.ts` |
| Services | PascalCase.service.ts | `product.service.ts` |
| Types | PascalCase.types.ts or PascalCase.ts | `product.types.ts` or `types.ts` |
| Schemas | camelCase.schema.ts | `product.schema.ts` |
| Constants | kebab-case or camelCase.ts | `order-status.ts` or `constants.ts` |
| CSS | kebab-case.css | `globals.css` |
| Config | camelCase.ts | `vite.config.ts` |

## Folders
- Feature folders: kebab-case (`order-details/`)
- Component folders: PascalCase (`ProductCard/`)
- Standard directories: camelCase (`src/design-system/`)
- Special directories: camelCase (`src/features/`)

## Variables
- camelCase for all variables and functions
- UPPER_SNAKE_CASE for constants and enums
- Boolean prefixes: `is`, `has`, `can`, `should`
- Event handlers: `handle` prefix (e.g., `handleSubmit`)
- Props: descriptive names, not abbreviated

## Types
- Interfaces: PascalCase with descriptive name
- Types: PascalCase (use unions, intersections)
- Enums: PascalCase, members UPPER_SNAKE_CASE
- Generics: single uppercase letter for simple, descriptive for complex
