export type ProductStatus = 'active' | 'draft' | 'archived';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'low_stock' | 'coming_soon';

export interface ProductPrice {
  amount: number;
  currency: string;
  oldAmount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: ProductPrice;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: ProductPrice;
  images: ProductImage[];
  categoryId: string;
  categoryName: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  variants: ProductVariant[];
  status: ProductStatus;
  stockStatus: StockStatus;
  stock: number;
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  stockStatus?: StockStatus;
  tags?: string[];
  query?: string;
}

export type ProductSortOption = 'newest' | 'best_selling' | 'price_asc' | 'price_desc' | 'rating_desc' | 'reviews_desc' | 'featured';

export interface ProductListParams {
  page: number;
  pageSize: number;
  filters?: ProductFilters;
  sort?: ProductSortOption;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}
