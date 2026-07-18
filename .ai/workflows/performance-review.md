# Performance Review Workflow

## Inputs
- Feature implementation
- Bundle analysis (when available)
- Query performance data (when available)

## Outputs
- Performance review report
- Recommendations with expected impact
- Performance approval or flag

## Required Agents
1. Performance → review
2. Relevant agent (Frontend/Backend) → implement optimizations
3. Reviewer → final approval

## Execution Order
```
1. Performance: Analyze bundle size impact
2. Performance: Review render performance
3. Performance: Review database query efficiency (if applicable)
4. Performance: Write review report
5. Implementation team: Implement recommended optimizations
6. Performance: Verify improvements
```

## Quality Gates
- [ ] Performance Gate (`.ai/quality-gates/performance.md`)

## Exit Criteria
- No significant regressions
- Critical performance issues resolved
- Optimizations verified (before/after metrics)
