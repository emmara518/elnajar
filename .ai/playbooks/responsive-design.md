# Responsive Design Playbook

## Best Practices
- Mobile-first approach (build for mobile, enhance for larger screens)
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on all breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)
- Use Stack/Grid/Flex components for responsive layouts
- Navigation: Bottom navigation on mobile, top navigation on desktop
- Tables: Card layout on mobile, table layout on desktop
- Forms: Single column on mobile, multi-column on desktop
- Images: Responsive with `sizes` attribute, WebP format
- Touch targets minimum 44×44px on mobile
- Safe area insets for notched devices (`env(safe-area-inset-*)`)
- Use Container component with appropriate max-width
- Test RTL layout on all breakpoints

## Anti-Patterns
- Desktop-first design
- Horizontal scroll on mobile
- Touch targets smaller than 44px
- Content hidden without accessible alternative on mobile
- Fixed-width layouts
