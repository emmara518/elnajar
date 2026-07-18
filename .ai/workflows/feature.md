# Feature Workflow

## Inputs
- Feature spec (from `.ai/templates/feature-spec.md`)
- Project architecture docs (`/docs/architecture/`)
- Existing codebase

## Outputs
- Implemented feature under `src/features/<name>/`
- Updated routes
- Test cases
- Documentation updates
- Quality gate reports

## Required Agents
1. Planner → decomposes spec into tasks
2. Architect → validates architecture compliance
3. Frontend → implements UI and hooks
4. Backend → implements API and business logic (when applicable)
5. Database → implements schema changes (when applicable)
6. Security → reviews security
7. QA → writes and runs tests
8. Reviewer → final quality gate
9. Documentation → updates docs

## Execution Order
```
1. Planner: Analyze spec → produce task breakdown
2. Architect: Review plan → approve architecture
3. Parallel execution:
   ├── Frontend: Implement feature
   ├── Backend: Implement API (if needed)
   └── Database: Implement schema (if needed)
4. Security: Review implementation
5. QA: Write tests → verify
6. Performance: Review performance
7. Accessibility: Review accessibility
8. Documentation: Update docs
9. Reviewer: Final review
```

## Quality Gates
- [ ] Architecture Gate (`.ai/quality-gates/architecture.md`)
- [ ] Security Gate (`.ai/quality-gates/security.md`)
- [ ] Performance Gate (`.ai/quality-gates/performance.md`)
- [ ] Accessibility Gate (`.ai/quality-gates/accessibility.md`)
- [ ] Testing Gate (`.ai/quality-gates/testing.md`)
- [ ] Documentation Gate (`.ai/quality-gates/documentation.md`)
- [ ] Code Style Gate (`.ai/quality-gates/code-style.md`)
- [ ] Type Safety Gate (`.ai/quality-gates/type-safety.md`)

## Exit Criteria
- All tasks in breakdown complete
- All quality gates pass
- Reviewer approves
- No Critical or High findings open
- TypeScript compiles (`tsc --noEmit`)
- ESLint passes (zero errors)
- Tests pass
