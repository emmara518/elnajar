import type { Entity } from '../shared';
import type { Address, Email, Phone } from '../value-objects';

/**
 * Top-level organization entity.
 * Represents the business itself — its legal identity, branding, and configuration.
 * All branches, employees, and operations belong to one Company (single-tenant).
 * Supports future multi-company expansion.
 */
export interface Company extends Entity {
  name: string;
  legalName: string;
  taxId: string;
  commercialRegister: string;
  email: Email;
  phone: Phone;
  address: Address;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
}

export type CreateCompanyPayload = {
  name: string;
  legalName: string;
  taxId: string;
  commercialRegister: string;
  email: string;
  phone: string;
  address: Address;
  logoUrl?: string;
  website?: string;
};
