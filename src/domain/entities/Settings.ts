import type { Entity } from '../shared';
import type { TaxRate } from '../value-objects';

/**
 * Application-wide configuration settings.
 * Controls system behavior: currency, tax rates, order cutoffs, etc.
 * Settings are singleton per installation with override support per branch.
 */
export interface Settings extends Entity {
  companyId: string;
  currency: string;
  defaultTaxRate: TaxRate;
  branchId?: string;
  orderPrefix: string;
  orderCutoffTime: string;
  lowStockThreshold: number;
  enableWholesale: boolean;
  enableCustomerRegistration: boolean;
  requirePaymentVerification: boolean;
  maxFailedLoginAttempts: number;
  sessionTimeoutMinutes: number;
}

export type CreateSettingsPayload = {
  companyId: string;
  currency?: string;
  branchId?: string;
  orderPrefix: string;
  orderCutoffTime: string;
  lowStockThreshold?: number;
  enableWholesale?: boolean;
  enableCustomerRegistration?: boolean;
  requirePaymentVerification?: boolean;
  maxFailedLoginAttempts?: number;
  sessionTimeoutMinutes?: number;
};
