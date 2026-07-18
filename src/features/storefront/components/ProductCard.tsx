import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useWishlistStore } from '../stores/wishlist.store';
import { useCartStore } from '../stores/cart.store';
import { formatPrice, getProductUrl, getStockStatusLabel, getStockStatusColor } from '../utils';
import { Badge, Button, Card, CardBody, Skeleton } from '@/design-system';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = hasItem(product.id);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  }, [product.id, toggleItem]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url ?? '',
      price: product.price,
      quantity: 1,
      maxQuantity: product.stock,
      stockStatus: product.stockStatus,
    });
  }, [product, addItem]);

  return (
    <Link to={getProductUrl(product.slug)} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {product.discount > 0 && (
            <Badge variant="danger" className="absolute top-2 right-2">
              -{product.discount}%
            </Badge>
          )}

          {product.isNew && (
            <Badge variant="success" className="absolute top-2 left-2">
              جديد
            </Badge>
          )}

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors ${
              product.isNew ? 'top-10' : ''
            }`}
            aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <svg
              className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <CardBody className="p-3">
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400 text-xs" aria-hidden="true">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-xs text-gray-500">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price.amount)}</span>
            {product.price.oldAmount && product.price.oldAmount > product.price.amount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price.oldAmount)}</span>
            )}
          </div>

          <p className={`text-xs mb-3 ${getStockStatusColor(product.stockStatus)}`}>
            {getStockStatusLabel(product.stockStatus)}
          </p>

          <Button
            size="sm"
            fullWidth
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out_of_stock'}
          >
            {product.stockStatus === 'out_of_stock' ? 'غير متوفر' : 'أضف إلى السلة'}
          </Button>
        </CardBody>
      </Card>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <CardBody className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-full" />
      </CardBody>
    </Card>
  );
}
