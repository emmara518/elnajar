# Architecture Review Workflow

## Inputs
- Proposed architecture change
- Architecture Decision Record (from `.ai/templates/architecture-decision.md`)
- Current architecture documentation

## Outputs
- Architecture review verdict
- Approved/rejected ADR
- Updated architecture documentation

## Required Agents
1. Architect → review proposal
2. Documentation → update architecture docs

## Execution Order
```
1. Architect: Review ADR for completeness
2. Architect: Evaluate against system constraints
   - Scalability
   - Maintainability
   - Security
   - Performance
   - Consistency with existing architecture
3. Architect: Issue verdict (Approve / Changes Requested / Rejected)
4. Documentation: Update architecture docs if approved
```

## Quality Gates
- [ ] Architecture Gate (`.ai/quality-gates/architecture.md`)
- [ ] Documentation Gate (`.ai/quality-gates/documentation.md`)

## Exit Criteria
- ADR approved or rejected with rationale
- Architecture docs updated (if approved)
- All stakeholders informed
