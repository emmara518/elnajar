import type { ApiResponse, ApiListResponse } from '@/types';
import type { Product, ProductListParams } from '../types';

export interface ProductService {
  list(params: ProductListParams): Promise<ApiListResponse<Product>>;
  getById(id: string): Promise<ApiResponse<Product>>;
  getBySlug(slug: string): Promise<ApiResponse<Product>>;
  getFeatured(): Promise<ApiListResponse<Product>>;
  getNewArrivals(): Promise<ApiListResponse<Product>>;
  getBestSellers(): Promise<ApiListResponse<Product>>;
  getRelated(productId: string): Promise<ApiListResponse<Product>>;
  getFlashDeals(): Promise<ApiListResponse<Product>>;
}
