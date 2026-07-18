# Charts Playbook

## Best Practices
- Choose chart type based on data (bar for comparison, line for trends, pie for composition)
- Use a consistent charting library throughout the project
- Show empty state when no data available
- Show loading skeleton while chart data loads
- Handle zero values gracefully (don't show empty tooltips)
- Responsive chart sizing (use container queries)
- Color-blind friendly palettes
- Provide accessible data tables alongside visual charts
- Show exact values on hover/tap
- Support date range selection for time-series charts
- Keep charts simple — avoid 3D effects and excessive decoration

## Anti-Patterns
- Multiple charting libraries
- Non-responsive charts
- Missing loading/empty states
- Color-only data differentiation
- Over-styled or 3D charts
