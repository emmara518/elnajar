import type { ApiResponse, ApiListResponse } from '@/types';
import type { Product } from '../types';

export interface WishlistService {
  getItems(): Promise<ApiListResponse<Product>>;
  addItem(productId: string): Promise<ApiResponse<void>>;
  removeItem(productId: string): Promise<ApiResponse<void>>;
  hasItem(productId: string): Promise<ApiResponse<boolean>>;
  clearWishlist(): Promise<ApiResponse<void>>;
}
