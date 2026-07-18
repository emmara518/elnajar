import type { Entity } from '../shared';
import type { Money } from '../value-objects';
import type { PaymentMethod, PaymentStatus } from '../types';

/**
 * Payment record against a Sale.
 * Supports partial payments, overpayments, and multiple payment methods per sale.
 * For manual payment flow, status may require admin verification.
 */
export interface Payment extends Entity {
  saleId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: Money;
  referenceNumber?: string;
  notes?: string;
  verifiedById?: string;
  verifiedAt?: string;
}

export type CreatePaymentPayload = {
  saleId: string;
  method: PaymentMethod;
  amount: number;
  referenceNumber?: string;
  notes?: string;
};
