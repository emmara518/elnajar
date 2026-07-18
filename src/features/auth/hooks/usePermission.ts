import { useMemo } from 'react';
import type { PermissionCode, PermissionCheck, PermissionResult, AppRole } from '../types';
import { useAuthStore, selectUser } from '../stores';
import { PermissionService } from '../services/PermissionService';
import { ROLE_HIERARCHY } from '../constants';

export interface UsePermissionReturn {
  hasPermission: (code: PermissionCode) => boolean;
  hasAnyPermission: (codes: PermissionCode[]) => boolean;
  hasAllPermissions: (codes: PermissionCode[]) => boolean;
  check: (check: PermissionCheck) => PermissionResult;
  hasRole: (role: AppRole) => boolean;
  hasMinimumRole: (minimumRole: AppRole) => boolean;
  userRole: AppRole | null;
  userPermissions: PermissionCode[];
}

export function usePermission(): UsePermissionReturn {
  const user = useAuthStore(selectUser);
  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);
  const role = user?.role ?? null;

  const service = useMemo(() => new PermissionService(permissions), [permissions]);

  return useMemo(() => ({
    hasPermission: (code: PermissionCode): boolean => service.hasPermission(code),
    hasAnyPermission: (codes: PermissionCode[]): boolean => service.hasAnyPermission(codes),
    hasAllPermissions: (codes: PermissionCode[]): boolean => service.hasAllPermissions(codes),
    check: (check: PermissionCheck): PermissionResult => service.check(check),
    hasRole: (targetRole: AppRole): boolean => role === targetRole,
    hasMinimumRole: (minimumRole: AppRole): boolean => {
      if (!role) return false;
      const userLevel = ROLE_HIERARCHY[role];
      const requiredLevel = ROLE_HIERARCHY[minimumRole];
      return userLevel >= requiredLevel;
    },
    userRole: role,
    userPermissions: permissions,
  }), [service, role, permissions]);
}
