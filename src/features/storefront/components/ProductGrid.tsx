import type { Product } from '../types';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

interface ProductGridColumns {
  mobile?: 1 | 2;
  tablet?: 2 | 3;
  desktop?: 3 | 4;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: ProductGridColumns;
}

const columnClass: Record<string, Record<string, string>> = {
  mobile: { 1: 'grid-cols-1', 2: 'grid-cols-2' },
  tablet: { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' },
  desktop: { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
};

const defaultColumns: Required<ProductGridColumns> = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
};

export function ProductGrid({ products, isLoading, columns }: ProductGridProps) {
  const cols = { ...defaultColumns, ...columns };
  const classes = [
    columnClass.mobile?.[cols.mobile] ?? 'grid-cols-2',
    columnClass.tablet?.[cols.tablet] ?? 'md:grid-cols-3',
    columnClass.desktop?.[cols.desktop] ?? 'lg:grid-cols-4',
    'grid gap-4',
  ].join(' ');

  if (isLoading) {
    return (
      <div className={classes}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={classes}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
