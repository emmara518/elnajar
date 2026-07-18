# Search Playbook

## Best Practices
- Debounce search input (300ms default)
- Show search results as user types
- Clear search with one click (X button)
- Show recent searches (stored locally)
- Highlight matched terms in results
- Handle empty results with helpful message
- Support RTL correctly in search input
- Keyboard shortcut to focus search (/)
- Escape key to clear and blur
- Search URL param for shareable search results
- Show search result count
- Loading state while searching

## Anti-Patterns
- Searching on every keystroke without debounce
- No loading indicator
- Empty results without guidance
- Case-sensitive search without normalization
- Clearing search on navigation
