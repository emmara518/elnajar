# Type Safety Gate

## Purpose
Ensure TypeScript strict mode is respected and type safety is maintained.

## Checks
- [ ] TypeScript compiles with `--noEmit` (zero errors)
- [ ] No `any` type used without explicit justification
- [ ] No type assertions (`as`) without justification
- [ ] `exactOptionalPropertyTypes` constraints respected
- [ ] `verbatimModuleSyntax` used (`import type` for types)
- [ ] No `// @ts-ignore` or `// @ts-expect-error` without documented reason
- [ ] Generic constraints properly defined
- [ ] Interface/type definitions correct and complete
- [ ] Barrel exports properly typed

## Gatekeeper
Reviewer Agent

## Failure
Block merge. TypeScript errors must be resolved.

## Override
Only Lead Engineer may override with documented type safety impact assessment.
