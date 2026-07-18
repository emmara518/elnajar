import { Link } from 'react-router-dom';
import { Card } from '@/design-system';

interface BrandCardProps {
  name: string;
  logo: string;
  productCount: number;
}

export function BrandCard({ name, logo, productCount }: BrandCardProps) {
  return (
    <Link to={`/products?brand=${encodeURIComponent(name)}`} className="group block">
      <Card className="flex flex-col items-center justify-center p-6 transition-shadow hover:shadow-lg min-h-[140px]">
        <div className="w-16 h-16 mb-3 flex items-center justify-center">
          <img
            src={logo}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <span className="text-sm font-medium text-gray-900 text-center">{name}</span>
        <span className="text-xs text-gray-500 mt-1">
          {productCount} {productCount === 1 ? 'منتج' : 'منتجات'}
        </span>
      </Card>
    </Link>
  );
}
