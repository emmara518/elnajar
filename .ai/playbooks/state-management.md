# State Management Playbook

## Best Practices
- Use Zustand for global application state (auth, cart, theme, notifications)
- Use TanStack Query for server state (products, orders, customers)
- Use React Hook Form for form state
- Use React Router for URL state (search params, page)
- Use local React state for component-specific UI state (modals, toggles)
- Zustand stores: namespace by domain (auth.store.ts, cart.store.ts)
- Granular selectors to prevent unnecessary re-renders
- Feature stores in `src/features/<name>/stores/`
- Global stores in `src/stores/`
- Persist only what needs to survive refresh (theme, cart)
- Never persist sensitive data (tokens, sessions)
- Immutable updates only
- Normalize deeply nested state

## State Ownership
| State Type | Tool | Location |
|-----------|------|----------|
| Server cache | TanStack Query | In-memory cache |
| Auth session | Zustand | `stores/auth.store.ts` |
| Cart | Zustand (persisted) | `stores/cart.store.ts` |
| Theme | Zustand (persisted) | `stores/theme.store.ts` |
| UI state | React state | Component |
| Form state | React Hook Form | Component |
| URL state | React Router | URL |

## Anti-Patterns
- Global state for local concerns
- Duplicate state (same data in multiple stores)
- Derived state stored (compute instead)
- Direct store mutation
- Large stores without namespace splitting
- Persisting sensitive data
