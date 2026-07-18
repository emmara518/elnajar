export const AUTH_STORAGE_KEYS = {
  SESSION: 'auth_session',
  REFRESH_TOKEN: 'auth_refresh_token',
  BRANCH_CONTEXT: 'auth_branch_context',
  REMEMBER_ME: 'auth_remember_me',
  OFFLINE_CACHE: 'auth_offline_cache',
} as const;

export const AUTH_EVENTS = {
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILURE: 'auth.login.failure',
  LOGOUT: 'auth.logout',
  SESSION_EXPIRED: 'auth.session.expired',
  TOKEN_REFRESHED: 'auth.session.refreshed',
  PERMISSION_DENIED: 'auth.permission.denied',
} as const;

export const SESSION_CONFIG = {
  idleTimeoutMinutes: 30,
  refreshThresholdMinutes: 5,
  maxConcurrentSessions: 5,
  sessionPersistenceEnabled: true,
};

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  ACCOUNT_DISABLED: 'الحساب معطل. يرجى الاتصال بالدعم',
  EMAIL_NOT_VERIFIED: 'يرجى تأكيد البريد الإلكتروني أولاً',
  SESSION_EXPIRED: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى',
  NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
  UNAUTHORIZED: 'غير مصرح بالوصول',
  FORBIDDEN: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  ACCOUNT_LOCKED: 'تم قفل الحساب بسبب محاولات فاشلة متكررة',
  PASSWORD_WEAK: 'كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل',
  BRANCH_REQUIRED: 'يرجى اختيار فرع للدخول',
};

import type { AppRole } from '../types';

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  guest: 0,
  cashier: 1,
  support: 2,
  branch_manager: 3,
  owner: 4,
};

export const DEFAULT_REDIRECTS = {
  AFTER_LOGIN: '/',
  AFTER_LOGOUT: '/auth/login',
  AFTER_PASSWORD_RESET: '/auth/login',
  AFTER_ACCEPT_INVITE: '/auth/login',
  UNAUTHORIZED: '/auth/unauthorized',
  BRANCH_SELECTION: '/branch-select',
} as const;

export const ROLE_DEFINITIONS = [
  { role: 'owner', label: 'Owner', labelAr: 'مالك', level: 4, isSystem: true, description: 'Full system access' },
  { role: 'branch_manager', label: 'Branch Manager', labelAr: 'مدير فرع', level: 3, isSystem: true, description: 'Branch management access' },
  { role: 'support', label: 'Support', labelAr: 'دعم فني', level: 2, isSystem: true, description: 'Read-only support access' },
  { role: 'cashier', label: 'Cashier', labelAr: 'كاشير', level: 1, isSystem: true, description: 'Point of sale access' },
  { role: 'guest', label: 'Guest', labelAr: 'زائر', level: 0, isSystem: true, description: 'Public access' },
] as const;
