import { create } from 'zustand';
import type { AuthUser, AuthStatus } from '../types';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  reset: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const initialAuthState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  isInitialized: true,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialAuthState,

  setUser: (user) => { set({ user }); },

  setStatus: (status) => { set({ status }); },

  setError: (error) => { set({ error }); },

  setInitialized: (isInitialized) => { set({ isInitialized }); },

  login: (user) => {
    set({
      user,
      status: 'authenticated',
      error: null,
      isInitialized: true,
    });
  },

  logout: () => {
    set({
      user: null,
      status: 'unauthenticated',
      error: null,
    });
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  reset: () => { set(initialAuthState); },
}));

export function selectUser(state: AuthStore): AuthUser | null {
  return state.user;
}

export function selectStatus(state: AuthStore): AuthStatus {
  return state.status;
}

export function selectIsAuthenticated(state: AuthStore): boolean {
  return state.status === 'authenticated';
}

export function selectIsLoading(state: AuthStore): boolean {
  return state.status === 'loading';
}

export function selectAuthError(state: AuthStore): string | null {
  return state.error;
}

export function selectIsInitialized(state: AuthStore): boolean {
  return state.isInitialized;
}

export function selectUserRole(state: AuthStore): string | null {
  return state.user?.role ?? null;
}
