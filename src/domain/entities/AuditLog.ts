import type { Entity } from '../shared';
import type { AuditAction } from '../types';

/**
 * Immutable record of significant system events.
 * Logs who did what, when, and what changed.
 * Used for compliance, debugging, and security investigations.
 * Never deleted — only archived for retention.
 */
export interface AuditLog extends Entity {
  actorId: string;
  actorType: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  branchId?: string;
}

export type CreateAuditLogPayload = {
  actorId: string;
  actorType: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  branchId?: string;
};
