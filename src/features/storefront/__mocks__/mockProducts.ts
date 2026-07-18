import type { Product } from '../types';

const IMG = '/images/product-placeholder.jpg';

export function createMockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: 'SKU-' + overrides.id,
    name: 'منتج',
    slug: 'product-' + overrides.id,
    description: 'وصف المنتج',
    shortDescription: 'وصف قصير للمنتج',
    price: { amount: 199, currency: 'SAR' },
    images: [{ id: 'img-' + overrides.id, url: IMG, alt: 'منتج', width: 500, height: 500, isPrimary: true }],
    categoryId: 'cat-1',
    categoryName: 'إلكترونيات',
    brand: 'TOKYO',
    rating: 4.5,
    reviewsCount: 25,
    reviews: [],
    variants: [],
    status: 'active',
    stockStatus: 'in_stock',
    stock: 50,
    tags: [],
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export { IMG };
