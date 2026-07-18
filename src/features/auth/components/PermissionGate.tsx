import { type ReactNode } from 'react';
import type { PermissionCode, PermissionCheck } from '../types';
import { usePermission } from '../hooks/usePermission';

interface PermissionGateProps {
  children: ReactNode;
  permission?: PermissionCode;
  permissions?: PermissionCode[];
  check?: PermissionCheck;
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function PermissionGate({ children, permission, permissions, check: permissionCheck, requireAll = false, fallback }: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, check } = usePermission();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  } else if (permissionCheck) {
    hasAccess = check(permissionCheck).granted;
  }

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
