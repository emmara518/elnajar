# Refactor Workflow

## Inputs
- Refactor spec (from `.ai/templates/refactor-spec.md`)
- Code area identified for improvement
- Existing test suite

## Outputs
- Refactored code (behavior unchanged)
- Refactoring summary
- Updated tests (if needed)

## Required Agents
1. Planner → scope refactoring
2. Architect → approve plan
3. Refactor → execute refactoring
4. QA → verify no regression
5. Reviewer → approve

## Execution Order
```
1. Planner: Analyze code → determine refactoring scope
2. Architect: Approve refactoring plan
3. Refactor: Execute refactoring (incremental)
4. QA: Run tests → verify no regression
5. Reviewer: Final review
```

## Quality Gates
- [ ] Architecture Gate (`.ai/quality-gates/architecture.md`)
- [ ] Testing Gate (`.ai/quality-gates/testing.md`)
- [ ] Code Style Gate (`.ai/quality-gates/code-style.md`)
- [ ] Type Safety Gate (`.ai/quality-gates/type-safety.md`)

## Exit Criteria
- All tests pass (same count or more)
- Behavior unchanged
- Code quality improved
- No regression introduced
- Reviewer approves
