import type { Entity } from '../shared';
import type { Address, Email, Phone } from '../value-objects';
import type { CustomerType } from '../types';

/**
 * External buyer who purchases products.
 * Can be retail (individual) or wholesale (business).
 * Wholesale customers may have special pricing and credit limits.
 */
export interface Customer extends Entity {
  userId?: string;
  name: string;
  email?: Email;
  phone?: Phone;
  addresses: Address[];
  type: CustomerType;
  taxId?: string;
  creditLimit?: number;
  notes?: string;
  isActive: boolean;
}

export type CreateCustomerPayload = {
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  type: CustomerType;
  taxId?: string;
  creditLimit?: number;
  notes?: string;
};
