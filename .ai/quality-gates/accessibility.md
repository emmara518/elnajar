# Accessibility Gate

## Purpose
Ensure every interface is usable by everyone, regardless of ability.

## Checks
- [ ] All interactive elements keyboard accessible
- [ ] All form inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] Focus indicators visible on all interactive elements
- [ ] Images have alt text (decorative: alt="")
- [ ] Semantic HTML used (headings, lists, landmarks)
- [ ] ARIA attributes used correctly (only when semantic HTML insufficient)
- [ ] Color not sole means of conveying information
- [ ] Screen reader can navigate content logically

## Gatekeeper
Accessibility Agent

## Failure
Block merge if any critical accessibility barrier exists.

## Override
Only Product Owner may override with documented user impact assessment.
