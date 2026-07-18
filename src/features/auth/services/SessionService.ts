import type { ApiResponse } from '@/types';
import type { SessionData, SessionStatus, SessionConfig } from '../types';
import type { SessionRepository } from '../api';
import { authEventBus } from '../events/auth.events';
import { SESSION_CONFIG } from '../constants';

export class SessionService {
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private status: SessionStatus = 'idle';
  private config: SessionConfig;

  constructor(
    private readonly repository: SessionRepository,
    config?: Partial<SessionConfig>,
  ) {
    this.config = { ...SESSION_CONFIG, ...config };
  }

  getStatus(): SessionStatus {
    return this.status;
  }

  async createSession(data: SessionData): Promise<ApiResponse<SessionData>> {
    const response = await this.repository.createSession(data);
    if (response.error === null && response.data !== null) {
      this.status = 'active';
      this.startRefreshTimer(response.data);
      this.startIdleTimer();
    }
    return response;
  }

  async refreshSession(refreshToken: string): Promise<ApiResponse<SessionData>> {
    this.status = 'refreshing';
    const response = await this.repository.refreshSession({ refresh_token: refreshToken });

    if (response.error !== null) {
      this.status = 'expired';
      authEventBus.emit('auth.session.expired', {
        timestamp: new Date().toISOString(),
        metadata: { error: 'SESSION_EXPIRED' },
      });
      this.stopRefreshTimer();
      this.stopIdleTimer();
      return response;
    }

    if (response.data !== null) {
      this.status = 'active';
      this.startRefreshTimer(response.data);
      this.startIdleTimer();
      authEventBus.emit('auth.session.refreshed', {
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  }

  async terminateSession(sessionId: string): Promise<ApiResponse<void>> {
    this.stopRefreshTimer();
    this.stopIdleTimer();
    this.status = 'expired';
    return this.repository.terminateSession(sessionId);
  }

  async terminateAllSessions(userId: string): Promise<ApiResponse<void>> {
    this.stopRefreshTimer();
    this.stopIdleTimer();
    this.status = 'expired';
    return this.repository.terminateAllSessions(userId);
  }

  async getActiveSessions(userId: string): Promise<ApiResponse<SessionData[]>> {
    return this.repository.getActiveSessions(userId);
  }

  recordActivity(): void {
    if (this.status === 'idle') {
      this.status = 'active';
      authEventBus.emit('auth.session.refreshed', {
        timestamp: new Date().toISOString(),
      });
    }
    this.resetIdleTimer();
  }

  private startRefreshTimer(session: SessionData): void {
    this.stopRefreshTimer();
    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();
    const refreshIn = expiresAt - now - this.config.refreshThresholdMinutes * 60 * 1000;

    if (refreshIn <= 0) {
      void this.refreshSession(session.refreshToken);
      return;
    }

    this.refreshTimer = setInterval(() => {
      void this.refreshSession(session.refreshToken);
    }, refreshIn);
  }

  private stopRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private startIdleTimer(): void {
    this.stopIdleTimer();
    this.idleTimer = setTimeout(() => {
      this.status = 'idle';
      authEventBus.emit('auth.session.expired', {
        timestamp: new Date().toISOString(),
        metadata: { reason: 'idle_timeout' },
      });
    }, this.config.idleTimeoutMinutes * 60 * 1000);
  }

  private resetIdleTimer(): void {
    this.stopIdleTimer();
    if (this.status === 'active') {
      this.startIdleTimer();
    }
  }

  private stopIdleTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  destroy(): void {
    this.stopRefreshTimer();
    this.stopIdleTimer();
    this.status = 'idle';
  }
}
