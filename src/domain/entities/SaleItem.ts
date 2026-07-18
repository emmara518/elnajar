import type { Entity } from '../shared';
import type { Money, Quantity } from '../value-objects';

/**
 * Individual line item within a Sale.
 * Captures the product, quantity, unit price, and applied discounts at time of sale.
 * Immutable after sale confirmation — preserves historical pricing.
 */
export interface SaleItem extends Entity {
  saleId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: Quantity;
  unitPrice: Money;
  discountAmount: Money;
  taxAmount: Money;
  totalPrice: Money;
}

export type CreateSaleItemPayload = {
  saleId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  taxAmount?: number;
};
