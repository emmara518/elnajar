# Filtering Playbook

## Best Practices
- Use URL search params for filter state (shareable/bookmarkable)
- Debounce filter changes (300ms)
- Show active filter count badge
- Allow clearing individual filters and all filters
- Preserve filters on navigation (URL persistence)
- Show filter options as Checkbox, Select, or RadioGroup
- Mobile: show filters in a Drawer
- Desktop: show filters in a sidebar or horizontal bar
- Disable irrelevant filter options based on current selection
- Show result count update as filters change
- Handle no results with clear filter suggestion

## Anti-Patterns
- Filter state only in component (lost on navigation)
- No visual feedback for active filters
- Filters reset unexpectedly
- Too many filters without grouping
- No mobile responsive filter layout
