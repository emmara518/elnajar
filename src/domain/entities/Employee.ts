import type { Entity } from '../shared';

/**
 * Staff member who works at one or more branches.
 * Each employee has a role that determines their permissions.
 * Employees manage the store operations — sales, inventory, shifts.
 */
export interface Employee extends Entity {
  userId: string;
  roleId: string;
  branchId: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  hireDate: string;
  terminationDate?: string;
}

export type CreateEmployeePayload = {
  userId: string;
  roleId: string;
  branchId: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  hireDate: string;
};
