import type { Product } from '../types';
import { STOREFRONT_PRICE_FORMAT } from '../constants';

export function formatPrice(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', { ...STOREFRONT_PRICE_FORMAT, currency }).format(amount);
}

export function formatDiscount(original: number, current: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function getProductUrl(slug: string): string {
  return `/products/${slug}`;
}

export function getCategoryUrl(slug: string): string {
  return `/categories/${slug}`;
}

export function getImageUrl(path: string | undefined | null, fallback: string = '/images/placeholder.svg'): string {
  return path ?? fallback;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getStockStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_stock: 'متوفر',
    out_of_stock: 'غير متوفر',
    low_stock: 'كمية محدودة',
    coming_soon: 'قريباً',
  };
  return labels[status] ?? status;
}

export function getStockStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: 'text-green-600',
    out_of_stock: 'text-red-600',
    low_stock: 'text-amber-600',
    coming_soon: 'text-blue-600',
  };
  return colors[status] ?? 'text-gray-600';
}

export function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'الرئيسية', href: '/' }];
  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    const label = segment.replace(/-/g, ' ');
    crumbs.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: current });
  }
  return crumbs;
}

export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc': return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case 'price_desc': return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case 'rating_desc': return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default: return sorted;
  }
}
