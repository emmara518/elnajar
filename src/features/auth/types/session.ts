import type { AppRole } from './auth';

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: AppRole;
    roleId: string;
    employeeId?: string;
    branchId?: string;
    companyId?: string;
    avatarUrl?: string;
  };
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
  branchId: string;
  branchName: string;
  branchCode: string;
}
