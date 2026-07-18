# Frontend Development Guide

Version: 1.0

Project: TOKYO Store

---

# Overview

The frontend is built as a modern, mobile-first Progressive Web Application (PWA) using React and TypeScript. It is designed to be fast, maintainable, secure, and scalable.

---

# Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Zustand
- Supabase JS
- React Hook Form
- Zod
- Lucide Icons

---

# Project Structure

```
src/
│
├── app/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── ui/
│   └── features/
│
├── hooks/
├── lib/
├── pages/
├── routes/
├── services/
├── stores/
├── styles/
├── types/
├── utils/
└── main.tsx
```

---

# Design Principles

- Mobile-first
- Responsive
- Component-driven
- Accessible
- Reusable
- Maintainable

---

# Component Guidelines

Every component should:

- Have a single responsibility.
- Be reusable.
- Be fully typed.
- Avoid duplicated logic.
- Receive data through props whenever possible.

---

# State Management

Use Zustand for:

- Authentication
- User Session
- Shopping Cart
- UI Preferences
- Global Notifications

Use local React state for component-specific data.

---

# Routing

Use React Router.

Route categories:

- Public Routes
- Protected Routes
- Admin Routes
- Error Routes

All protected pages must verify authentication and authorization.

---

# Forms

All forms should use:

- React Hook Form
- Zod Validation

Validation must occur on both client and server.

---

# Styling

Use TailwindCSS only.

Avoid:

- Inline styles
- CSS duplication
- Deep selector nesting

---

# Performance

Optimize by using:

- Lazy loading
- Code splitting
- Memoization where appropriate
- Image optimization
- Efficient rendering

---

# Accessibility

Every page should support:

- Keyboard navigation
- Focus management
- Semantic HTML
- ARIA attributes where needed
- Adequate color contrast

---

# Error Handling

Provide clear feedback for:

- Network failures
- Validation errors
- Authentication failures
- Unexpected errors

Never expose internal implementation details.

---

# Folder Naming

Use:

- PascalCase for components
- camelCase for hooks and utilities
- kebab-case for folders where appropriate

---

# Coding Standards

- Strict TypeScript
- ESLint compliance
- Consistent formatting
- No unused imports
- No `any` unless absolutely necessary

---

# Testing

Frontend changes should include:

- Unit tests for business logic
- Component tests where appropriate
- End-to-end validation for critical user flows

---

# Definition of Done

A frontend feature is complete when:

- UI matches the design.
- Responsive behavior is verified.
- Accessibility requirements are met.
- Performance is acceptable.
- Tests pass.
- Documentation is updated if necessary.

---

# Best Practices

- Prefer composition over inheritance.
- Keep components small and focused.
- Avoid premature optimization.
- Reuse existing UI components before creating new ones.
- Follow the established design system.

---

# Final Rule

Every frontend change should improve the user experience without compromising maintainability, performance, or security.