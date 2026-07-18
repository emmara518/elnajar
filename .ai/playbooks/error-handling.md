# Error Handling Playbook

## Best Practices
- Use Result pattern for service layer operations (Success/Failure)
- User-facing errors: meaningful messages (Arabic), no technical jargon
- Developer-facing errors: include error codes and context
- Network errors: show retry button, auto-retry for transient failures
- Validation errors: inline below fields, clear guidance
- Authentication errors: redirect to login, preserve return URL
- Authorization errors: show 403 page, no details about permission structure
- Server errors: generic message with tracking ID for support
- Not found: show 404 page with navigation options
- Log all unexpected errors with context (not to user)
- Error boundary at route level for React crashes
- Never expose stack traces or internal state

## Anti-Patterns
- Swallowing errors silently
- Exposing stack traces to users
- Technical error messages
- No recovery action (retry, navigate back, contact support)
- Inconsistent error patterns across features
