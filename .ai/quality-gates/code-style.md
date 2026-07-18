# Code Style Gate

## Purpose
Ensure code follows project coding standards and formatting conventions.

## Checks
- [ ] ESLint passes with zero errors
- [ ] Prettier formatting applied
- [ ] No unused imports or variables
- [ ] Naming conventions followed (PascalCase, camelCase, UPPER_SNAKE_CASE)
- [ ] No inline styles (Tailwind classes only)
- [ ] No magic numbers or strings (use constants)
- [ ] Functions small and single-responsibility
- [ ] No deeply nested logic
- [ ] No `any` unless explicitly justified
- [ ] No disabled TypeScript checks without explanation

## Gatekeeper
Reviewer Agent

## Failure
Flag findings. Block merge if Critical or High issues.

## Override
Only Lead Engineer may override with documented justification.
