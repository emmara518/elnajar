import type { Money, Discount } from '../value-objects';
import type { TaxRate } from '../value-objects';
import type { Product, InventoryItem } from '../entities';
import type { SaleAggregate } from '../aggregates';

export interface PricingService {
  calculateRetailPrice(product: Product, quantity: number): Money;
  calculateWholesalePrice(product: Product, quantity: number): Money;
  applyDiscount(price: Money, discount: Discount): Money;
  applyTax(price: Money, taxRate: TaxRate): Money;
  calculateSubtotal(items: { unitPrice: Money; quantity: number }[]): Money;
}

export interface InventoryService {
  checkAvailability(productId: string, branchId: string, quantity: number): Promise<boolean>;
  reserveStock(productId: string, branchId: string, quantity: number): Promise<void>;
  releaseReservedStock(productId: string, branchId: string, quantity: number): Promise<void>;
  adjustStock(inventoryItem: InventoryItem, quantity: number, reason: string): Promise<void>;
  getStockLevel(productId: string, branchId: string): Promise<number>;
  getLowStockItems(branchId: string, threshold: number): Promise<InventoryItem[]>;
}

export interface TaxService {
  getDefaultTaxRate(branchId?: string): Promise<TaxRate>;
  getProductTaxRate(productId: string): Promise<TaxRate>;
  calculateTax(amount: number, taxRate: TaxRate): number;
}

export interface DiscountService {
  calculateDiscount(amount: Money, discount: Discount): Money;
  validateDiscount(discount: Discount, sale: SaleAggregate): boolean;
  getActivePromotions(branchId: string): Promise<Discount[]>;
}

export interface BarcodeService {
  generateBarcode(productId: string): string;
  validateBarcode(barcode: string): boolean;
  lookupByBarcode(barcode: string): Promise<Product | null>;
}
