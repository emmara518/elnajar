import type { AuthEventType, AuthEvent } from '../types';
import type { AppRole } from '../types';

let _eventCounter = 0;

export function createAuthEvent(
  type: AuthEventType,
  actorId?: string,
  actorType?: string,
  metadata?: Record<string, unknown>,
): AuthEvent {
  _eventCounter++;
  return {
    type,
    timestamp: new Date().toISOString(),
    actorId,
    actorType,
    metadata: { ...metadata, eventId: `auth_${String(_eventCounter)}` },
  };
}

export function isTokenExpired(expiresAt: string, thresholdMs: number = 300_000): boolean {
  const expiry = new Date(expiresAt).getTime();
  const now = Date.now();
  return expiry - now <= thresholdMs;
}

export function getTokenExpiryDate(expiresIn: number): string {
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

export function validateRoleHierarchy(userRole: AppRole, requiredRole: AppRole): boolean {
  const hierarchy: Record<AppRole, number> = {
    guest: 0,
    cashier: 1,
    support: 2,
    branch_manager: 3,
    owner: 4,
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export function getDefaultBranchId(): string | null {
  try {
    return sessionStorage.getItem('preferred_branch_id');
  } catch {
    return null;
  }
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function safeStorage(): Storage | null {
  if (!isBrowser()) return null;
  try {
    const key = '__storage_test__';
    sessionStorage.setItem(key, '1');
    sessionStorage.removeItem(key);
    return sessionStorage;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  const keys = [
    'auth_session', 'auth_refresh_token', 'auth_branch_context',
    'auth_remember_me', 'auth_offline_cache', 'preferred_branch_id',
  ];
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // Silently fail in restricted environments
    }
  });
}
