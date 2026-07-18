import type { ProductPrice } from './product';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: ProductPrice;
  quantity: number;
  maxQuantity: number;
  stockStatus: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isOpen: boolean;
  couponCode: string | null;
  couponDiscount: number;
}
