import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Container, Section, Stack, EmptyState, Button } from '@/design-system';
import type { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { Breadcrumbs } from '../layouts/Breadcrumbs';
import { useWishlistStore } from '../stores/wishlist.store';

function mockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: `SKU-${overrides.id}`, name: 'منتج', slug: `product-${overrides.id}`, description: 'وصف', shortDescription: 'وصف قصير',
    price: { amount: 199, currency: 'SAR' },
    images: [{ id: `img-${overrides.id}`, url: '/images/product-placeholder.jpg', alt: 'منتج', width: 500, height: 500, isPrimary: true }],
    categoryId: 'cat-1', categoryName: 'إلكترونيات', brand: 'براند', rating: 4.5, reviewsCount: 25, reviews: [], variants: [],
    status: 'active', stockStatus: 'in_stock', stock: 50, tags: [], isNew: false, isFeatured: false, isBestSeller: false, discount: 0,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...overrides,
  };
}

const wishlistProductMap: Record<string, Product> = {
  'prod-1': mockProduct({ id: 'prod-1', name: 'سماعات لاسلكية', slug: 'wireless-earbuds', brand: 'SoundPro', price: { amount: 349, currency: 'SAR', oldAmount: 499 }, rating: 4.7, reviewsCount: 156, discount: 30, isNew: true }),
  'prod-2': mockProduct({ id: 'prod-2', name: 'ساعة ذكية رياضية', slug: 'sport-watch', brand: 'TechFit', price: { amount: 599, currency: 'SAR', oldAmount: 799 }, rating: 4.5, reviewsCount: 89, discount: 25 }),
  'prod-3': mockProduct({ id: 'prod-3', name: 'حقيبة يد أنيقة', slug: 'elegant-handbag', brand: 'VogueStyle', price: { amount: 449, currency: 'SAR', oldAmount: 649 }, rating: 4.6, reviewsCount: 73, discount: 31 }),
  'prod-4': mockProduct({ id: 'prod-4', name: 'نظارة شمسية فاخرة', slug: 'luxury-sunglasses', brand: 'VogueStyle', price: { amount: 299, currency: 'SAR', oldAmount: 429 }, rating: 4.4, reviewsCount: 45, discount: 30 }),
  'prod-5': mockProduct({ id: 'prod-5', name: 'ماوس لاسلكي احترافي', slug: 'pro-mouse', brand: 'TechGear', price: { amount: 189, currency: 'SAR', oldAmount: 259 }, rating: 4.3, reviewsCount: 210, discount: 27 }),
};

export function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  const products = useMemo(() => {
    return items
      .map((item) => wishlistProductMap[item.productId])
      .filter((p): p is Product => !!p);
  }, [items]);

  return (
    <>
      <Container>
        <Breadcrumbs />
      </Container>
      <Section padding="lg">
        <Container>
          {products.length > 0 ? (
            <Stack gap="lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">المفضلة</h1>
                  <p className="text-sm text-gray-500 mt-1">{products.length} {products.length === 1 ? 'منتج' : 'منتجات'} في المفضلة</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearWishlist}>
                  إفراغ المفضلة
                </Button>
              </div>
              <ProductGrid products={products} columns={{ mobile: 2, tablet: 3, desktop: 4 }} />
            </Stack>
          ) : (
            <EmptyState
              icon={<Heart className="w-12 h-12" />}
              title="المفضلة فارغة"
              description="لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح المنتجات وأضف ما يعجبك."
              action={
                <Link to="/products">
                  <Button variant="primary">تصفح المنتجات</Button>
                </Link>
              }
            />
          )}
        </Container>
      </Section>
    </>
  );
}

export default WishlistPage;
