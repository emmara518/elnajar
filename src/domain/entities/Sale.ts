import type { Entity } from '../shared';
import type { Money } from '../value-objects';
import type { SaleStatus } from '../types';

/**
 * Purchase transaction initiated by a customer.
 * Contains line items (SaleItem), payments, and calculated totals.
 * A Sale belongs to a single branch and is created within a Shift.
 * Once confirmed, a Sale reduces inventory and becomes immutable.
 */
export interface Sale extends Entity {
  branchId: string;
  shiftId: string;
  customerId?: string;
  employeeId: string;
  orderNumber: string;
  status: SaleStatus;
  subtotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  shippingTotal: Money;
  grandTotal: Money;
  paidAmount: Money;
  changeAmount: Money;
  notes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export type CreateSalePayload = {
  branchId: string;
  shiftId: string;
  customerId?: string;
  employeeId: string;
  notes?: string;
};
