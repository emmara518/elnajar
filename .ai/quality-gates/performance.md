# Performance Gate

## Purpose
Ensure the implementation meets performance standards and does not introduce regressions.

## Checks
- [ ] All routes are lazy-loaded (code splitting)
- [ ] No unnecessary re-renders detected
- [ ] Bundle size regression < 5% (when measurable)
- [ ] Database queries use indexes (if applicable)
- [ ] No N+1 query pattern
- [ ] Images use WebP with responsive sizes (if applicable)
- [ ] Unused imports removed
- [ ] Memoization used where justified

## Gatekeeper
Performance Agent

## Failure
Flag for optimization. Block release if performance regression > 5%.

## Override
Only Lead Engineer may override with documented performance budget justification.
