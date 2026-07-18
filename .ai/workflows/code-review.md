# Code Review Workflow

## Inputs
- Pull request or code diff
- Feature/bug spec (when applicable)

## Outputs
- Review report with findings by severity
- Final decision: Approved / Minor Changes / Changes Requested / Rejected

## Required Agents
1. Reviewer → conduct review
2. Relevant agents → address findings

## Execution Order
```
1. Reviewer: Load review standard (`.ai/reviews/review-standard.md`)
2. Reviewer: Verify TypeScript compiles
3. Reviewer: Verify ESLint passes
4. Reviewer: Systematic review of changed files
5. Reviewer: Classify every finding by severity
6. Reviewer: Document strengths and findings
7. Reviewer: Issue final decision
```

## Quality Gates
- [ ] All relevant gates depending on change scope

## Review Scope
- [ ] Architecture compliance
- [ ] Code quality and readability
- [ ] TypeScript type safety
- [ ] Design system usage
- [ ] Error handling completeness
- [ ] Loading/empty/error states
- [ ] Security impact
- [ ] Performance impact
- [ ] Documentation impact

## Exit Criteria
- All Critical and High findings resolved
- Final verdict issued
- Code ready for merge
