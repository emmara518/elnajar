# Hotfix Workflow

## Inputs
- Critical bug report
- Steps to reproduce
- Severity justification

## Outputs
- Hotfix implementation
- Deployed fix
- Release notes update

## Required Agents
1. Planner → scope hotfix (minimal)
2. Relevant agent → implement fix
3. Security → review (if applicable)
4. QA → verify fix
5. DevOps → deploy hotfix
6. Documentation → update release notes

## Execution Order
```
1. Planner: Confirm Critical severity → scope minimal fix
2. Relevant Agent: Implement fix (smallest possible change)
3. QA: Verify fix fixes only the target bug
4. Security: Quick security review
5. DevOps: Deploy to staging → verify → deploy to production
6. Documentation: Update release notes
```

## Quality Gates (abbreviated)
- [ ] Testing Gate (`.ai/quality-gates/testing.md`)
- [ ] Security Gate (`.ai/quality-gates/security.md`)

## Exit Criteria
- Critical bug fixed and verified
- No regression introduced
- Production deployed
- Release notes updated

## Notes
- Skip non-essential gates to minimize time-to-fix
- Post-hotfix: Full regression test must be scheduled within 24 hours
