# Security Review Checklist

- [ ] Authentication enforced on all protected endpoints
- [ ] Authorization verified for each protected operation
- [ ] Input validation (client + server)
- [ ] Output encoding (no XSS)
- [ ] SQL injection not possible (parameterized queries)
- [ ] RLS policies correct and tested
- [ ] No secrets in source code
- [ ] No hardcoded credentials
- [ ] File upload validation (type, size, permissions)
- [ ] Error responses hide internals
- [ ] Session management secure
- [ ] CORS configured correctly
- [ ] HTTPS enforced
- [ ] Dependency vulnerabilities checked
