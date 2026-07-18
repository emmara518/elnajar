import type { PermissionCode, PermissionCheck, PermissionResult } from '../types';
import { PermissionService } from '../services/PermissionService';

export class PermissionResolver {
  private service: PermissionService;

  constructor(permissions: PermissionCode[] = []) {
    this.service = new PermissionService(permissions);
  }

  setPermissions(permissions: PermissionCode[]): void {
    this.service.setPermissions(permissions);
  }

  resolve(code: PermissionCode): boolean {
    return this.service.hasPermission(code);
  }

  resolveAny(codes: PermissionCode[]): boolean {
    return this.service.hasAnyPermission(codes);
  }

  resolveAll(codes: PermissionCode[]): boolean {
    return this.service.hasAllPermissions(codes);
  }

  resolveCheck(check: PermissionCheck): PermissionResult {
    return this.service.check(check);
  }

  invalidateCache(): void {
    this.service.invalidateCache();
  }
}
