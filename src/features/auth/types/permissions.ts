export type PermissionCode = string;

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'export' | 'approve';

export type PermissionDomain =
  | 'products'
  | 'sales'
  | 'inventory'
  | 'employees'
  | 'customers'
  | 'suppliers'
  | 'purchases'
  | 'expenses'
  | 'shifts'
  | 'reports'
  | 'settings'
  | 'users'
  | 'roles'
  | 'audit';

export interface PermissionCheck {
  domain: PermissionDomain;
  action: PermissionAction;
  branchId?: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: PermissionCode[];
}

export interface PermissionResult {
  granted: boolean;
  reason?: string;
}
