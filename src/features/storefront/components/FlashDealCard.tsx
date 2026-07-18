import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart.store';
import { formatPrice, getProductUrl } from '../utils';
import { Badge, Button, Card, CardBody } from '@/design-system';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface FlashDealCardProps {
  product: Product;
  endsAt: string;
}

function getTimeRemaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

export function FlashDealCard({ product, endsAt }: FlashDealCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [remaining, setRemaining] = useState(() => getTimeRemaining(endsAt));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const next = getTimeRemaining(endsAt);
    setRemaining(next);
    if (next.expired && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [endsAt]);

  useEffect(() => {
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

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

  if (remaining.expired) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

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
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
          <Badge variant="danger" className="absolute top-2 right-2">
            -{product.discount}%
          </Badge>
        </div>
        <CardBody className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price.amount)}</span>
            {product.price.oldAmount && product.price.oldAmount > product.price.amount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price.oldAmount)}</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mb-3" dir="ltr">
            <div className="flex flex-col items-center bg-amber-50 rounded-md px-2 py-1 min-w-[48px]">
              <span className="text-lg font-bold text-amber-700">{pad(remaining.hours)}</span>
              <span className="text-[10px] text-amber-600">ساعة</span>
            </div>
            <span className="text-lg font-bold text-amber-400">:</span>
            <div className="flex flex-col items-center bg-amber-50 rounded-md px-2 py-1 min-w-[48px]">
              <span className="text-lg font-bold text-amber-700">{pad(remaining.minutes)}</span>
              <span className="text-[10px] text-amber-600">دقيقة</span>
            </div>
            <span className="text-lg font-bold text-amber-400">:</span>
            <div className="flex flex-col items-center bg-amber-50 rounded-md px-2 py-1 min-w-[48px]">
              <span className="text-lg font-bold text-amber-700">{pad(remaining.seconds)}</span>
              <span className="text-[10px] text-amber-600">ثانية</span>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
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
