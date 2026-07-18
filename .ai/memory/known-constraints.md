# Known Constraints

## Technical Constraints
- Arabic-first RTL with Cairo font
- Mobile-first responsive design
- PWA-ready with safe-area-awareness
- TypeScript `exactOptionalPropertyTypes` enabled (children? patterns need explicit handling)
- TypeScript `verbatimModuleSyntax` enabled (import type required)
- TypeScript `noUncheckedIndexedAccess` enabled (array/record access returns `T | undefined`)
- No `any` without explicit justification
- Tailwind CSS v4 (new `@theme` directive, not `tailwind.config.js`)
- React 19 with ref-as-prop removed (use `forwardRef`)
- Vite 8 with `@tailwindcss/vite` plugin
- React Router v7 with `createBrowserRouter`

## Architecture Constraints
- No business logic in components
- No direct API calls from components
- No inline styles
- No duplicate implementations
- No circular dependencies
- No cross-feature imports
- Feature structure must match `_example` template

## Project Constraints
- Supabase is backend (no custom server)
- Manual payment flow (no online payment gateway yet)
- Single store (not multi-vendor yet)
- Single branch (not multi-branch yet)
- Single currency (EGP, future: multi-currency)
- Single language (Arabic, future: English)

## Known Technical Debt
- Core framework (`src/core/`) has interfaces but no implementations
- Auth feature not yet implemented
- Database schema not yet created
- Tests not yet written
- CI/CD pipeline not yet configured
- Error tracking not yet configured
- No automated accessibility testing
