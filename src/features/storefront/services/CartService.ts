import type { ApiResponse } from '@/types';
import type { CartItem, CartSummary } from '../types';

export interface CartService {
  addItem(item: CartItem): Promise<ApiResponse<CartSummary>>;
  removeItem(itemId: string): Promise<ApiResponse<CartSummary>>;
  updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<CartSummary>>;
  getSummary(): Promise<ApiResponse<CartSummary>>;
  applyCoupon(code: string): Promise<ApiResponse<CartSummary>>;
  removeCoupon(): Promise<ApiResponse<CartSummary>>;
  syncCart(items: CartItem[]): Promise<ApiResponse<void>>;
}
