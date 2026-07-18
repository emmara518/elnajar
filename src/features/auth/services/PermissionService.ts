import type { PermissionCode, PermissionCheck, PermissionResult } from '../types';

export class PermissionService {
  private permissionCache: Map<string, boolean> = new Map();

  constructor(private permissions: PermissionCode[] = []) {}

  setPermissions(permissions: PermissionCode[]): void {
    this.permissions = permissions;
    this.permissionCache.clear();
  }

  getPermissions(): PermissionCode[] {
    return [...this.permissions];
  }

  hasPermission(code: PermissionCode): boolean {
    const cached = this.permissionCache.get(code);
    if (cached !== undefined) {
      return cached;
    }

    const result = this.permissions.includes(code);
    this.permissionCache.set(code, result);
    return result;
  }

  hasAnyPermission(codes: PermissionCode[]): boolean {
    return codes.some((code) => this.hasPermission(code));
  }

  hasAllPermissions(codes: PermissionCode[]): boolean {
    return codes.every((code) => this.hasPermission(code));
  }

  check(check: PermissionCheck): PermissionResult {
    const code = check.code;
    const granted = this.hasPermission(code);

    return {
      granted,
      code,
      reason: granted ? undefined : `الصلاحية ${code} غير متوفرة`,
    };
  }

  hasRoleLevel(requiredLevel: number, currentLevel: number): boolean {
    return currentLevel >= requiredLevel;
  }

  filterByPermission<T extends { permission?: PermissionCode }>(items: T[]): T[] {
    return items.filter((item) => {
      if (!item.permission) return true;
      return this.hasPermission(item.permission);
    });
  }

  invalidateCache(): void {
    this.permissionCache.clear();
  }
}
