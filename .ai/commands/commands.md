# AI Commands

These commands standardize how AI agents execute workflows, reviews, and generation tasks.

## Workflow Commands

### `Execute Workflow: Feature`
Run the complete feature development workflow.
```
Run: .ai/workflows/feature.md
Input: Feature spec
Output: Implemented feature + gates + review
```

### `Execute Workflow: Bug Fix`
Run the bug fix workflow.
```
Run: .ai/workflows/bug-fix.md
Input: Bug report
Output: Fix + regression test + review
```

### `Execute Workflow: Refactor`
Run the refactoring workflow.
```
Run: .ai/workflows/refactor.md
Input: Refactor spec
Output: Refactored code + verification
```

### `Execute Workflow: Security Review`
Run the security review workflow.
```
Run: .ai/workflows/security-review.md
Input: Implementation code
Output: Security report + approval/rejection
```

### `Execute Workflow: Performance Review`
Run the performance review workflow.
```
Run: .ai/workflows/performance-review.md
Input: Implementation code
Output: Performance report + recommendations
```

### `Execute Workflow: Release`
Run the release workflow.
```
Run: .ai/workflows/release.md
Input: Release plan
Output: Deployed release + release notes
```

### `Execute Workflow: Hotfix`
Run the hotfix workflow.
```
Run: .ai/workflows/hotfix.md
Input: Critical bug report
Output: Deployed fix
```

### `Execute Workflow: Code Review`
Run the code review workflow.
```
Run: .ai/workflows/code-review.md
Input: Pull request / code diff
Output: Review report + verdict
```

### `Execute Workflow: Documentation`
Run the documentation update workflow.
```
Run: .ai/workflows/documentation.md
Input: Implementation changes
Output: Updated docs
```

### `Execute Workflow: Architecture Review`
Run the architecture review workflow.
```
Run: .ai/workflows/architecture-review.md
Input: ADR
Output: Architecture verdict
```

## Review Commands

### `Review Current Feature`
Run a full code review on the feature in the working directory.
```
Load: .ai/agents/reviewer.md
Check: .ai/quality-gates/*.md
Verify: .ai/checklists/pull-request.md
Output: Review report
```

### `Run Architecture Review`
Review the architecture of the current implementation.
```
Load: .ai/agents/architect.md
Check: .ai/quality-gates/architecture.md
Output: Architecture verdict
```

### `Run Security Review`
Review the security of the current implementation.
```
Load: .ai/agents/security.md
Check: .ai/quality-gates/security.md
Verify: .ai/checklists/security-review.md
Output: Security report
```

### `Run Accessibility Review`
Review the accessibility of the current implementation.
```
Load: .ai/agents/accessibility.md
Check: .ai/quality-gates/accessibility.md
Verify: .ai/checklists/accessibility-review.md
Output: Accessibility report
```

### `Run Performance Review`
Review the performance of the current implementation.
```
Load: .ai/agents/performance.md
Check: .ai/quality-gates/performance.md
Verify: .ai/checklists/performance-review.md
Output: Performance report
```

## Generation Commands

### `Generate ADR`
Generate an Architecture Decision Record.
```
Load: .ai/templates/architecture-decision.md
Input: Architecture change description
Output: ADR document
```

### `Generate Feature Spec`
Generate a feature specification.
```
Load: .ai/templates/feature-spec.md
Input: Feature description
Output: Feature spec document
```

### `Generate Engineering Spec`
Generate a detailed engineering specification.
```
Load: .ai/templates/engineering-spec.md
Input: Feature spec + architecture
Output: Engineering spec document
```

### `Prepare Release`
Prepare a release plan and manifest.
```
Load: .ai/workflows/release.md
Load: .ai/templates/release-plan.md
Input: List of completed features/fixes
Output: Release plan + manifest
```

## Quality Commands

### `Check Feature Checklist`
Verify against the new feature checklist.
```
Load: .ai/checklists/new-feature.md
Verify: All items
Output: Pass/Fail report
```

### `Check Definition of Done`
Verify against the global Definition of Done.
```
Load: .ai/standards/definition-of-done.md
Verify: All items
Output: Pass/Fail report
```

## Memory Commands

### `Read Project Memory`
Load all project memory documents.
```
Load: .ai/memory/architecture-decisions.md
Load: .ai/memory/coding-standards.md
Load: .ai/memory/naming-rules.md
Load: .ai/memory/folder-rules.md
Load: .ai/memory/import-rules.md
Load: .ai/memory/dependency-rules.md
Load: .ai/memory/known-constraints.md
Load: .ai/memory/future-roadmap.md
```

### `Update Project Memory`
Update memory documents after a significant decision.
```
Identify: What changed
Select: Relevant memory file(s)
Update: Reflect new decision
```
