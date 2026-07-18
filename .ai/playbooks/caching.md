# Caching Playbook

## Best Practices
- Use TanStack Query for server state caching
- Set appropriate stale times per data type:
  - Products: 10 minutes
  - Categories: 1 hour
  - Settings: 24 hours
  - Dashboard: 2 minutes
  - Reports: 5 minutes
  - Profile: 15 minutes
- Cache invalidation after mutations (create/update/delete)
- Optimistic updates for user-facing mutations (wishlist, cart)
- Use query keys consistently: `["entity", ...params]`
- Cache paginated results with page-specific keys
- Implement background refetch for stale data
- Avoid over-fetching — cache intelligently
- Never cache sensitive data (tokens, personal info)
- Use Zustand persist for UI preferences (theme, language)

## Anti-Patterns
- No cache invalidation strategy
- Over-fetching due to short stale times
- Caching sensitive data
- Cache key collisions
- Not handling stale-while-revalidate
