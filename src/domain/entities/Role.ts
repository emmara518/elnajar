import type { Entity } from '../shared';

/**
 * Named set of permissions assigned to employees.
 * Roles are branch-agnostic — they define what a job function can do.
 * Examples: Owner, BranchManager, Cashier, Support, InventoryClerk.
 */
export interface Role extends Entity {
  name: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
}

export type CreateRolePayload = {
  name: string;
  description: string;
  permissionIds: string[];
};
