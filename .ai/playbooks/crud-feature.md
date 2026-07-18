# CRUD Feature Playbook

## Best Practices
- Follow `src/features/_example/` template exactly
- Types: Define domain types, API request/response types, DTOs
- Schemas: Zod for create + update + filter
- Repository: Interface with list/getById/create/update/delete methods
- Service: Wrap repository with error handling, DI-ready constructor
- Store: Zustand with state, actions, selectors (initialState exported)
- Hooks: useFeature() for reads, useFeatureActions() for writes
- Pages: List page + Detail/Create/Edit pages, lazy-loaded
- Routes: Nested under feature path, permission-ready handle
- List: Pagination, filtering, sorting support
- Error states: Handle every API call failure gracefully
- Loading states: Skeleton loaders for lists, spinner for actions
- Empty states: Clear message when no data
- Barrel: Export all public types through index.ts

## Anti-Patterns
- Business logic in components
- Direct API calls from components
- Duplicate API logic across features
- Missing error/loading/empty states
- Not following the _example template
