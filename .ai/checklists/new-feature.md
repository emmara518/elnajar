# New Feature Checklist

## Pre-Implementation
- [ ] Feature spec completed using template
- [ ] Architecture reviewed and approved
- [ ] All dependencies identified
- [ ] Acceptance criteria defined

## Implementation
- [ ] Feature follows `src/features/_example/` structure
- [ ] All types defined (domain + API)
- [ ] Zod schemas created for all forms
- [ ] Repository interface defined
- [ ] Service class created (DI-ready)
- [ ] Zustand store with initialState, actions, selectors
- [ ] Hooks created (read + actions + permissions)
- [ ] Pages lazy-loaded with default export
- [ ] Routes configured (lazy, nested, permission-ready)
- [ ] Barrel `index.ts` exports everything

## UI
- [ ] Design system components used (not raw HTML)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading state handled
- [ ] Empty state handled
- [ ] Error state handled
- [ ] Form validation with Zod + React Hook Form

## Quality
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] ESLint passes (zero errors)
- [ ] Accessibility checked
- [ ] Performance checked
- [ ] Security reviewed
- [ ] Tests written
- [ ] Documentation updated

## Post-Implementation
- [ ] Reviewer approved
- [ ] All quality gates passed
