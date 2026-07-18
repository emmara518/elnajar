import { Navigate } from 'react-router-dom';
import type { PermissionCode, PermissionCheck } from '../types';
import { usePermission } from '../hooks/usePermission';
import { DEFAULT_REDIRECTS } from '../constants';

interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: PermissionCode;
  permissions?: PermissionCode[];
  check?: PermissionCheck;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionRoute({ children, permission, permissions, check: permissionCheck, requireAll = false, fallback }: PermissionRouteProps) {
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
    if (fallback) return <>{fallback}</>;
    return <Navigate to={DEFAULT_REDIRECTS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
