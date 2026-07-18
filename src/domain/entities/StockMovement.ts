import type { Entity } from '../shared';
import type { Quantity } from '../value-objects';
import type { MovementType } from '../types';

/**
 * Record of inventory quantity change for audit and traceability.
 * Every stock change (sale, purchase, adjustment, transfer) creates a movement.
 * Immutable — once recorded, movements cannot be deleted (only reversed).
 */
export interface StockMovement extends Entity {
  inventoryItemId: string;
  productId: string;
  branchId: string;
  type: MovementType;
  quantity: Quantity;
  beforeQuantity: Quantity;
  afterQuantity: Quantity;
  referenceType: string;
  referenceId: string;
  reason: string;
  createdByEmployeeId: string;
}

export type CreateStockMovementPayload = {
  inventoryItemId: string;
  productId: string;
  branchId: string;
  type: MovementType;
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  referenceType: string;
  referenceId: string;
  reason: string;
  createdByEmployeeId: string;
};
