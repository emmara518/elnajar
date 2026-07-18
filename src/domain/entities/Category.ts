import type { Entity } from '../shared';

/**
 * Product classification group arranged hierarchically.
 * Categories organize the product catalog for browsing and reporting.
 * Supports nesting via parentCategoryId (self-referencing tree).
 */
export interface Category extends Entity {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  imageUrl?: string;
  sortOrder: number;
};
