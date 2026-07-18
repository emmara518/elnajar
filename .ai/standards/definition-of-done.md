# Global Definition of Done

Every feature, fix, or change must satisfy ALL of the following before merge.

## Functional
- [ ] All acceptance criteria in the spec are met
- [ ] Feature works as documented
- [ ] No regression in existing functionality
- [ ] Edge cases handled (empty, error, loading)

## Code Quality
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`)
- [ ] ESLint passes with zero errors
- [ ] No architectural violations
- [ ] Naming conventions followed
- [ ] Folder structure follows project rules
- [ ] No duplicate code
- [ ] No debug code or console.log in production code

## Architecture
- [ ] Feature follows `src/features/_example/` template structure
- [ ] Dependency direction respected
- [ ] No cross-feature imports
- [ ] Barrel `index.ts` exports everything
- [ ] All new types, hooks, services, stores exported through barrel

## UI (if applicable)
- [ ] Design system components used (not raw HTML)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states handled
- [ ] Empty states handled
- [ ] Error states handled
- [ ] RTL layout correct

## Security
- [ ] Authentication enforced where required
- [ ] Authorization enforced where required
- [ ] Input validation complete (client + server)
- [ ] No secrets exposed
- [ ] No XSS or SQL injection vectors

## Performance
- [ ] All pages lazy-loaded
- [ ] No unnecessary re-renders
- [ ] Bundle size regression < 5%

## Accessibility
- [ ] Keyboard navigation works
- [ ] All form inputs have labels
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Testing
- [ ] Tests written for new functionality
- [ ] Edge cases tested
- [ ] Existing tests still pass
- [ ] No flaky tests introduced

## Documentation
- [ ] New features documented
- [ ] API changes documented
- [ ] Schema changes documented
- [ ] ADR written for architecture changes

## Review
- [ ] At least one review approved
- [ ] All Critical and High findings resolved
- [ ] Final decision: Approved or Approved with Minor Changes

## Final Verification
- [ ] `npm run build` succeeds
- [ ] `tsc --noEmit` passes
- [ ] `eslint .` passes
