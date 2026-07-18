export type AppRole = 'owner' | 'branch_manager' | 'cashier' | 'support' | 'guest';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

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
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
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

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DISABLED'
  | 'EMAIL_NOT_VERIFIED'
  | 'SESSION_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_REFRESH_FAILED'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BRANCH_REQUIRED'
  | 'INVITATION_INVALID'
  | 'INVITATION_EXPIRED'
  | 'PASSWORD_WEAK'
  | 'ACCOUNT_LOCKED'
  | 'MAX_ATTEMPTS_EXCEEDED';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
