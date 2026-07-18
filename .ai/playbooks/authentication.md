# Authentication Playbook

## Best Practices
- Use Supabase Auth for all authentication
- Store session state in Zustand auth store
- Never store raw passwords or tokens in application code
- Use JWT tokens from Supabase for API authorization
- Implement token refresh handling
- Redirect to login for protected routes
- Return to original page after login (preserve return URL)
- Show clear error messages for auth failures (wrong password, expired session, etc.)
- Never expose auth tokens in URLs or logs
- Use Row Level Security with Supabase Auth for database access
- Implement session timeout with auto-redirect
- Log all authentication failures for security monitoring

## Anti-Patterns
- Custom authentication implementation
- Storing tokens in localStorage unencrypted
- Trusting client-side role information
- Hardcoded credentials
- Bypassing auth for testing without documented exceptions
