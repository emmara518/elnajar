import type { Product, InventoryItem, Category } from '../entities';

/**
 * Product Aggregate Root: Product + Category (reference) + InventoryItems (references)
 *
 * BOUNDARY
 * - Root: Product
 * - References (not owned): Category
 * - References (not owned): InventoryItem[] (one per branch)
 *
 * CONSISTENCY RULES
 * 1. Product.sku MUST be globally unique
 * 2. Product.categoryId MUST reference an existing Category
 * 3. Product.retailPrice CANNOT be less than Product.costPrice
 * 4. Product.barcode (if set) MUST be globally unique
 * 5. Product.slug MUST be unique within its category
 * 6. Product cannot be deleted if there are active SaleItems or InventoryItems
 * 7. Product.unit determines InventoryItem.quantity.unit
 * 8. Soft delete (deletedAt) instead of hard delete for audit trail
 */
export interface ProductAggregate {
  product: Product;
  category: Category;
  inventoryItems: InventoryItem[];
}
