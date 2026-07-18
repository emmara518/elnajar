# Bug Fix Workflow

## Inputs
- Bug report (from `.ai/templates/bug-spec.md`)
- Steps to reproduce
- Affected area in codebase

## Outputs
- Fix implementation
- Regression tests
- Updated documentation (if needed)

## Required Agents
1. Planner → scope the fix
2. Relevant agent (Frontend/Backend/Database) → implement fix
3. QA → verify fix + regression test
4. Security → review if security-related
5. Reviewer → approve fix

## Execution Order
```
1. Planner: Reproduce bug → determine root cause → scope fix
2. Relevant Agent: Implement fix
3. QA: Verify fix + add regression test
4. Security Agent: Review (if security bug)
5. Reviewer: Final review
```

## Quality Gates
- [ ] Testing Gate (`.ai/quality-gates/testing.md`)
- [ ] Code Style Gate (`.ai/quality-gates/code-style.md`)
- [ ] Type Safety Gate (`.ai/quality-gates/type-safety.md`)

## Exit Criteria
- Bug is fixed and verified
- Regression test added
- All relevant quality gates pass
- Reviewer approves
- No regression introduced
