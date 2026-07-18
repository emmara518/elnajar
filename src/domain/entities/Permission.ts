import type { Entity } from '../shared';

/**
 * Granular action that a role can perform.
 * Naming convention: <domain>.<action>
 * Example: products.create, orders.update, reports.view.
 * Permissions are universal across branches; constraints are role-based.
 */
export interface Permission extends Entity {
  code: string;
  name: string;
  description: string;
  group: string;
}

export type CreatePermissionPayload = {
  code: string;
  name: string;
  description: string;
  group: string;
};
