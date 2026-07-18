import { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Container, Section, Stack, Flex, Card, CardBody, Select, Button, Divider, Checkbox, EmptyState } from '@/design-system';
import type { Product, ProductSortOption } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { Breadcrumbs } from '../layouts/Breadcrumbs';
import { STOREFRONT_SORT_OPTIONS } from '../constants';


function mockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: `SKU-${overrides.id}`, name: 'منتج', slug: `product-${overrides.id}`, description: 'وصف', shortDescription: 'وصف قصير',
    price: { amount: 199, currency: 'SAR', oldAmount: 249 },
    images: [{ id: `img-${overrides.id}`, url: '/images/paper-cups-12oz.svg', alt: 'منتج', width: 500, height: 500, isPrimary: true }],
    categoryId: 'cat-1', categoryName: 'إلكترونيات', brand: 'براند', rating: 4.5, reviewsCount: 25, reviews: [], variants: [],
    status: 'active', stockStatus: 'in_stock', stock: 50, tags: [], isNew: false, isFeatured: false, isBestSeller: false, discount: 0,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...overrides,
  };
}

const allProducts: Product[] = Array.from({ length: 48 }).map((_, i) =>
  mockProduct({
    id: `plp-${String(i + 1)}`,
    name: `منتج ${String(i + 1)}`,
    slug: `product-${String(i + 1)}`,
    brand: ['TechCo', 'SoundPro', 'UrbanGear', 'VogueStyle', 'HomeCare', 'GlowUp'][i % 6],
    price: { amount: 49 + i * 25, currency: 'SAR', oldAmount: i % 3 === 0 ? 79 + i * 25 : undefined },
    categoryId: `cat-${String((i % 6) + 1)}`,
    categoryName: ['إلكترونيات', 'أزياء', 'منزل ومطبخ', 'جمال وعناية', 'رياضة', 'ألعاب'][i % 6],
    rating: 3.5 + (i % 15) / 10,
    reviewsCount: 10 + i * 3,
    discount: i % 3 === 0 ? 20 : 0,
    isNew: i < 8,
    isFeatured: i < 12,
    isBestSeller: i >= 24 && i < 30,
    stockStatus: i % 8 === 7 ? 'out_of_stock' : i % 10 === 9 ? 'low_stock' : 'in_stock',
  }),
);

const categories = [
  { id: 'cat-1', name: 'إلكترونيات', count: 120 },
  { id: 'cat-2', name: 'أزياء', count: 240 },
  { id: 'cat-3', name: 'منزل ومطبخ', count: 180 },
  { id: 'cat-4', name: 'جمال وعناية', count: 90 },
  { id: 'cat-5', name: 'رياضة', count: 65 },
  { id: 'cat-6', name: 'ألعاب', count: 45 },
];

const priceRanges = [
  { label: 'أقل من ١٠٠ ريال', min: 0, max: 100 },
  { label: '١٠٠ - ٢٥٠ ريال', min: 100, max: 250 },
  { label: '٢٥٠ - ٥٠٠ ريال', min: 250, max: 500 },
  { label: '٥٠٠ - ١٠٠٠ ريال', min: 500, max: 1000 },
  { label: 'أكثر من ١٠٠٠ ريال', min: 1000, max: Infinity },
];

export function ProductListingPage() {
  const [sort, setSort] = useState<ProductSortOption>('featured');
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categoryId));
    }
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) =>
        selectedPriceRanges.some((idx) => {
          const range = priceRanges[idx];
          return range ? p.price.amount >= range.min && p.price.amount < range.max : false;
        }),
      );
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'in_stock');
    }
    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price.amount - b.price.amount); break;
      case 'price_desc': result.sort((a, b) => b.price.amount - a.price.amount); break;
      case 'rating_desc': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'best_selling': result.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
    }
    return result;
  }, [sort, selectedCategories, selectedPriceRanges, inStockOnly]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    setPage(1);
  };

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
    setPage(1);
  };

  return (
    <>
      <Container>
        <Breadcrumbs />
      </Container>
      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <Flex align="center" justify="between" wrap className="gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
                <p className="text-sm text-gray-500 mt-1">{filtered.length} منتج</p>
              </div>
              <Flex align="center" gap={3}>
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => { setShowFilters(!showFilters); }}>
                  {showFilters ? 'إخفاء الفلترة' : 'فلترة'}
                </Button>
                <Select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as ProductSortOption); }}
                  options={STOREFRONT_SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
                  aria-label="ترتيب حسب"
                />
              </Flex>
            </Flex>

            <div className="flex gap-6">
              <aside className={`hidden lg:block w-64 flex-shrink-0${showFilters ? ' block' : ''}`}>
                <Card>
                  <CardBody className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">التصنيفات</h3>
                      <Stack gap={2}>
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                            <Checkbox
                              checked={selectedCategories.includes(cat.id)}
                              onChange={() => { toggleCategory(cat.id); }}
                            />
                            <span className="flex-1">{cat.name}</span>
                            <span className="text-xs text-gray-400">({cat.count})</span>
                          </label>
                        ))}
                      </Stack>
                    </div>
                    <Divider />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">نطاق السعر</h3>
                      <Stack gap={2}>
                        {priceRanges.map((range, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                            <Checkbox
                              checked={selectedPriceRanges.includes(idx)}
                              onChange={() => { togglePriceRange(idx); }}
                            />
                            <span>{range.label}</span>
                          </label>
                        ))}
                      </Stack>
                    </div>
                    <Divider />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">متوفر</h3>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        <Checkbox
                          checked={inStockOnly}
                          onChange={() => { setInStockOnly(!inStockOnly); setPage(1); }}
                        />
                        <span>المتاح فقط</span>
                      </label>
                    </div>
                  </CardBody>
                </Card>
              </aside>

              <div className="flex-1 min-w-0">
                {pageProducts.length > 0 ? (
                  <ProductGrid products={pageProducts} columns={{ mobile: 2, tablet: 2, desktop: 3 }} />
                ) : (
                  <EmptyState
                    icon={<ShoppingBag />}
                    title="لا توجد منتجات"
                    description="لم نتمكن من العثور على منتجات تطابق معايير البحث. جرّب تغيير الفلاتر."
                    action={
                      <Button variant="outline" onClick={() => { setSelectedCategories([]); setSelectedPriceRanges([]); setInStockOnly(false); setSort('featured'); setPage(1); }}>
                        مسح الفلاتر
                      </Button>
                    }
                  />
                )}

                {totalPages > 1 && (
                  <Flex justify="center" className="mt-8" gap={2}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => { setPage((p) => Math.max(1, p - 1)); }}
                    >
                      السابق
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={page === i + 1 ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => { setPage(i + 1); }}
                        className="min-w-[36px]"
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); }}
                    >
                      التالي
                    </Button>
                  </Flex>
                )}
              </div>
            </div>
          </Stack>
        </Container>
      </Section>
    </>
  );
}

export default ProductListingPage;
