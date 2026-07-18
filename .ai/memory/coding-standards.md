# Coding Standards (Memory)

## Key Standards
- TypeScript strict mode
- React functional components with hooks
- Tailwind CSS (no inline styles)
- No `any` unless justified
- `import type` for type-only imports
- Named exports (default only for lazy pages)
- Barrel exports in every module

## Design System
- All UI uses `src/design-system/` components
- 26 components available (Button, Input, Modal, Toast, etc.)
- Theme tokens in `@theme` CSS block
- Dark mode via `.dark` class
- High-contrast via `prefers-contrast: more`
- RTL-first with Cairo font

## Core Abstractions
- `src/core/` provides: errors, result, logger, http, events, storage, guards, validators, permissions, utils, config, constants
- These are interfaces/abstractions only — no Supabase, no API, no auth
- All business features use core abstractions

## Sources
- Full standards: `.ai/standards/coding-standards.md`
- `docs/prompts/global-rules.md`
- `docs/prompts/frontend.md`
