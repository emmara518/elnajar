# Architecture Gate

## Purpose
Ensure the implementation respects the project's architecture, module boundaries, and dependency direction.

## Checks
- [ ] Feature follows `src/features/_example/` structure
- [ ] Dependency direction: Components → Hooks → Services → Repository → Infrastructure
- [ ] No reverse dependencies
- [ ] No cross-feature imports
- [ ] Module boundaries respected
- [ ] No duplicate implementations
- [ ] Barrel `index.ts` exports all public types
- [ ] Folder depth ≤ 5 levels

## Gatekeeper
Architect Agent

## Failure
Block merge. File ADR if architecture change is needed.

## Override
Only Lead Architect may override.
