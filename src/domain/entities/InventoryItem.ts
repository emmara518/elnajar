import type { Entity } from '../shared';
import type { Quantity } from '../value-objects';

/**
 * Per-branch inventory record for a specific product.
 * Tracks current stock, reserved stock, and reorder thresholds.
 * InventoryItem is the source of truth for available quantity.
 */
export interface InventoryItem extends Entity {
  productId: string;
  branchId: string;
  quantity: Quantity;
  reservedQuantity: Quantity;
  minStockLevel: number;
  maxStockLevel?: number;
  reorderPoint: number;
  location?: string;
}

export type CreateInventoryItemPayload = {
  productId: string;
  branchId: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  reorderPoint: number;
  location?: string;
};
