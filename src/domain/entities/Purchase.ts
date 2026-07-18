import type { Entity } from '../shared';
import type { Money } from '../value-objects';
import type { PurchaseStatus } from '../types';

/**
 * Supplier order to replenish inventory.
 * Tracks ordered items (PurchaseItem), received quantities, and costs.
 * Purchase orders become immutable once fully received or cancelled.
 */
export interface Purchase extends Entity {
  branchId: string;
  supplierId: string;
  orderNumber: string;
  status: PurchaseStatus;
  subtotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  shippingTotal: Money;
  grandTotal: Money;
  orderedById: string;
  receivedById?: string;
  orderedAt: string;
  receivedAt?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export type CreatePurchasePayload = {
  branchId: string;
  supplierId: string;
  orderedById: string;
  expectedDeliveryDate?: string;
  notes?: string;
};
