export type AuthEventType =
  | 'auth.login.success'
  | 'auth.login.failure'
  | 'auth.logout'
  | 'auth.logout.all'
  | 'auth.session.expired'
  | 'auth.session.refreshed'
  | 'auth.password.reset.requested'
  | 'auth.password.reset.completed'
  | 'auth.password.changed'
  | 'auth.invitation.sent'
  | 'auth.invitation.accepted'
  | 'auth.invitation.expired'
  | 'auth.permission.denied'
  | 'auth.account.locked'
  | 'auth.account.unlocked'
  | 'auth.branch.switched';

export interface AuthEvent {
  type: AuthEventType;
  timestamp: string;
  actorId?: string;
  actorType?: string;
  metadata?: Record<string, unknown>;
}
