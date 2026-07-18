import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, HeadphonesIcon } from 'lucide-react';
import {
  Container, Section, Stack, Grid, Flex, Card, CardBody, Button, Badge,
} from '@/design-system';
import type { Product, Category } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductGrid } from '../components/ProductGrid';
import { FlashDealCard } from '../components/FlashDealCard';
import { BrandCard } from '../components/BrandCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { NewsletterForm } from '../components/NewsletterForm';
import { FeatureCard } from '../components/FeatureCard';
import { formatPrice, getProductUrl } from '../utils';

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'إلكترونيات', slug: 'electronics', description: 'أحدث الأجهزة الإلكترونية', image: '/images/cat-electronics.jpg', icon: undefined, parentId: null, children: [], productCount: 120, sortOrder: 1, isActive: true },
  { id: 'cat-2', name: 'أزياء', slug: 'fashion', description: 'أحدث صيحات الموضة', image: '/images/cat-fashion.jpg', icon: undefined, parentId: null, children: [], productCount: 240, sortOrder: 2, isActive: true },
  { id: 'cat-3', name: 'منزل ومطبخ', slug: 'home-kitchen', description: 'كل ما تحتاجه لمنزلك', image: '/images/cat-home.jpg', icon: undefined, parentId: null, children: [], productCount: 180, sortOrder: 3, isActive: true },
  { id: 'cat-4', name: 'جمال وعناية', slug: 'beauty', description: 'منتجات العناية الشخصية', image: '/images/cat-beauty.jpg', icon: undefined, parentId: null, children: [], productCount: 90, sortOrder: 4, isActive: true },
  { id: 'cat-5', name: 'رياضة', slug: 'sports', description: 'مستلزمات الرياضة', image: '/images/cat-sports.jpg', icon: undefined, parentId: null, children: [], productCount: 65, sortOrder: 5, isActive: true },
  { id: 'cat-6', name: 'ألعاب', slug: 'toys', description: 'ألعاب للأطفال والكبار', image: '/images/cat-toys.jpg', icon: undefined, parentId: null, children: [], productCount: 45, sortOrder: 6, isActive: true },
];

function mockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: `SKU-${overrides.id}`,
    name: 'منتج تجريبي',
    slug: `product-${overrides.id}`,
    description: 'وصف المنتج التجريبي',
    shortDescription: 'وصف قصير للمنتج',
    price: { amount: 199, currency: 'SAR', oldAmount: 249 },
    images: [{ id: `img-${overrides.id}`, url: '/images/product-placeholder.jpg', alt: 'منتج', width: 500, height: 500, isPrimary: true }],
    categoryId: 'cat-1',
    categoryName: 'إلكترونيات',
    brand: 'براند',
    rating: 4.5,
    reviewsCount: 25,
    reviews: [],
    variants: [],
    status: 'active',
    stockStatus: 'in_stock',
    stock: 50,
    tags: [],
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    discount: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const mockFeaturedProducts: Product[] = [
  mockProduct({ id: 'fp-1', name: 'سماعات لاسلكية بلوتوث', slug: 'wireless-earbuds', brand: 'SoundPro', price: { amount: 349, currency: 'SAR', oldAmount: 499 }, rating: 4.7, reviewsCount: 156, discount: 30, isFeatured: true, isNew: true }),
  mockProduct({ id: 'fp-2', name: 'ساعة ذكية رياضية', slug: 'smart-watch', brand: 'TechFit', price: { amount: 599, currency: 'SAR', oldAmount: 799 }, rating: 4.5, reviewsCount: 89, discount: 25, isFeatured: true }),
  mockProduct({ id: 'fp-3', name: 'حقيبة ظهر عصرية', slug: 'fashion-backpack', brand: 'UrbanGear', price: { amount: 249, currency: 'SAR', oldAmount: 329 }, rating: 4.3, reviewsCount: 42, discount: 24, isFeatured: true }),
  mockProduct({ id: 'fp-4', name: 'نظارة شمسية فاخرة', slug: 'luxury-sunglasses', brand: 'VogueStyle', price: { amount: 449, currency: 'SAR', oldAmount: 649 }, rating: 4.6, reviewsCount: 73, discount: 31, isFeatured: true }),
  mockProduct({ id: 'fp-5', name: 'ماوس لاسلكي احترافي', slug: 'pro-wireless-mouse', brand: 'TechGear', price: { amount: 189, currency: 'SAR', oldAmount: 259 }, rating: 4.4, reviewsCount: 210, discount: 27, isFeatured: true }),
  mockProduct({ id: 'fp-6', name: 'قارئ كتب إلكترونية', slug: 'e-reader', brand: 'PageFlip', price: { amount: 799, currency: 'SAR', oldAmount: 999 }, rating: 4.8, reviewsCount: 61, discount: 20, isFeatured: true }),
  mockProduct({ id: 'fp-7', name: 'منظف بالبخار المحمول', slug: 'steam-cleaner', brand: 'HomeCare', price: { amount: 299, currency: 'SAR', oldAmount: 399 }, rating: 4.2, reviewsCount: 38, discount: 25, isFeatured: true }),
  mockProduct({ id: 'fp-8', name: 'طقم أدوات مكتبية فاخرة', slug: 'luxury-desk-set', brand: 'OfficePro', price: { amount: 159, currency: 'SAR', oldAmount: 219 }, rating: 4.1, reviewsCount: 27, discount: 27, isFeatured: true }),
];

const newArrivals: Product[] = [
  mockProduct({ id: 'na-1', name: 'هاتف ذكي أحدث إصدار', slug: 'latest-smartphone', brand: 'TechCo', price: { amount: 2999, currency: 'SAR' }, rating: 4.9, reviewsCount: 5, isNew: true, stockStatus: 'coming_soon' }),
  mockProduct({ id: 'na-2', name: 'جهاز لوحي للرسم', slug: 'drawing-tablet', brand: 'ArtTech', price: { amount: 1299, currency: 'SAR', oldAmount: 1599 }, rating: 4.7, reviewsCount: 3, isNew: true, discount: 19 }),
  mockProduct({ id: 'na-3', name: 'سماعة رأس عازلة للضوضاء', slug: 'noise-canceling-headphones', brand: 'SoundPro', price: { amount: 899, currency: 'SAR', oldAmount: 1199 }, rating: 4.6, reviewsCount: 8, isNew: true, discount: 25 }),
  mockProduct({ id: 'na-4', name: 'سوار ذكي للياقة', slug: 'fitness-band', brand: 'TechFit', price: { amount: 449, currency: 'SAR' }, rating: 4.4, reviewsCount: 12, isNew: true }),
  mockProduct({ id: 'na-5', name: 'مصباح مكتبي LED ذكي', slug: 'smart-led-lamp', brand: 'HomeTech', price: { amount: 179, currency: 'SAR', oldAmount: 239 }, rating: 4.3, reviewsCount: 6, isNew: true, discount: 25 }),
  mockProduct({ id: 'na-6', name: 'شاحن لاسلكي سريع', slug: 'fast-wireless-charger', brand: 'TechGear', price: { amount: 129, currency: 'SAR' }, rating: 4.5, reviewsCount: 15, isNew: true }),
];

const flashDeals: Product[] = [
  mockProduct({ id: 'fd-1', name: 'ساعة أنيقة', slug: 'elegant-watch', brand: 'LuxTime', price: { amount: 499, currency: 'SAR', oldAmount: 999 }, rating: 4.8, reviewsCount: 320, discount: 50, stockStatus: 'low_stock', stock: 5 }),
  mockProduct({ id: 'fd-2', name: 'حقيبة يد جلدية', slug: 'leather-handbag', brand: 'VogueStyle', price: { amount: 399, currency: 'SAR', oldAmount: 799 }, rating: 4.6, reviewsCount: 185, discount: 50, stockStatus: 'low_stock', stock: 3 }),
  mockProduct({ id: 'fd-3', name: 'سماعات بلوتوث رياضية', slug: 'sports-earbuds', brand: 'SoundPro', price: { amount: 199, currency: 'SAR', oldAmount: 399 }, rating: 4.4, reviewsCount: 98, discount: 50, stock: 12 }),
  mockProduct({ id: 'fd-4', name: 'مكياج احترافي', slug: 'pro-makeup-kit', brand: 'GlowUp', price: { amount: 249, currency: 'SAR', oldAmount: 499 }, rating: 4.7, reviewsCount: 156, discount: 50, stockStatus: 'low_stock', stock: 7 }),
];

const bestSellers: Product[] = [
  mockProduct({ id: 'bs-1', name: 'الهاتف الذكي برو', slug: 'pro-smartphone', brand: 'TechCo', price: { amount: 2499, currency: 'SAR', oldAmount: 2999 }, rating: 4.9, reviewsCount: 1240, discount: 17, isBestSeller: true }),
  mockProduct({ id: 'bs-2', name: 'حذاء رياضي كلاسيكي', slug: 'classic-sneakers', brand: 'UrbanGear', price: { amount: 349, currency: 'SAR', oldAmount: 499 }, rating: 4.7, reviewsCount: 890, discount: 30, isBestSeller: true }),
  mockProduct({ id: 'bs-3', name: 'طقم قدور ستانلس ستيل', slug: 'stainless-pot-set', brand: 'HomeCare', price: { amount: 599, currency: 'SAR', oldAmount: 849 }, rating: 4.5, reviewsCount: 430, discount: 29, isBestSeller: true }),
  mockProduct({ id: 'bs-4', name: 'كريم ترطيب فاخر', slug: 'luxury-moisturizer', brand: 'GlowUp', price: { amount: 179, currency: 'SAR', oldAmount: 259 }, rating: 4.6, reviewsCount: 670, discount: 31, isBestSeller: true }),
];

const brands = [
  { name: 'TechCo', logo: '/images/brand-techco.png', productCount: 45 },
  { name: 'SoundPro', logo: '/images/brand-soundpro.png', productCount: 32 },
  { name: 'UrbanGear', logo: '/images/brand-urbangear.png', productCount: 28 },
  { name: 'VogueStyle', logo: '/images/brand-voguestyle.png', productCount: 53 },
  { name: 'HomeCare', logo: '/images/brand-homecare.png', productCount: 37 },
  { name: 'TechFit', logo: '/images/brand-techfit.png', productCount: 19 },
  { name: 'GlowUp', logo: '/images/brand-glowup.png', productCount: 41 },
  { name: 'LuxTime', logo: '/images/brand-luxtime.png', productCount: 14 },
];

const testimonials = [
  { name: 'سارة الأحمد', avatar: '/images/avatar-1.jpg', rating: 5, content: 'تجربة تسوق رائعة! المنتجات عالية الجودة والتوصيل سريع جداً. أنصح الجميع بالتسوق من هنا.', date: '2026-06-15' },
  { name: 'محمد العتيبي', avatar: '/images/avatar-2.jpg', rating: 5, content: 'موقع ممتاز وأسعار منافسة. الطلب وصلني خلال يومين والتغليف كان احترافياً.', date: '2026-06-10' },
  { name: 'نورة الدوسري', avatar: '/images/avatar-3.jpg', rating: 4, content: 'تشكيلة واسعة من المنتجات والأسعار معقولة. خدمة العملاء سريعة في الرد والمساعدة.', date: '2026-06-05' },
];

const flashDealEnd = new Date(Date.now() + 8 * 3600 * 1000).toISOString();

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const getTime = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    const total = Math.floor(diff / 1000);
    return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
  }, [endsAt]);

  const [time, setTime] = useState(getTime);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => { setTime(getTime()); }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [getTime]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1" dir="ltr">
      <div className="flex flex-col items-center bg-white/20 rounded-md px-2 py-1 min-w-[40px]">
        <span className="text-lg font-bold text-white">{pad(time.hours)}</span>
        <span className="text-[10px] text-white/80">ساعة</span>
      </div>
      <span className="text-lg font-bold text-white">:</span>
      <div className="flex flex-col items-center bg-white/20 rounded-md px-2 py-1 min-w-[40px]">
        <span className="text-lg font-bold text-white">{pad(time.minutes)}</span>
        <span className="text-[10px] text-white/80">دقيقة</span>
      </div>
      <span className="text-lg font-bold text-white">:</span>
      <div className="flex flex-col items-center bg-white/20 rounded-md px-2 py-1 min-w-[40px]">
        <span className="text-lg font-bold text-white">{pad(time.seconds)}</span>
        <span className="text-[10px] text-white/80">ثانية</span>
      </div>
    </div>
  );
}

export function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <>
      <HeroBanner />

      <Section padding="lg">
        <Container>
          <Grid cols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
            {mockCategories.slice(0, 6).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </Grid>
        </Container>
      </Section>

      <Section padding="lg" background="muted">
        <Container>
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">المنتجات المميزة</h2>
                <p className="text-sm text-gray-500 mt-1">اختر من بين أفضل منتجاتنا</p>
              </div>
              <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                عرض الكل ←
              </Link>
            </Flex>
            <ProductGrid products={mockFeaturedProducts} columns={{ mobile: 2, tablet: 3, desktop: 4 }} />
          </Stack>
        </Container>
      </Section>

      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">وصل حديثاً</h2>
                <p className="text-sm text-gray-500 mt-1">أحدث المنتجات المضافة</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { scroll('right'); }} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="التمرير لليسار">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => { scroll('left'); }} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="التمرير لليمين">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </Flex>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
              {newArrivals.map((product) => (
                <div key={product.id} className="min-w-[240px] flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <Link to={getProductUrl(product.slug)} className="group block">
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full">
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <img src="/images/product-placeholder.jpg" alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        {product.isNew && <Badge variant="success" className="absolute top-2 right-2">جديد</Badge>}
                        {product.discount > 0 && <Badge variant="danger" className="absolute top-2 left-2">-{product.discount}%</Badge>}
                      </div>
                      <CardBody className="p-3">
                        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{formatPrice(product.price.amount)}</span>
                          {product.price.oldAmount && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price.oldAmount)}</span>}
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </Section>

      <Section padding="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <Container>
          <Flex align="center" justify="between" wrap className="gap-6">
            <div className="max-w-xl">
              <Badge variant="warning" className="mb-3">عرض خاص</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">خصم يصل إلى ٥٠٪ على تشكيلة الصيف</h2>
              <p className="text-blue-100 mb-6">استمتع بتشكيلة واسعة من المنتجات الصيفية بأسعار لا تقبل المنافسة. العرض ساري لفترة محدودة.</p>
              <Link to="/products?offer=summer-sale">
                <Button variant="secondary" size="lg">تسوق الآن</Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <img src="/images/promo-banner.png" alt="عرض الصيف" className="max-w-[300px]" loading="lazy" />
            </div>
          </Flex>
        </Container>
      </Section>

      <Section padding="lg" background="muted">
        <Container>
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">عروض خاصة لفترة محدودة</h2>
                <p className="text-sm text-gray-500 mt-1">خصم ٥٠٪ على منتجات مختارة</p>
              </div>
              <CountdownTimer endsAt={flashDealEnd} />
            </Flex>
            <Grid cols={{ mobile: 2, tablet: 2, desktop: 4 }} gap="md">
              {flashDeals.map((product) => (
                <FlashDealCard key={product.id} product={product} endsAt={flashDealEnd} />
              ))}
            </Grid>
            <Flex justify="center">
              <Link to="/products?offer=flash-deals">
                <Button variant="outline">عرض كل العروض</Button>
              </Link>
            </Flex>
          </Stack>
        </Container>
      </Section>

      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">الأكثر مبيعاً</h2>
                <p className="text-sm text-gray-500 mt-1">المنتجات الأكثر طلباً</p>
              </div>
              <Link to="/products?sort=best_selling" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                عرض الكل ←
              </Link>
            </Flex>
            <ProductGrid products={bestSellers} columns={{ mobile: 2, tablet: 3, desktop: 4 }} />
          </Stack>
        </Container>
      </Section>

      <Section padding="lg" background="muted">
        <Container>
          <Stack gap="lg">
            <Flex justify="center">
              <h2 className="text-2xl font-bold text-gray-900 text-center">الماركات العالمية</h2>
            </Flex>
            <Grid cols={{ mobile: 2, tablet: 4, desktop: 8 }} gap="sm">
              {brands.map((brand) => (
                <BrandCard key={brand.name} name={brand.name} logo={brand.logo} productCount={brand.productCount} />
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <Flex justify="center">
              <h2 className="text-2xl font-bold text-gray-900 text-center">ماذا يقول عملاؤنا</h2>
            </Flex>
            <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} name={t.name} avatar={t.avatar} rating={t.rating} content={t.content} date={t.date} />
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section padding="lg" className="bg-gray-900 text-white">
        <Container>
          <Stack gap="lg" align="center">
            <Flex justify="center">
              <h2 className="text-2xl md:text-3xl font-bold text-center">اشترك في النشرة البريدية</h2>
            </Flex>
            <p className="text-gray-400 text-center max-w-lg">احصل على أحدث العروض والتخفيضات مباشرة على بريدك الإلكتروني. وفر ١٠٪ على أول طلبية!</p>
            <div className="w-full max-w-md">
              <NewsletterForm />
            </div>
          </Stack>
        </Container>
      </Section>

      <Section padding="lg" className="border-t">
        <Container>
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            <FeatureCard icon={<Truck className="w-6 h-6" />} title="توصيل مجاني" description="للطلبات فوق ٢٠٠ ريال مع توصيل سريع خلال ٣-٥ أيام عمل" />
            <FeatureCard icon={<Shield className="w-6 h-6" />} title="دفع آمن" description="طرق دفع متعددة وآمنة. بياناتك محمية ومشفرة" />
            <FeatureCard icon={<RefreshCw className="w-6 h-6" />} title="إرجاع مجاني" description="إرجاع المنتجات خلال ٣٠ يوماً بدون رسوم" />
            <FeatureCard icon={<HeadphonesIcon className="w-6 h-6" />} title="دعم 24/7" description="فريق دعم متاح على مدار الساعة لمساعدتك" />
          </Grid>
        </Container>
      </Section>
    </>
  );
}

export default HomePage;
