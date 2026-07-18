# Pull Request Checklist

- [ ] Title follows convention: `type(scope): description`
- [ ] Description includes what and why
- [ ] Links to related spec/issue
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] ESLint passes (zero errors)
- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Changes are atomic (one feature/fix per PR)
- [ ] Branch name follows convention: `type/description`
- [ ] No unrelated changes included
- [ ] No debug code or console.log
- [ ] Barrel exports updated (if new modules added)
- [ ] Documentation updated (if API/behavior changed)
