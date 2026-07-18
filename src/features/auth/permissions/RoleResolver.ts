import type { AppRole } from '../types';
import { ROLE_HIERARCHY, ROLE_DEFINITIONS } from '../constants';

export class RoleResolver {
  private currentRole: AppRole | null = null;

  setRole(role: AppRole): void {
    this.currentRole = role;
  }

  getRole(): AppRole | null {
    return this.currentRole;
  }

  hasRole(role: AppRole): boolean {
    return this.currentRole === role;
  }

  hasMinimumRole(minimumRole: AppRole): boolean {
    if (this.currentRole === null) return false;
    const userLevel = ROLE_HIERARCHY[this.currentRole];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];
    return userLevel >= requiredLevel;
  }

  hasExactRole(role: AppRole): boolean {
    return this.currentRole === role;
  }

  getRoleLevel(role: AppRole): number {
    return ROLE_HIERARCHY[role];
  }

  getRoleDefinition(role: AppRole): typeof ROLE_DEFINITIONS[number] | undefined {
    return ROLE_DEFINITIONS.find((rd) => rd.role === role);
  }

  getAllRoles(): typeof ROLE_DEFINITIONS {
    return [...ROLE_DEFINITIONS];
  }

  getRolesAbove(role: AppRole): AppRole[] {
    const level = ROLE_HIERARCHY[role];
    return ROLE_DEFINITIONS
      .filter((rd) => ROLE_HIERARCHY[rd.role] > level)
      .map((rd) => rd.role);
  }

  getRolesBelow(role: AppRole): AppRole[] {
    const level = ROLE_HIERARCHY[role];
    return ROLE_DEFINITIONS
      .filter((rd) => ROLE_HIERARCHY[rd.role] < level)
      .map((rd) => rd.role);
  }

  isSystemRole(role: AppRole): boolean {
    const definition = this.getRoleDefinition(role);
    return definition?.isSystem ?? false;
  }
}
