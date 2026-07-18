export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type AppRole = 'owner' | 'branch_manager' | 'cashier' | 'support' | 'guest';

export type PermissionCode = string;

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'export' | 'approve';

export type PermissionDomain =
  | 'products' | 'sales' | 'inventory' | 'employees' | 'customers'
  | 'suppliers' | 'purchases' | 'expenses' | 'shifts' | 'reports'
  | 'settings' | 'users' | 'roles' | 'audit';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  roleId: string;
  employeeId?: string;
  branchId?: string;
  companyId?: string;
  avatarUrl?: string;
  phone?: string;
  permissions: PermissionCode[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED' | 'EMAIL_NOT_VERIFIED'
  | 'SESSION_EXPIRED' | 'TOKEN_INVALID' | 'TOKEN_REFRESH_FAILED'
  | 'NETWORK_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'BRANCH_REQUIRED'
  | 'INVITATION_INVALID' | 'INVITATION_EXPIRED' | 'PASSWORD_WEAK'
  | 'ACCOUNT_LOCKED' | 'MAX_ATTEMPTS_EXCEEDED' | 'UNKNOWN';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
  deviceInfo?: {
    userAgent: string;
    ip?: string;
  };
}

export interface SessionConfig {
  idleTimeoutMinutes: number;
  refreshThresholdMinutes: number;
  maxConcurrentSessions: number;
  sessionPersistenceEnabled: boolean;
}

export type SessionStatus = 'active' | 'refreshing' | 'expired' | 'idle' | 'locked';

export interface BranchContext {
  branchId: string | null;
  branchName: string | null;
  branchCode: string | null;
}

export interface PermissionCheck {
  code: PermissionCode;
  domain?: PermissionDomain;
  action?: PermissionAction;
  branchId?: string;
}

export interface PermissionResult {
  granted: boolean;
  code?: PermissionCode;
  reason?: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: PermissionCode[];
}

export type AuthEventType =
  | 'auth.login.success' | 'auth.login.failure'
  | 'auth.logout' | 'auth.logout.all'
  | 'auth.session.expired' | 'auth.session.refreshed'
  | 'auth.password.reset.requested' | 'auth.password.reset.completed'
  | 'auth.password.changed'
  | 'auth.invitation.sent' | 'auth.invitation.accepted' | 'auth.invitation.expired'
  | 'auth.permission.denied'
  | 'auth.account.locked' | 'auth.account.unlocked'
  | 'auth.branch.switched';

export interface AuthEvent {
  type: AuthEventType;
  timestamp: string;
  actorId?: string;
  actorType?: string;
  metadata?: Record<string, unknown>;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  branchId?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
