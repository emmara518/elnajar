import type { SaleAggregate, PurchaseAggregate } from '../aggregates';
import type { CreateSalePayload, CreatePurchasePayload, CreateShiftPayload, CreateProductPayload } from '../entities';

/**
 * Factory for constructing valid Sale aggregates.
 * Ensures all consistency rules are met at creation time.
 */
export interface SaleFactory {
  create(payload: CreateSalePayload): Promise<SaleAggregate>;
}

/**
 * Factory for constructing valid Purchase aggregates.
 */
export interface PurchaseFactory {
  create(payload: CreatePurchasePayload): Promise<PurchaseAggregate>;
}

/**
 * Factory for constructing valid Shift aggregates.
 */
export interface ShiftFactory {
  create(payload: CreateShiftPayload): Promise<{ shiftId: string }>;
}

/**
 * Factory for constructing valid Product entities with defaults.
 */
export interface ProductFactory {
  create(payload: CreateProductPayload): Promise<{ productId: string }>;
}
