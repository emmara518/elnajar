import type { Entity } from '../shared';
import type { Email } from '../value-objects';

/**
 * Registered customer user who can browse, purchase, and manage their account.
 * Authenticated via Supabase Auth. This is the customer-facing identity.
 */
export interface User extends Entity {
  email: Email;
  name: string;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  preferredBranchId?: string;
}

export type CreateUserPayload = {
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  preferredBranchId?: string;
};
