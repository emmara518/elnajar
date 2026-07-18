# Forms Playbook

## Best Practices
- Use React Hook Form for all form state management
- Use Zod for schema validation (client + server shared schemas)
- Define Zod schemas in feature's `schemas/` directory
- All form inputs use design system components (Input, Select, Checkbox, RadioGroup)
- Show inline validation errors below each field
- Disable submit button while submitting
- Show loading spinner on submit button during submission
- Handle server validation errors and map to form fields
- Reset form on successful submission
- Confirm navigation away from dirty forms
- Support RTL layout correctly (form layout mirrors in RTL)
- Group related fields with Section component

## Anti-Patterns
- Inline validation without schemas
- Multiple form libraries
- Missing loading state on submit
- Not handling server-side validation errors
- Losing form state on navigation
