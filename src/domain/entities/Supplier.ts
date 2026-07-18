import type { Entity } from '../shared';
import type { Address, Email, Phone } from '../value-objects';

/**
 * External vendor who supplies products to the store.
 * Suppliers fulfill purchase orders and restock inventory.
 */
export interface Supplier extends Entity {
  name: string;
  contactPerson: string;
  email: Email;
  phone: Phone;
  address: Address;
  taxId?: string;
  paymentTerms: string;
  leadTimeDays: number;
  isActive: boolean;
  notes?: string;
}

export type CreateSupplierPayload = {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  taxId?: string;
  paymentTerms: string;
  leadTimeDays: number;
  notes?: string;
};
