# TOKYO Store AI Engineering Platform

This is the AI Operating System for the TOKYO Store project.

Every AI agent working on this project MUST follow the documents in this directory.

## Structure

```
.ai/
├── agents/        # Agent role definitions
├── workflows/     # Standardized execution workflows
├── playbooks/     # Best-practice patterns
├── quality-gates/ # Mandatory quality checks
├── templates/     # Spec and document templates
├── specs/         # Active feature specifications
├── checklists/    # Verification checklists
├── reviews/       # Code review standards
├── standards/     # Engineering standards
├── commands/      # AI command definitions
├── memory/        # Project memory and decisions
└── context/       # Session context storage
```

## How to Use

1. Read `.ai/` before starting any task
2. Select the appropriate workflow from `.ai/workflows/`
3. Load the required agents from `.ai/agents/`
4. Consult playbooks from `.ai/playbooks/` for patterns
5. Pass through quality gates in `.ai/quality-gates/`
6. Use templates from `.ai/templates/` for specs
7. Verify against checklists in `.ai/checklists/`
8. Follow standards in `.ai/standards/`
9. Update `.ai/memory/` after any architecture decision
10. Run commands from `.ai/commands/` to invoke workflows

## Mandatory Rule

No feature passes unless every quality gate succeeds.

## Source of Truth

The `/docs` directory is the authoritative source. `.ai/` is the execution engine.

`.ai/` must NEVER contradict `/docs/`.
