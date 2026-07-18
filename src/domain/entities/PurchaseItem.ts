import type { Entity } from '../shared';
import type { Money, Quantity } from '../value-objects';

/**
 * Individual line item within a Purchase order.
 * Tracks ordered vs received quantity for partial receiving support.
 */
export interface PurchaseItem extends Entity {
  purchaseId: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQuantity: Quantity;
  receivedQuantity: Quantity;
  unitCost: Money;
  totalCost: Money;
}

export type CreatePurchaseItemPayload = {
  purchaseId: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  unitCost: number;
};
