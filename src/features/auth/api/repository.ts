import type { ApiResponse } from '@/types';
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  SessionData,
} from '../types';
import type {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  InviteRequest,
  AcceptInviteRequest,
  RefreshTokenRequest,
  AuthResponseDTO,
  AuthUserDTO,
  SessionDTO,
} from './types';

export function fromDTO(dto: AuthUserDTO): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role as AuthUser['role'],
    roleId: '',
    isEmailVerified: true,
    isActive: true,
    avatarUrl: dto.avatar ?? undefined,
    permissions: dto.permissions,
  };
}

export function toLoginDTO(payload: LoginPayload): LoginRequest {
  return {
    email: payload.email,
    password: payload.password,
    ...(payload.rememberMe ? { remember_me: true } : {}),
    ...(payload.branchId ? { branch_id: payload.branchId } : {}),
  };
}

export function toRegisterDTO(payload: RegisterPayload): RegisterRequest {
  return {
    email: payload.email,
    password: payload.password,
    name: payload.name,
    ...(payload.phone ? { phone: payload.phone } : {}),
  };
}

export function toResetPasswordDTO(payload: ResetPasswordPayload): ResetPasswordRequest {
  return { email: payload.email };
}

export function toUpdatePasswordDTO(payload: UpdatePasswordPayload): UpdatePasswordRequest {
  return { token: payload.currentPassword, password: payload.newPassword };
}

export function sessionFromDTO(dto: SessionDTO): SessionData {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    expiresAt: dto.expires_at,
    user: {
      id: dto.user_id,
      email: '',
      name: '',
      role: 'guest',
      roleId: '',
      isEmailVerified: false,
      isActive: true,
      permissions: [],
    },
    deviceInfo: {
      userAgent: dto.user_agent ?? '',
      ...(dto.ip_address ? { ip: dto.ip_address } : {}),
    },
  };
}

export interface AuthRepository {
  login(payload: LoginRequest): Promise<ApiResponse<AuthResponseDTO>>;
  logout(): Promise<ApiResponse<void>>;
  register(payload: RegisterRequest): Promise<ApiResponse<AuthResponseDTO>>;
  refreshToken(payload: RefreshTokenRequest): Promise<ApiResponse<{ access_token: string; refresh_token: string; expires_at: string }>>;
  resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<void>>;
  updatePassword(payload: UpdatePasswordRequest): Promise<ApiResponse<void>>;
  getCurrentUser(): Promise<ApiResponse<AuthUserDTO>>;
}

export interface SessionRepository {
  createSession(data: SessionData): Promise<ApiResponse<SessionData>>;
  refreshSession(payload: RefreshTokenRequest): Promise<ApiResponse<SessionData>>;
  terminateSession(sessionId: string): Promise<ApiResponse<void>>;
  terminateAllSessions(userId: string): Promise<ApiResponse<void>>;
  getActiveSessions(userId: string): Promise<ApiResponse<SessionData[]>>;
}

export interface InvitationRepository {
  invite(payload: InviteRequest): Promise<ApiResponse<{ invited_email: string; expires_at: string }>>;
  acceptInvite(payload: AcceptInviteRequest): Promise<ApiResponse<AuthUserDTO>>;
  validateToken(token: string): Promise<ApiResponse<{ valid: boolean; email?: string; name?: string }>>;
}
