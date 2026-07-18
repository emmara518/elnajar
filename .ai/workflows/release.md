# Release Workflow

## Inputs
- Release plan (from `.ai/templates/release-plan.md`)
- All completed features and fixes
- Test results

## Outputs
- Deployed release
- Release notes
- Validation report
- Rollback procedure

## Required Agents
1. Planner → compile release manifest
2. QA → verify release candidate
3. DevOps → execute deployment
4. Documentation → publish release notes
5. Reviewer → final release approval

## Execution Order
```
1. Planner: Compile release manifest (features, fixes, changes)
2. QA: Smoke test release candidate
3. QA: Regression test suite
4. Security: Final security scan
5. DevOps: Deploy to staging
6. QA: Verify staging deployment
7. DevOps: Deploy to production
8. DevOps: Verify production health
9. Documentation: Publish release notes
```

## Quality Gates
- [ ] Production Readiness Gate (`.ai/quality-gates/production-readiness.md`)
- [ ] Deployment Readiness Gate (`.ai/quality-gates/deployment-readiness.md`)
- [ ] Testing Gate (`.ai/quality-gates/testing.md`)
- [ ] Documentation Gate (`.ai/quality-gates/documentation.md`)

## Exit Criteria
- Release candidate passes smoke tests
- Regression suite passes
- Security scan passes
- Staging deployment verified
- Production deployment healthy
- Rollback procedure documented
- Release notes published
