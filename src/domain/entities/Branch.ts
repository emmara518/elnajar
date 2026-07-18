import type { Entity } from '../shared';
import type { Address, Phone } from '../value-objects';

/**
 * Physical or operational store location.
 * Each branch has its own inventory, shifts, employees, and sales.
 * Branches are independent operational units under one company.
 */
export interface Branch extends Entity {
  name: string;
  code: string;
  address: Address;
  phone: Phone;
  email: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  timezone: string;
}

export type CreateBranchPayload = {
  name: string;
  code: string;
  address: Address;
  phone: Phone;
  email: string;
  openingTime: string;
  closingTime: string;
  timezone: string;
};
