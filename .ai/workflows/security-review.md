# Security Review Workflow

## Inputs
- Feature implementation or code changes
- Architecture diagram (if applicable)
- RLS policies (if database changes)

## Outputs
- Security review report
- Vulnerability findings by severity
- Remediation recommendations
- Security approval or rejection

## Required Agents
1. Security → conduct review
2. Architect → validate architecture impact (if any)
3. Reviewer → final approval

## Execution Order
```
1. Security: Run automated security analysis
2. Security: Manual code review for:
   - Authentication
   - Authorization
   - Input validation
   - Output encoding
   - Secret handling
   - RLS policies
3. Security: Write review report with findings
4. Implementation team: Fix findings
5. Security: Verify fixes
```

## Quality Gates
- [ ] Security Gate (`.ai/quality-gates/security.md`)
- [ ] Architecture Gate (`.ai/quality-gates/architecture.md`)

## Exit Criteria
- No Critical vulnerabilities
- All High issues fixed
- Security approves
- Fixes verified
