# Storefront Feature

## Purpose

The storefront is the public-facing e-commerce frontend of TOKYO Store. It provides product browsing, search, cart management, wishlist, and the complete shopping experience before checkout.

## Architecture

```
pages/ → hooks/ → services/ → api/
                  ↕
               stores/
```

### Layer Separation

| Layer | Responsibility | Imports From |
|---|---|---|
| `layouts/` | Page shell (Header, Footer, Nav, etc.) | stores, constants, design-system |
| `pages/` | Full page composition | layouts, components, hooks |
| `components/` | Reusable UI blocks (ProductCard, HeroBanner, etc.) | stores, types, utils, design-system |
| `hooks/` | Stateful logic (useProducts, useCategories) | stores, services, types |
| `services/` | Service interfaces (DI-ready, not implemented) | types |
| `stores/` | Zustand state containers | types |
| `types/` | TypeScript interfaces and types | — |
| `constants/` | Configuration values | — |
| `utils/` | Pure utility functions | types, constants |

## Folder Responsibilities

```
storefront/
├── api/             # DTO types for API responses
├── components/      # Storefront UI components
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── HeroBanner.tsx
│   ├── CategoryCard.tsx
│   ├── FeatureCard.tsx
│   ├── BrandCard.tsx
│   ├── TestimonialCard.tsx
│   ├── NewsletterForm.tsx
│   └── FlashDealCard.tsx
├── hooks/           # Storefront React hooks
│   ├── useProducts.ts
│   └── useCategories.ts
├── layouts/         # Storefront layout components
│   ├── StoreLayout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MegaMenu.tsx
│   ├── MobileNav.tsx
│   ├── SearchOverlay.tsx
│   ├── AnnouncementBar.tsx
│   └── Breadcrumbs.tsx
├── pages/           # Storefront page components
│   ├── HomePage.tsx
│   ├── CategoriesPage.tsx
│   ├── ProductListingPage.tsx
│   ├── SearchResultsPage.tsx
│   ├── WishlistPage.tsx
│   ├── CartPage.tsx
│   ├── NotFoundPage.tsx
│   └── ComingSoonPage.tsx
├── routes/          # Route configuration with StoreLayout
├── services/        # Service interfaces (not implemented)
├── stores/          # Zustand stores
│   ├── cart.store.ts
│   ├── wishlist.store.ts
│   ├── search.store.ts
│   └── ui.store.ts
├── types/           # TypeScript types
├── schemas/         # Zod validation schemas
├── constants/       # Configuration constants
└── utils/           # Pure utility functions
```

## Navigation Flow

```
Home → Categories → Category Detail → Product Listing → Product Detail
  → Search Results
  → Wishlist
  → Cart
  → Account
```

## Storefront Lifecycle

1. **StoreLayout mounts**: AnnouncementBar + Header + Suspense + Footer + MobileNav
2. **Page loads**: Lazy-loaded via `React.lazy()` and `<Suspense>`
3. **Data fetch**: Hooks call store selectors → services (when implemented)
4. **State updates**: Zustand stores update → UI re-renders reactively

## SEO Strategy

- All routes have `StorefrontRouteHandle` with `title` and `description`
- Meta tags managed by route handle metadata
- Breadcrumb schema via `Breadcrumbs` component
- Semantic HTML: `header`, `nav`, `main`, `footer`, `section`, `article`
- Lazy images with `loading="lazy"`
- Proper heading hierarchy (h1 → h2 → h3)
- Arabic `lang` and `dir` attributes
- Structured data ready for Product and BreadcrumbList schemas

## Performance Strategy

- **Lazy loading**: All pages via `React.lazy()`
- **Skeleton loading**: `ProductCardSkeleton` for product grids
- **Image optimization**: `loading="lazy"` on product images
- **Reactive state**: Zustand with per-field selectors
- **Minimal re-renders**: Selectors prevent unnecessary re-renders
- **CSS-only animations**: Tailwind transitions and transforms
- **Passive scroll listeners**: `{ passive: true }` on scroll events

## Extension Strategy

### Adding a new page type
1. Create page component in `pages/`
2. Add route in `routes/index.tsx`
3. Add lazy import at top
4. Export from barrel `index.ts`

### Adding a new product section to HomePage
1. Add section data to `constants/index.ts`
2. Create section component in `components/`
3. Add to `HomePage.tsx`

### Connecting to a real API
1. Implement `ProductService` with HTTP calls
2. Wire into `useProducts` hook
3. Done — no component changes needed (DI-ready interfaces)

### Adding a new store
1. Create `stores/new.store.ts`
2. Define State + Actions + Store types
3. Export from `stores/index.ts` and barrel `index.ts`

## Available Stores

| Store | Purpose |
|---|---|
| `useCartStore` | Cart items, quantities, summary, coupon |
| `useWishlistStore` | Wishlist items (product IDs) |
| `useSearchStore` | Search query, suggestions, history |
| `useUIStore` | Mega menu, mobile menu, modals, scroll state |

## Hooks

| Hook | Purpose |
|---|---|
| `useProducts(params)` | Product list state (pagination, sort, filters) |
| `useCategories()` | Category state |

## Layout Components

| Component | Description |
|---|---|
| `StoreLayout` | Root layout wrapping all storefront pages |
| `AnnouncementBar` | Top promo bar |
| `Header` | Sticky header with nav, search, wishlist, cart |
| `MegaMenu` | Full-width category dropdown |
| `MobileNav` | Fixed bottom nav on mobile |
| `SearchOverlay` | Full-screen search overlay |
| `Footer` | 4-column footer with links |
| `Breadcrumbs` | Auto-generated breadcrumb trail |

## Design System Usage

All components use ONLY design system exports from `@/design-system`:
- Layout: Container, Section, Stack, Grid, Flex, Card
- UI: Badge, Skeleton, Spinner, EmptyState, Avatar, Divider
- Forms: Button, Input, Select
- Foundation: Toast (ready for notifications)

No duplicated UI. No inline styles. No external CSS.
