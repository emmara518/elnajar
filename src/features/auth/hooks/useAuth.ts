import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthService } from '../services';
import type { LoginPayload, AuthUser } from '../types';
import { useAuthStore, selectUser, selectIsAuthenticated, selectIsLoading, selectAuthError, selectIsInitialized } from '../stores';
import { useSessionStore } from '../stores';
import { authEventBus } from '../events/auth.events';
import { DEFAULT_REDIRECTS } from '../constants';

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  refreshUser: () => Promise<void>;
  getAccessToken: () => string | null;
}

export function useAuth(service?: AuthService): UseAuthReturn {
  const navigate = useNavigate();

  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectAuthError);
  const isInitialized = useAuthStore(selectIsInitialized);

  const setStatus = useAuthStore((s) => s.setStatus);
  const setError = useAuthStore((s) => s.setError);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const loginAction = useAuthStore((s) => s.login);
  const logoutAction = useAuthStore((s) => s.logout);

  const setSession = useSessionStore((s) => s.setSession);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    if (!service) {
      setError('خدمة تسجيل الدخول غير متوفرة');
      return false;
    }

    setStatus('loading');
    setError(null);

    const response = await service.login(payload);

    if (response.error !== null || response.data === null) {
      setStatus('unauthenticated');
      setError(response.error?.message ?? 'فشل تسجيل الدخول');
      return false;
    }

    const { user, accessToken, refreshToken, expiresAt } = response.data;
    loginAction(user);
    setSession({ accessToken, refreshToken, expiresAt, user });

    return true;
  }, [service, setStatus, setError, loginAction, setSession]);

  const logout = useCallback(async () => {
    if (service) {
      await service.logout();
    }
    logoutAction();
    useSessionStore.getState().reset();
    navigate(DEFAULT_REDIRECTS.AFTER_LOGOUT, { replace: true });
  }, [service, logoutAction, navigate]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    useAuthStore.getState().updateUser(updates);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!service) return;
    setStatus('loading');
    const response = await service.getCurrentUser();
    if (response.error !== null || response.data === null) {
      void logout();
      return;
    }
    useAuthStore.getState().login(response.data);
  }, [service, setStatus, logout]);

  const getAccessToken = useCallback((): string | null => {
    const session = useSessionStore.getState().data;
    return session?.accessToken ?? null;
  }, []);

  useEffect(() => {
    const unsubLoginSuccess = authEventBus.on('auth.login.success', () => {
      setInitialized(true);
    });

    const unsubSessionExpired = authEventBus.on('auth.session.expired', () => {
      logoutAction();
      void navigate(DEFAULT_REDIRECTS.AFTER_LOGOUT, { replace: true });
    });

    return () => {
      unsubLoginSuccess();
      unsubSessionExpired();
    };
  }, [setInitialized, logoutAction, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login,
    logout,
    updateUser,
    refreshUser,
    getAccessToken,
  };
}
