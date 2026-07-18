import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Section, Stack, EmptyState, Button } from '@/design-system';
import { Search } from 'lucide-react';
import type { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { Breadcrumbs } from '../layouts/Breadcrumbs';
import { filterProducts, sortProducts } from '../utils';

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

const mockAllProducts: Product[] = [
  mockProduct({ id: 'sr-1', name: 'هاتف ذكي أندرويد', slug: 'android-phone', brand: 'TechCo', price: { amount: 1499, currency: 'SAR' }, tags: ['هاتف', 'ذكي', 'أندرويد'], rating: 4.7, reviewsCount: 320 }),
  mockProduct({ id: 'sr-2', name: 'هاتف iPhone 15', slug: 'iphone-15', brand: 'Apple', price: { amount: 3999, currency: 'SAR' }, tags: ['هاتف', 'ذكي', 'iPhone', 'Apple'], rating: 4.9, reviewsCount: 580 }),
  mockProduct({ id: 'sr-3', name: 'سماعات بلوتوث لاسلكية', slug: 'wireless-earbuds-pro', brand: 'SoundPro', price: { amount: 399, currency: 'SAR', oldAmount: 599 }, tags: ['سماعات', 'بلوتوث', 'لاسلكية', 'صوت'], rating: 4.5, reviewsCount: 210, discount: 33 }),
  mockProduct({ id: 'sr-4', name: 'حقيبة لابتوب', slug: 'laptop-bag', brand: 'UrbanGear', price: { amount: 199, currency: 'SAR' }, tags: ['حقيبة', 'لابتوب', 'سفر'], rating: 4.3, reviewsCount: 87 }),
  mockProduct({ id: 'sr-5', name: 'ساعة ذكية أبل واتش', slug: 'apple-watch', brand: 'Apple', price: { amount: 1599, currency: 'SAR' }, tags: ['ساعة', 'ذكية', 'Apple', 'لياقة'], rating: 4.8, reviewsCount: 430 }),
  mockProduct({ id: 'sr-6', name: 'شاحن لابتوب محمول', slug: 'portable-charger', brand: 'TechGear', price: { amount: 149, currency: 'SAR' }, tags: ['شاحن', 'لابتوب', 'محمول'], rating: 4.2, reviewsCount: 65 }),
  mockProduct({ id: 'sr-7', name: 'ماوس لاسلكي', slug: 'wireless-mouse', brand: 'TechGear', price: { amount: 89, currency: 'SAR' }, tags: ['ماوس', 'لاسلكي', 'كمبيوتر'], rating: 4.1, reviewsCount: 190 }),
  mockProduct({ id: 'sr-8', name: 'لوحة مفاتيح ميكانيكية', slug: 'mechanical-keyboard', brand: 'TechGear', price: { amount: 299, currency: 'SAR' }, tags: ['لوحة مفاتيح', 'ميكانيكية', 'كمبيوتر'], rating: 4.6, reviewsCount: 140 }),
  mockProduct({ id: 'sr-9', name: 'سماعة رأس للألعاب', slug: 'gaming-headset', brand: 'SoundPro', price: { amount: 249, currency: 'SAR', oldAmount: 349 }, tags: ['سماعة', 'ألعاب', 'قيمنق'], rating: 4.4, reviewsCount: 280, discount: 29 }),
  mockProduct({ id: 'sr-10', name: 'كاميرا رقمية DSLR', slug: 'dslr-camera', brand: 'FotoMax', price: { amount: 2499, currency: 'SAR' }, tags: ['كاميرا', 'تصوير', 'DSLR'], rating: 4.7, reviewsCount: 95 }),
];

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') ?? '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return sortProducts(filterProducts(mockAllProducts, query), 'newest');
  }, [query]);

  return (
    <>
      <Container>
        <Breadcrumbs />
      </Container>
      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                نتائج البحث عن: <span className="text-blue-600">"{query}"</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {results.length > 0
                  ? `تم العثور على ${String(results.length)} ${results.length === 1 ? 'نتيجة' : 'نتائج'}`
                  : 'لم يتم العثور على نتائج'}
              </p>
            </div>

            {results.length > 0 ? (
              <ProductGrid products={results} columns={{ mobile: 2, tablet: 3, desktop: 4 }} />
            ) : (
              <EmptyState
                icon={<Search className="w-12 h-12" />}
                title="لا توجد نتائج"
                description={query ? `لا توجد نتائج مطابقة لـ "${query}". جرب كلمات بحث مختلفة.` : 'يرجى إدخال كلمة للبحث'}
                action={
                  <Button variant="primary" onClick={() => { navigate(-1); }}>
                    العودة للتصفح
                  </Button>
                }
              />
            )}
          </Stack>
        </Container>
      </Section>
    </>
  );
}

export default SearchResultsPage;
