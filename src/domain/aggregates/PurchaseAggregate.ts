import type { Purchase, PurchaseItem } from '../entities';

/**
 * Purchase Aggregate Root: Purchase + PurchaseItems
 *
 * BOUNDARY
 * - Root: Purchase
 * - Children: PurchaseItem[]
 * - References (not owned): Supplier, Branch, Employee
 *
 * CONSISTENCY RULES
 * 1. Purchase.grandTotal MUST equal sum of all PurchaseItem.totalCost
 * 2. PurchaseItem.receivedQuantity CANNOT exceed PurchaseItem.orderedQuantity
 * 3. When all PurchaseItems.receivedQuantity === orderedQuantity, status = 'received'
 * 4. When status = 'cancelled', no items may be received
 * 5. Received items update InventoryItem.quantity
 * 6. Status transitions: draft → ordered → partially_received → received | cancelled
 */
export interface PurchaseAggregate {
  purchase: Purchase;
  items: PurchaseItem[];
}
