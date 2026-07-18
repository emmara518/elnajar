import type { ApiResponse } from '@/types';
import type { AuthUser, AuthResponse, LoginPayload, RegisterPayload, ResetPasswordPayload, UpdatePasswordPayload } from '../types';
import type { AuthRepository } from '../api';
import { authEventBus } from '../events/auth.events';
import { AUTH_ERROR_MESSAGES } from '../constants';
import { fromDTO } from '../api';

export interface AuthServiceConfig {
  onSessionExpired?: () => void;
  maxRetries?: number;
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly config: AuthServiceConfig = {},
  ) {}

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.repository.login({
        email: payload.email,
        password: payload.password,
        ...(payload.rememberMe ? { remember_me: true } : {}),
        ...(payload.branchId ? { branch_id: payload.branchId } : {}),
      });

      if (response.error !== null) {
        const message = response.error.code
          ? AUTH_ERROR_MESSAGES[response.error.code] ?? response.error.message
          : response.error.message;
        authEventBus.emit('auth.login.failure', {
          timestamp: new Date().toISOString(),
          metadata: { errorCode: response.error.code },
        });
        return { data: null, error: { ...response.error, message } };
      }

      if (response.data === null) {
        return { data: null, error: { message: AUTH_ERROR_MESSAGES.UNKNOWN ?? 'خطأ غير معروف', code: 'UNKNOWN', status: 500 } };
      }

      const authResponse: AuthResponse = {
        user: fromDTO(response.data.user),
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: response.data.expires_at,
      };

      authEventBus.emit('auth.login.success', {
        timestamp: new Date().toISOString(),
        actorId: authResponse.user.id,
        actorType: 'user',
        metadata: { rememberMe: payload.rememberMe },
      });

      return { data: authResponse, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.NETWORK_ERROR ?? 'خطأ في الشبكة';
      authEventBus.emit('auth.login.failure', {
        timestamp: new Date().toISOString(),
        metadata: { error: 'NETWORK_ERROR' },
      });
      return { data: null, error: { message, code: 'NETWORK_ERROR', status: 0 } };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.repository.logout();
      authEventBus.emit('auth.logout', {
        timestamp: new Date().toISOString(),
      });
      return response;
    } catch {
      authEventBus.emit('auth.logout', {
        timestamp: new Date().toISOString(),
      });
      return { data: null, error: null };
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresAt: string }>> {
    const response = await this.repository.refreshToken({ refresh_token: refreshToken });

    if (response.error !== null) {
      authEventBus.emit('auth.session.expired', {
        timestamp: new Date().toISOString(),
        metadata: { error: 'SESSION_EXPIRED' },
      });
      this.config.onSessionExpired?.();
      return { data: null, error: response.error };
    }

    if (response.data === null) {
      return { data: null, error: { message: AUTH_ERROR_MESSAGES.UNKNOWN ?? 'خطأ غير معروف', code: 'UNKNOWN', status: 500 } };
    }

    return {
      data: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: response.data.expires_at,
      },
      error: null,
    };
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthUser>> {
    const response = await this.repository.register({
      email: payload.email,
      password: payload.password,
      name: payload.name,
      ...(payload.phone ? { phone: payload.phone } : {}),
    });

    if (response.error !== null || response.data === null) {
      return { data: null, error: response.error ?? { message: AUTH_ERROR_MESSAGES.UNKNOWN ?? 'خطأ غير معروف', code: 'UNKNOWN', status: 500 } };
    }

    return { data: fromDTO(response.data.user), error: null };
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
    const response = await this.repository.resetPassword({ email: payload.email });

    if (response.error === null) {
      authEventBus.emit('auth.password.reset.requested', {
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  }

  async updatePassword(payload: UpdatePasswordPayload): Promise<ApiResponse<void>> {
    const response = await this.repository.updatePassword({
      token: payload.currentPassword,
      password: payload.newPassword,
    });

    if (response.error === null) {
      authEventBus.emit('auth.password.changed', {
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const response = await this.repository.getCurrentUser();

    if (response.error !== null || response.data === null) {
      return { data: null, error: response.error ?? { message: AUTH_ERROR_MESSAGES.UNKNOWN ?? 'خطأ غير معروف', code: 'UNKNOWN', status: 500 } };
    }

    return { data: fromDTO(response.data), error: null };
  }
}
