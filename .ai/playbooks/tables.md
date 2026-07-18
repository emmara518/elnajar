# Tables Playbook

## Best Practices
- Use responsive table patterns (horizontally scrollable on mobile)
- Show skeleton loaders while data loads
- Handle empty state with EmptyState component
- Paginate server-side for large datasets
- Sortable columns with visual sort indicators
- Selectable rows with Checkbox component
- Row actions with IconButton (edit, delete, view)
- Sticky header on scroll
- Responsive: card layout on mobile, table on desktop
- Show total count and current range
- Loading overlay for refresh operations
- Confirmation dialog for destructive actions

## Anti-Patterns
- Loading all data client-side without pagination
- Missing loading/empty/error states
- Non-responsive tables on mobile
- Destructive actions without confirmation
