import type { Entity } from '../shared';
import type { Money, SKU, Barcode } from '../value-objects';
import type { ProductType } from '../types';

/**
 * Sellable item in the catalog.
 * Products have a category, pricing, and tracking information.
 * Can be simple (single SKU), variant (size/color), or bundle (multiple products).
 * Images stored externally; URLs referenced here.
 */
export interface Product extends Entity {
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  categoryId: string;
  sku: SKU;
  barcode?: Barcode;
  retailPrice: Money;
  wholesalePrice?: Money;
  costPrice: Money;
  unit: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  weightUnit?: string;
}

export type CreateProductPayload = {
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  categoryId: string;
  sku: string;
  barcode?: string;
  retailPrice: number;
  wholesalePrice?: number;
  costPrice: number;
  unit: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  weightUnit?: string;
};
