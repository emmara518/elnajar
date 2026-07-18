import { create } from 'zustand';
import type { CartItem, CartSummary, CartState } from '../types';

export interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

export type CartStore = CartState & CartActions;

function calculateSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: subtotal,
    currency: items[0]?.price.currency ?? 'SAR',
    itemCount,
  };
}

export const initialCartState: CartState = {
  items: [],
  summary: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0, currency: 'SAR', itemCount: 0 },
  isOpen: false,
  couponCode: null,
  couponDiscount: 0,
};

export const useCartStore = create<CartStore>((set) => ({
  ...initialCartState,

  addItem: (item) =>
    { set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) } : i,
          )
        : [...state.items, item];
      return { items, summary: calculateSummary(items) };
    }); },

  removeItem: (itemId) =>
    { set((state) => {
      const items = state.items.filter((i) => i.id !== itemId);
      return { items, summary: calculateSummary(items) };
    }); },

  updateQuantity: (itemId, quantity) =>
    { set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((i) => i.id !== itemId);
        return { items, summary: calculateSummary(items) };
      }
      const items = state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i,
      );
      return { items, summary: calculateSummary(items) };
    }); },

  clearCart: () => { set(initialCartState); },

  toggleCart: () => { set((state) => ({ isOpen: !state.isOpen })); },

  applyCoupon: (code) => { set({ couponCode: code, couponDiscount: 0.1 }); },

  removeCoupon: () => { set({ couponCode: null, couponDiscount: 0 }); },
}));
