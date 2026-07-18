# Dependency Rules (Memory)

## Key Rules
Direction: Components → Hooks → Services → Repository → Infrastructure

### What can depend on what
| Layer | Can Import From |
|-------|----------------|
| Components | Hooks, Design System, Types, Constants, Utils |
| Hooks | Services, Stores, Types, Constants, Utils |
| Services | Repositories, Types, Constants, Utils |
| Repositories | Infrastructure, Types/DTOs |
| Stores | Types, Constants |

### Forbidden
- Components → Services (must use hooks)
- Components → Repositories
- Hooks → Components
- Features → Other Features

## Sources
- Full rules: `.ai/standards/dependency-rules.md`
