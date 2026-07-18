# Pagination Playbook

## Best Practices
- Server-side pagination for all list endpoints
- Use URL search params for page state (shareable)
- Show page number, total pages, and total items
- Previous/Next buttons with disabled states at boundaries
- First/Last page buttons for large datasets
- Page size selector (10, 20, 50, 100)
- Infinite scroll as alternative for content browsing
- Preserve page on navigation back
- Scroll to top on page change
- Loading indicator on page transition
- Handle empty page gracefully (no results message)

## Anti-Patterns
- Client-side pagination for large datasets
- Page state only in component
- No loading state on page change
- Missing total count
- Scroll position not preserved on back
