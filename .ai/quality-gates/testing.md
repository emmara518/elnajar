# Testing Gate

## Purpose
Ensure the implementation is properly tested and does not introduce regressions.

## Checks
- [ ] Existing test suite passes
- [ ] New functionality has tests (unit + integration where applicable)
- [ ] Edge cases covered (empty, error, loading)
- [ ] Acceptance criteria from spec have passing tests
- [ ] No flaky tests introduced
- [ ] Tests are deterministic and independent
- [ ] Tests verify behavior, not implementation details

## Gatekeeper
QA Agent

## Failure
Block merge. Untested features cannot be released.

## Override
Only Lead Engineer may override with documented risk assessment.
