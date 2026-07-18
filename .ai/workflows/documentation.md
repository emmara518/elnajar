# Documentation Workflow

## Inputs
- Implementation changes
- Architecture decisions
- API changes
- Schema changes

## Outputs
- Updated documentation files
- Release notes (when applicable)
- Documentation consistency report

## Required Agents
1. Documentation → update docs
2. Reviewer → verify accuracy

## Execution Order
```
1. Documentation: Identify all impacted documents
2. Documentation: Update documents to match implementation
3. Documentation: Verify cross-references remain valid
4. Reviewer: Verify documentation accuracy
```

## Quality Gates
- [ ] Documentation Gate (`.ai/quality-gates/documentation.md`)

## Exit Criteria
- All impacted documents updated
- No inconsistency between docs and implementation
- Cross-references verified
- Reviewer approves documentation
