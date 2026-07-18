# Security Gate

## Purpose
Ensure the implementation is free of security vulnerabilities and follows secure development practices.

## Checks
- [ ] Authentication enforced where required
- [ ] Authorization enforced on every protected operation
- [ ] All inputs validated (client + server)
- [ ] No secrets in source code
- [ ] RLS policies applied to all protected tables
- [ ] SQL injection not possible
- [ ] XSS not possible
- [ ] Error responses do not leak internals
- [ ] File uploads validate type and size
- [ ] No hardcoded credentials or API keys

## Gatekeeper
Security Agent

## Failure
Block merge immediately. Security issues always take priority.

## Override
Only Security Architect may override, with documented risk acceptance.
