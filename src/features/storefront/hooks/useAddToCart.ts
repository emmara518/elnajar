import { useCallback } from 'react';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart.store';

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = useCallback(
    (product: Product, quantity = 1, variantId?: string) => {
      const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
      addItem({
        id: product.id,
        productId: product.id,
        variantId,
        name: product.name,
        image: product.images[0]?.url ?? '',
        price: variant?.price ?? product.price,
        quantity,
        maxQuantity: product.stock,
        stockStatus: product.stockStatus,
      });
    },
    [addItem],
  );

  return handleAddToCart;
}
