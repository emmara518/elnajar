import { create } from 'zustand';

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
}

export interface WishlistActions {
  toggleItem: (productId: string) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  hasItem: (productId: string) => boolean;
}

export type WishlistStore = WishlistState & WishlistActions;

export const initialWishlistState: WishlistState = {
  items: [],
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ...initialWishlistState,

  toggleItem: (productId) => {
    const { items } = get();
    const exists = items.some((i) => i.productId === productId);
    if (exists) {
      set({ items: items.filter((i) => i.productId !== productId) });
    } else {
      set({ items: [...items, { productId, addedAt: new Date().toISOString() }] });
    }
  },

  addItem: (productId) =>
    { set((state) => {
      if (state.items.some((i) => i.productId === productId)) return state;
      return { items: [...state.items, { productId, addedAt: new Date().toISOString() }] };
    }); },

  removeItem: (productId) =>
    { set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })); },

  clearWishlist: () => { set({ items: [] }); },

  hasItem: (productId) => get().items.some((i) => i.productId === productId),
}));
