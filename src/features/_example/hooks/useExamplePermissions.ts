import { useMemo } from 'react';

export type ExamplePermission = 'example.view' | 'example.create' | 'example.update' | 'example.delete';

const PERMISSION_HIERARCHY: Record<ExamplePermission, number> = {
  'example.view': 1,
  'example.create': 2,
  'example.update': 3,
  'example.delete': 4,
};

export function useExamplePermissions(userPermissions: ExamplePermission[]) {
  const permissionSet = useMemo(() => new Set(userPermissions), [userPermissions]);

  return useMemo(
    () => ({
      canView: permissionSet.has('example.view'),
      canCreate: permissionSet.has('example.create'),
      canUpdate: permissionSet.has('example.update'),
      canDelete: permissionSet.has('example.delete'),
      hasPermission(permission: ExamplePermission): boolean {
        return permissionSet.has(permission);
      },
      hasMinimumLevel(permission: ExamplePermission): boolean {
        const required = PERMISSION_HIERARCHY[permission];
        return Array.from(permissionSet).some((p) => PERMISSION_HIERARCHY[p] >= required);
      },
    }),
    [permissionSet],
  );
}
