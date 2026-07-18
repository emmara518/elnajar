# Auth Feature — Authentication & Authorization Platform

## Architecture Overview

The Auth feature follows a strict layered architecture. Data flows in one direction only:

```
Pages (UI)
   ↓
Guards (Route protection)
   ↓
Hooks (Logic + Store access)
   ↓
Services (Business logic)
   ↓
Repository (API layer / interface)
   ↓
Infrastructure (Supabase, HTTP client, etc.)
       ↕
    Stores (Zustand — global state)
       ↕
    Events (AuthEventBus — cross-cutting notifications)
```

### Layer Responsibilities

| Layer | Role |
|---|---|
| **API** | Repository interfaces (`AuthRepository`, `SessionRepository`, `InvitationRepository`), DTOs, and mapper functions (`fromDTO`, `toLoginDTO`, etc.). The concrete implementation lives outside this feature (injected via DI). |
| **Services** | `AuthService` — login, logout, token refresh, password reset. `SessionService` — session lifecycle, auto-refresh timers, idle detection. `PermissionService` — permission checks with caching. `InvitationService` — invite flows. |
| **Stores** | `auth.store` — user, status, error. `session.store` — session data, branch context, online status. Zustand with granular selectors for re-render optimization. |
| **Hooks** | `useAuth` — login/logout actions, user state. `usePermission` — permission queries bound to current user. `useSession` — session status, branch context, activity tracking. `useInvitation` — invite/accept flows. |
| **Guards** | `ProtectedRoute` — redirects unauthenticated users. `GuestRoute` — redirects authenticated users away. `PermissionRoute` — checks permission codes. `RoleRoute` — checks role hierarchy. `BranchRoute` — checks branch context. |
| **Components** | `PermissionGate` — declarative conditional rendering based on permissions. |
| **Pages** | `LoginPage`, `LogoutPage`, `ResetPasswordPage`, `InvitePage`, `AcceptInvitePage`, `UnauthorizedPage`. All lazy-loaded. |
| **Events** | `AuthEventBus` — pub/sub for cross-cutting auth events (login success/failure, session expiry, permission changes). |
| **Schemas** | Zod validation schemas for all auth forms: `loginSchema`, `resetPasswordSchema`, `updatePasswordSchema`, `inviteSchema`, `acceptInviteSchema`. |
| **Permissions** | `PermissionResolver` — resolves permission codes against the user's list. `RoleResolver` — resolves role hierarchy levels from `ROLE_HIERARCHY`. |
| **Constants** | Storage keys, event names, session config, error messages, redirect paths, role hierarchy, role definitions. |

---

## Authentication Flow

### Login Flow (Detailed)

```
1. User fills LoginPage form and submits
2. loginSchema.safeParse() validates email + password
3. If invalid, field-level errors shown (Arabic)
4. If valid → handleSubmit calls useAuth().login(payload)
5. useAuth sets status='loading' in auth.store
6. AuthService.login() calls AuthRepository.login()
7. Repository POSTs to /auth/login (via injected HTTP client)
8. On success: AuthResponseDTO returned → fromDTO() maps to AuthUser
9. loginAction(response.data.user) in store sets status='authenticated'
10. Session created in session.store with tokens + expiry
11. authEventBus emits LOGIN_SUCCESS
12. User redirected to `from` location or `/`
13. On failure: auth.store.status='unauthenticated', error set
14. authEventBus emits LOGIN_FAILURE
```

### Token Refresh Flow

```
1. SessionService starts a timer: expiresAt - refreshBufferMinutes(5)
2. When timer fires, SessionService.refreshSession() called
3. Refreshed tokens stored in session.store
4. authEventBus emits TOKEN_REFRESHED
5. Timer restarted with new expiry
6. If refresh fails → SESSION_EXPIRED event → useAuth listener fires logout
```

---

## Authorization Flow

### Permission Resolution

```
Component/PermissionGate
   ↓  "hasPermission('sales.view')?"
usePermission hook
   ↓  Instantiates PermissionService with user.permissions
PermissionService.hasPermission(code)
   ↓  Checks this.permissions.includes(code)
   ↓  Caches result in permissionCache (Map<string, boolean>)
Returns boolean
```

### Role Hierarchy Resolution

```
ROLE_HIERARCHY = {
  owner:     100,
  admin:     80,
  manager:   60,
  accountant: 40,
  inventory:  30,
  cashier:   20,
  viewer:    10,
}
```

`RoleResolver.hasMinimumRole('manager')` returns `true` for owner(100 ≥ 60), admin(80 ≥ 60), and manager(60 ≥ 60).

### Route Protection Decision Tree

```
Route requested
       ↓
ProtectedRoute wrapper?
  Yes → isInitialized? → No → LoadingScreen
         ↓
       isAuthenticated? → No → Navigate to /auth/login + from state
         ↓
       Render children
         ↓
RoleRoute wrapper?
  Yes → hasMinimumRole? → No → Navigate to /auth/unauthorized
         ↓
       Render children
         ↓
BranchRoute wrapper?
  Yes → hasBranchAccess? → No → Navigate to /branch-select
         ↓
       Render children
```

---

## Session Lifecycle

```
LOGIN
  ↓
ACTIVE ──────────────────────────────────────────────────┐
  ↓                                                        │
  ├── Auto-refresh timer (5min before token expiry)        │
  │     ↓                                                  │
  │   REFRESHING → token refreshed → ACTIVE               │
  │                                                        │
  ├── Activity detected (mousemove, keydown, click)        │
  │     ↓                                                  │
  │   Idle timer reset (30min timeout)                     │
  │                                                        │
  ├── No activity for 30min                                │
  │     ↓                                                  │
  │   IDLE → can resume on next activity                  │
  │     ↓                                                  │
  │   No activity for another 5min (grace period)          │
  │     ↓                                                  │
  │   Session auto-terminated                              │
  │     ↓                                                  │
  │   EXPIRED                                              │
  │     ↓                                                  │
  │   authEventBus: SESSION_EXPIRED                        │
  │     ↓                                                  │
  │   useAuth listener → logoutAction() → Navigate /login  │
  │                                                        │
  └── Manual logout                                        │
        ↓                                                  │
      TERMINATED → store cleared → Navigate /login         │
```

---

## Permission Model

### Permission Codes

Format: `{domain}.{action}` or `{domain}.{action}.{qualifier}`

```typescript
type PermissionDomain = 'dashboard' | 'sales' | 'purchases' | 'inventory'
  | 'customers' | 'suppliers' | 'employees' | 'reports' | 'settings' | 'system';

type PermissionAction = 'view' | 'create' | 'update' | 'delete'
  | 'approve' | 'export' | 'import' | 'manage';

// Examples:
'sales.view'
'sales.create'
'reports.export'
'employees.manage'
'settings.update.branch'
```

### Key Design Decisions

- **No hardcoded permissions in UI components.** Permission codes are passed as props (to `PermissionGate` or `PermissionRoute`) or checked via `usePermission`.
- **Generic PermissionService.** It checks whether a code exists in the user's permission array. No domain knowledge in the service.
- **PermissionResolver** wraps `PermissionService` with batch resolution for page-level access checks.
- **RoleResolver** handles role-level access using `ROLE_HIERARCHY` numeric levels.

### PermissionGate Usage

```tsx
// Single permission
<PermissionGate permission="sales.create">
  <AddSaleButton />
</PermissionGate>

// Any permission (OR)
<PermissionGate permissions={['reports.view', 'reports.export']}>
  <ReportsPanel />
</PermissionGate>

// All permissions (AND)
<PermissionGate permissions={['employees.view', 'employees.manage']} requireAll>
  <EmployeeManagement />
</PermissionGate>

// With fallback
<PermissionGate permission="admin.panel" fallback={<ReadonlyView />}>
  <AdminPanel />
</PermissionGate>
```

---

## Folder Responsibilities

```
src/features/auth/
├── api/
│   ├── types.ts          # AuthDTO, LoginRequest, etc.
│   ├── repository.ts     # Repository interfaces + mapper functions
│   └── index.ts          # Barrel exports
├── components/
│   ├── PermissionGate.tsx # Declarative permission wrapper
│   └── index.ts
├── constants/
│   └── index.ts          # Storage keys, config, error messages, redirects, role hierarchy
├── events/
│   ├── auth.events.ts    # AuthEventBus (pub/sub)
│   └── index.ts
├── guards/
│   ├── ProtectedRoute.tsx  # Redirects unauthenticated
│   ├── GuestRoute.tsx      # Redirects authenticated
│   ├── PermissionRoute.tsx # Permission code check
│   ├── RoleRoute.tsx       # Role hierarchy check
│   ├── BranchRoute.tsx     # Branch context check
│   └── index.ts
├── hooks/
│   ├── useAuth.ts         # Authentication actions + state
│   ├── usePermission.ts   # Permission queries
│   ├── useSession.ts      # Session lifecycle + branch
│   ├── useInvitation.ts   # Invite flows
│   └── index.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── LogoutPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── InvitePage.tsx
│   ├── AcceptInvitePage.tsx
│   ├── UnauthorizedPage.tsx
│   └── index.ts
├── permissions/
│   ├── PermissionResolver.ts  # Batch permission resolution
│   ├── RoleResolver.ts        # Role hierarchy resolution
│   └── index.ts
├── routes/
│   └── index.tsx              # Auth route objects (lazy + guards)
├── schemas/
│   └── index.ts               # Zod validation schemas
├── services/
│   ├── AuthService.ts         # Login, logout, refresh, register, reset
│   ├── SessionService.ts      # Session lifecycle, timers, idle detection
│   ├── PermissionService.ts   # Permission checks with caching
│   ├── InvitationService.ts   # Invite creation + acceptance
│   └── index.ts
├── stores/
│   ├── auth.store.ts          # Auth state (user, status, error)
│   ├── session.store.ts       # Session state (data, branch, online)
│   └── index.ts
├── types/
│   ├── index.ts               # All auth domain types
│   └── api.ts                 # API request/response types
├── index.ts                   # Barrel exports (everything public)
└── README.md                  # This file
```

---

## Extension Strategy

### Adding a New Role

1. Add role to `AppRole` type in `types/index.ts`
2. Add entry to `ROLE_HIERARCHY` in `constants/index.ts` (assign numeric level)
3. Add entry to `ROLE_DEFINITIONS` in `constants/index.ts` (label, labelAr, permissions)
4. The `RoleResolver` automatically picks up the new role from `ROLE_HIERARCHY`

### Adding a New Permission

1. Add to `PermissionDomain` or `PermissionAction` in `types/index.ts`
2. Assign the code to the appropriate role definitions in `ROLE_DEFINITIONS`
3. Use `PermissionGate` or `PermissionRoute` with the new code
4. No changes needed to `PermissionService` — it is generic

### Adding OAuth Authentication

1. Create new method in `AuthService` (e.g., `loginWithOAuth(provider)`)
2. Add OAuth provider type to `types/index.ts`
3. Add route/guard if needed (e.g., OAuth callback handler)
4. Handle the OAuth callback in a new page or the existing `LoginPage`

### Adding OTP Authentication

1. Add OTP types to `types/index.ts` (`OtpPayload`, `OtpVerificationPayload`)
2. Add OTP schemas to `schemas/index.ts`
3. Add OTP methods to `AuthService` and `AuthRepository`
4. Create OTP verification page if needed

### Adding a New Auth Event

1. Add event type string to `AuthEventType` in `types/index.ts`
2. (Optional) Add event name mapping in `AUTH_EVENTS` constant
3. Emit from the appropriate service using `authEventBus.emit()`
4. Subscribe where needed using `authEventBus.on()`

---

## Security Decisions

### ❌ Why tokens never go in localStorage

- localStorage is accessible to any JavaScript running on the same origin, making it vulnerable to XSS attacks.
- Even with CSP headers, a single XSS vulnerability exposes all tokens.

### ✅ Why session is in SessionStorage

- SessionStorage data is cleared when the tab/window is closed (ephemeral).
- If `rememberMe` is true, a persistent refresh token (HTTP-only cookie) is used instead.
- The session data in SessionStorage is a mirror of the server-side session.

### ❌ Why no permission logic in components

- Hardcoded permission logic is brittle — every permission change requires a code change.
- `PermissionService` is generic: `hasPermission(code)` checks array inclusion. No domain knowledge.
- `PermissionGate` is a declarative wrapper: pull permission codes from a config/lookup, not hardcoded strings.

### ✅ Refresh Token Rotation

- Each refresh returns a new refresh token (rotation).
- Old refresh tokens are invalidated server-side.
- Protects against replay attacks.

### ✅ Session Activity Tracking

- Mousemove, keydown, click, and touchstart events reset the idle timer.
- Idle timeout of 30min (configurable via `SESSION_CONFIG`).
- After idle, session transitions to `IDLE` state (not immediately expired).
- `BranchRoute` ensures user must select a branch before accessing branch-scoped routes.

### Event Bus Pattern

`AuthEventBus` enables loose coupling between auth services and UI. Services emit events without knowing who's listening. This keeps the service layer clean and testable while allowing multiple UI components to react to auth state changes without circular dependencies.

---

## Testing Strategy

### Unit Tests

| Module | Test Cases |
|---|---|
| `PermissionService` | `hasPermission` with matched/unmatched codes, `hasAnyPermission`, `hasAllPermissions`, `check` returns correct `PermissionResult`, cache invalidation |
| `RoleResolver` | `hasMinimumRole` with hierarchy, `hasExactRole`, `getRoleLevel`, `getRolesAbove/Below`, `isSystemRole` |
| `SessionService` | Timer setup/teardown, idle detection, refresh scheduling, status transitions |
| `AuthService` | Successful login returns mapped user, failed login returns error, logout clears state, token refresh on expiry |
| `Schemas` | Valid/invalid inputs for each schema, refinement validators (password match) |
| `Mappers` | `fromDTO` maps snake_case to camelCase, `toLoginDTO` maps camelCase to snake_case |
| `AuthEventBus` | `emit` calls registered listeners, `on` returns unsubscribe function, `removeAll` clears all |
| `PermissionResolver` | `resolvePagePermissions` returns correct canAccess + missing permissions |

### Integration Tests

| Scenario | What to Test |
|---|---|
| `useAuth` + `AuthService` + `auth.store` | Login flow through all layers, error propagation, state updates |
| `usePermission` + `PermissionService` | Permission reactivity when user permissions change |
| `useSession` + `SessionService` + `session.store` | Session status transitions, branch context updates |
| `ProtectedRoute` + `auth.store` | Redirect behavior for authenticated/unauthenticated states |
| `GuestRoute` + `auth.store` | Redirect behavior for authenticated users |
| `PermissionRoute` + `usePermission` | Access granted/denied based on permission codes |
| `RoleRoute` + `usePermission` | Access based on role hierarchy minimum |
| `BranchRoute` + `session.store` | Branch access validation |

### E2E Tests

| Flow | Steps |
|---|---|
| Login → Dashboard | Navigate to login → enter credentials → submit → verify redirect to dashboard → verify user name displayed |
| Login → redirect to original URL | Visit protected URL → redirected to login → login → redirected back |
| Logout | Login → navigate to logout → verify redirect to login → verify protected route redirects again |
| Reset Password | Navigate to reset → enter email → submit → verify success message |
| Invite Employee | Login as owner → navigate to invite → fill form → submit → verify success |
| Accept Invite | Open invite URL with token → fill name + password → submit → verify redirect to login |
| Unauthorized Access | Login as viewer → visit `/auth/invite` → verify redirect to unauthorized page |
| Session Expiry | Wait for token to expire (or mock) → verify redirect to login on next action |
| Offline Handling | Login → go offline → verify online status changes → go online → verify recovery |

### Testing Utilities Needed

- `createMockAuthService()` — returns mocked `AuthService` with configurable responses
- `createMockPermissionService()` — returns `PermissionService` with injected permissions
- `createMockSessionService()` — returns mocked `SessionService` with controlled timers
- `renderWithAuth()` — test wrapper that provides auth store + guards context
- `createAuthStore()` — helper to create isolated store instances for testing

---

## Error Handling

All services return `ApiResponse<T>` with a consistent error shape:

```typescript
interface ApiError {
  message: string;  // Arabic user-facing message
  code: string;     // Machine-readable error code (AUTH_ERROR_MESSAGES keys)
  status: number;   // HTTP status code or 0 for network errors
}
```

Error codes are mapped to Arabic messages via `AUTH_ERROR_MESSAGES` in constants. Services never expose raw system errors to the UI.

---

## Dependency Injection

Services receive their repository dependency via constructor injection:

```typescript
const authService = new AuthService(supabaseAuthRepository);
const sessionService = new SessionService(supabaseSessionRepository, { idleTimeoutMinutes: 15 });
const permissionService = new PermissionService(user.permissions);
const invitationService = new InvitationService(supabaseInvitationRepository);
```

This makes services testable (mock the repository) and framework-agnostic (swap Supabase for a different backend without changing business logic).

## License

TOKYO Store — All rights reserved.
