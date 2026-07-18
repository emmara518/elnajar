# Code Review Standard

## Severity Classification

| Severity | Label | Must Fix | Examples |
|----------|-------|----------|----------|
| Critical | ❌ | Before merge | Security vulnerability, data corruption, auth bypass, broken architecture |
| High | ⚠️ | Before release | Major performance issue, missing validation, broken accessibility, maintainability issue |
| Medium | 📝 | Recommended | Code smell, naming improvement, better abstractions |
| Low | 💡 | Optional | Style consistency, minor cleanup, documentation improvement |
| Informational | ℹ️ | No action | Observation only, no change needed |

## Severity Details

### Critical
Must be fixed before the code can be merged. These findings block everything.

Examples:
- Authentication bypass possible
- SQL injection vulnerability
- XSS vulnerability
- Data corruption risk
- Secrets exposed in code
- Architecture violation (cross-feature dependency)

### High
Should be fixed before release. These findings significantly impact quality.

Examples:
- Major performance regression
- Missing input validation
- Missing authorization check
- Broken accessibility (keyboard trap, missing labels)
- Unhandled error states
- Large component needing decomposition

### Medium
Recommended improvements that would make the code better.

Examples:
- Minor code duplication
- Naming could be more descriptive
- Function slightly too long
- Missing edge case handling
- Could extract reusable hook

### Low
Optional refinements. Code is acceptable as-is but could be polished.

Examples:
- Minor style inconsistency
- Unused import (if it doesn't affect bundle)
- Comment could be clearer
- Slightly better variable name

### Informational
Observations that do not require action. The reviewer is noting something for awareness.

Examples:
- "This pattern differs from another area of the codebase"
- "Consider this for future refactoring"
- "This dependency could be replaced in a future version"

## Required Fix Rules
- All **Critical** and **High** findings must be resolved before the code can be approved
- **Medium** findings should be addressed unless there's a strong reason not to
- **Low** findings are at the implementer's discretion
- **Informational** findings require no action

## Approval Rules

### Approved
- No Critical or High findings
- All Medium findings addressed or acknowledged
- Code meets all quality gates

### Approved with Minor Changes
- No Critical findings
- All High findings addressed
- Minor changes needed (Low findings only)
- Changes don't require re-review

### Changes Requested
- One or more High findings
- Significant Medium findings
- Code must be revised and re-reviewed

### Rejected
- Critical findings present
- Architecture violation
- Security vulnerability
- Incomplete implementation
- Quality far below standards

## Review Output Format

Every review must include:
1. **Summary** — Overall assessment (1-2 sentences)
2. **Strengths** — What was done well (bullet points)
3. **Findings** — Organized by severity (Critical → High → Medium → Low → Informational)
4. **Recommendations** — Concrete next steps
5. **Final Decision** — Approved / Approved with Minor Changes / Changes Requested / Rejected

## Review Principles
- Be objective — base findings on documented standards, not personal preference
- Be respectful — critique code, not the author
- Be actionable — every finding should have a clear fix recommendation
- Be thorough — review the entire diff, not just the changed lines
- Be consistent — apply the same standards to every review
