// Types
export type {
  AuthUser, AuthCredentials, AuthResponse, AuthErrorCode, AuthStatus, AppRole,
  SessionData, SessionConfig, SessionStatus, BranchContext,
  PermissionCode, PermissionAction, PermissionDomain, PermissionCheck, PermissionResult, RoleDefinition,
  AuthEvent, AuthEventType,
  LoginPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload,
} from './types';

// API
export type { AuthRepository, SessionRepository, InvitationRepository } from './api';
export { fromDTO, toLoginDTO, toRegisterDTO, toResetPasswordDTO, toUpdatePasswordDTO, sessionFromDTO } from './api';
export type { AuthResponseDTO, AuthUserDTO, SessionDTO } from './api';

// Services
export { AuthService } from './services/AuthService';
export type { AuthServiceConfig } from './services/AuthService';
export { SessionService } from './services/SessionService';
export { PermissionService } from './services/PermissionService';
export { InvitationService } from './services/InvitationService';

// Stores
export { useAuthStore, useSessionStore, initialAuthState, initialSessionState } from './stores';
export type { AuthStore, AuthState, AuthActions, SessionStore, SessionState, SessionActions } from './stores';
export {
  selectUser, selectStatus, selectIsAuthenticated, selectIsLoading, selectAuthError, selectIsInitialized, selectUserRole,
  selectSession, selectSessionStatus, selectBranchContext, selectIsSessionActive, selectIsOnline,
} from './stores';

// Hooks
export { useAuth } from './hooks/useAuth';
export type { UseAuthReturn } from './hooks/useAuth';
export { usePermission } from './hooks/usePermission';
export type { UsePermissionReturn } from './hooks/usePermission';
export { useSession } from './hooks/useSession';
export type { UseSessionReturn } from './hooks/useSession';
export { useInvitation } from './hooks/useInvitation';

// Permissions
export { PermissionResolver } from './permissions/PermissionResolver';
export { RoleResolver } from './permissions/RoleResolver';

// Guards
export { ProtectedRoute } from './guards/ProtectedRoute';
export { GuestRoute } from './guards/GuestRoute';
export { PermissionRoute } from './guards/PermissionRoute';
export { RoleRoute } from './guards/RoleRoute';
export { BranchRoute } from './guards/BranchRoute';

// Components
export { PermissionGate } from './components/PermissionGate';

// Schemas
export { loginSchema, resetPasswordSchema, updatePasswordSchema, inviteSchema, acceptInviteSchema } from './schemas';
export type { LoginFormData, ResetPasswordFormData, UpdatePasswordFormData, InviteFormData, AcceptInviteFormData } from './schemas';

// Routes
export { authRoutes } from './routes';
export type { AuthRouteHandle } from './routes';

// Events
export { authEventBus } from './events/auth.events';

// Constants
export { AUTH_STORAGE_KEYS, AUTH_EVENTS, SESSION_CONFIG, AUTH_ERROR_MESSAGES, DEFAULT_REDIRECTS, ROLE_HIERARCHY, ROLE_DEFINITIONS } from './constants';
