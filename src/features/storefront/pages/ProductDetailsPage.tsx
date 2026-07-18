import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Heart, ShoppingCart, Minus, Plus, Star, Truck, Shield, RefreshCw,
  Check, Package,
} from 'lucide-react';
import {
  Container, Section, Stack, Grid, Flex, Card, CardBody, Button, Badge,
  Divider,
} from '@/design-system';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart.store';
import { useWishlistStore } from '../stores/wishlist.store';
import {
  formatPrice, getStockStatusLabel, getStockStatusColor,
} from '../utils';
import { Breadcrumbs } from '../layouts/Breadcrumbs';

const IMG = '/images/paper-cups-12oz.svg';

function createMockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: 'SKU-' + overrides.id,
    name: 'منتج',
    slug: 'product-' + overrides.id,
    description: 'وصف المنتج',
    shortDescription: 'وصف قصير للمنتج',
    price: { amount: 199, currency: 'SAR' },
    images: [{ id: 'img-' + overrides.id, url: IMG, alt: 'منتج', width: 500, height: 500, isPrimary: true }],
    categoryId: 'cat-1',
    categoryName: 'أكواب وأدوات',
    brand: 'TOKYO',
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
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const mockProduct: Product = {
  id: 'prod-detail-1',
  sku: 'SKU-12OZ-50',
  name: 'أكواب ورقية 12 أونصة',
  slug: 'paper-cups-12oz',
  description: 'أكواب ورقية عالية الجودة، مثالية للمشروبات الساخنة مثل القهوة والشاي. مصنوعة من ورق سميك مقاوم للحرارة والترطيب، بتصميم أنيق وعملي. مثالية للمقاهي والمطاعم والاستخدام المنزلي.',
  shortDescription: 'أكواب ورقية عالية الجودة للمشروبات الساخنة - عبوة 50 قطعة',
  price: { amount: 79, currency: 'SAR', oldAmount: 120 },
  images: [
    { id: 'img-1', url: '/images/paper-cups-12oz.svg', alt: 'أكواب ورقية 12 أونصة', width: 800, height: 800, isPrimary: true },
    { id: 'img-2', url: '/images/paper-cups-12oz.svg', alt: 'أكواب ورقية - جانب', width: 800, height: 800, isPrimary: false },
    { id: 'img-3', url: '/images/paper-cups-12oz.svg', alt: 'أكواب ورقية - تفاصيل', width: 800, height: 800, isPrimary: false },
    { id: 'img-4', url: '/images/paper-cups-12oz.svg', alt: 'أكواب ورقية - استعمال', width: 800, height: 800, isPrimary: false },
    { id: 'img-5', url: '/images/paper-cups-12oz.svg', alt: 'أكواب ورقية - عبوة', width: 800, height: 800, isPrimary: false },
  ],
  categoryId: 'cat-1',
  categoryName: 'أكواب وأكواب',
  brand: 'TOKYO',
  rating: 4.8,
  reviewsCount: 120,
  reviews: [
    { id: 'rev-1', rating: 5, title: 'جودة ممتازة', content: 'أكواب ممتازة وصلت بحالة ممتازة. أنصح بالشراء.', author: 'أحمد محمد', date: '2026-06-15', verified: true },
    { id: 'rev-2', rating: 5, title: 'سعة جيدة', content: 'السعة ممتازة والورق سميك. مناسب للقهوة الساخنة.', author: 'سارة العلي', date: '2026-06-10', verified: true },
    { id: 'rev-3', rating: 4, title: 'جيد جداً', content: 'منتج جيد بشكل عام. السعر مناسب.', author: 'خالد العمري', date: '2026-06-05', verified: false },
    { id: 'rev-4', rating: 5, title: 'أفضل أكواب استخدمتها', content: 'من أفضل الأكواب اللي استخدمتها. مقاومة جيدة للحرارة.', author: 'نورة السالم', date: '2026-05-28', verified: true },
    { id: 'rev-5', rating: 4, title: 'مناسب للمحل', content: 'أستخدمها في مقلتي وهي مناسبة جداً. التوصيل كان سريع.', author: 'محمد الشمري', date: '2026-05-20', verified: true },
  ],
  variants: [
    { id: 'var-1', name: 'أبيض', sku: 'SKU-12OZ-W', price: { amount: 79, currency: 'SAR' }, stock: 50, attributes: { color: 'أبيض' } },
    { id: 'var-2', name: 'بني', sku: 'SKU-12OZ-B', price: { amount: 85, currency: 'SAR' }, stock: 30, attributes: { color: 'بني' } },
    { id: 'var-3', name: 'أسود', sku: 'SKU-12OZ-K', price: { amount: 89, currency: 'SAR' }, stock: 25, attributes: { color: 'أسود' } },
  ],
  status: 'active',
  stockStatus: 'in_stock',
  stock: 50,
  tags: ['أكواب', 'ورقية', 'قهوة', 'مشروبات'],
  isNew: false,
  isFeatured: true,
  isBestSeller: true,
  discount: 34,
  createdAt: '2026-01-15',
  updatedAt: '2026-06-15',
};

const productCatalog: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: 'prod-2', sku: 'SKU-8OZ-50', name: 'أكواب ورقية 8 أونصة', slug: 'paper-cups-8oz',
    description: 'أكواب ورقية صغيرة مثالية للإسبريسو والمشروبات الساخنة. مصنوعة من ورق عالي الجودة بسعة 8 أونصة. مثالية للمقاهي التي تقدم مشروبات متنوعة.',
    shortDescription: 'أكواب ورقية صغيرة 8 أونصة - عبوة 50 قطعة',
    price: { amount: 55, currency: 'SAR', oldAmount: 75 },
    images: [
      { id: 'img-2-1', url: '/images/paper-cups-8oz.svg', alt: 'أكواب ورقية 8 أونصة', width: 800, height: 800, isPrimary: true },
    ],
    rating: 4.6, reviewsCount: 89, discount: 27,
    variants: [
      { id: 'var-2a', name: 'أبيض', sku: 'SKU-8OZ-W', price: { amount: 55, currency: 'SAR' }, stock: 40, attributes: { color: 'أبيض' } },
      { id: 'var-2b', name: 'أسود', sku: 'SKU-8OZ-K', price: { amount: 60, currency: 'SAR' }, stock: 35, attributes: { color: 'أسود' } },
    ],
    reviews: [
      { id: 'rev-2-1', rating: 5, title: 'ممتازة للإسبريسو', content: 'أكواب رائعة مناسبة تماماً للإسبريسو.', author: 'عبدالله السعيد', date: '2026-06-20', verified: true },
      { id: 'rev-2-2', rating: 4, title: 'جودة جيدة', content: 'الورق سميك والتصميم أنيق.', author: 'فاطمة الزهراء', date: '2026-06-18', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-3', sku: 'SKU-LID-100', name: 'غطاء كوب بلاستيكي', slug: 'cup-lid',
    description: 'غطاء بلاستيكي شفاف متوافق مع الأكواب الورقية 12 أونصة. يحمي المشروبات من التسرب ويبقيها ساخنة لفترة أطول. مصنوع من بلاستيك آمن للاستخدام الغذائي.',
    shortDescription: 'غطاء بلاستيكي شفاف للأكواب 12 أونصة - عبوة 100 قطعة',
    price: { amount: 35, currency: 'SAR' },
    images: [
      { id: 'img-3-1', url: '/images/cup-lid.svg', alt: 'غطاء كوب بلاستيكي', width: 800, height: 800, isPrimary: true },
    ],
    rating: 4.5, reviewsCount: 156, discount: 0,
    variants: [],
    reviews: [
      { id: 'rev-3-1', rating: 5, title: 'يناسب الكوب بشكل ممتاز', content: 'غطاء ممتاز لا يتسرع ولا ينزلق.', author: 'محمد العمري', date: '2026-06-22', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-4', sku: 'SKU-PLATE-9', name: 'صحن ورقي 9 إنش', slug: 'paper-plates-9',
    description: 'أطباق ورقية مستديرة بقطر 9 إنش، مثالية للوجبات الخفيفة والحلويات. مقاومة للزيوت والسوائل، سهلة التخلص منها بعد الاستخدام.',
    shortDescription: 'أطباق ورقية 9 إنش - عبوة 50 قطعة',
    price: { amount: 45, currency: 'SAR', oldAmount: 65 },
    images: [
      { id: 'img-4-1', url: '/images/paper-plates.svg', alt: 'أطباق ورقية', width: 800, height: 800, isPrimary: true },
    ],
    rating: 4.7, reviewsCount: 67, discount: 31,
    variants: [
      { id: 'var-4a', name: 'أبيض', sku: 'SKU-PLATE-W', price: { amount: 45, currency: 'SAR' }, stock: 60, attributes: { color: 'أبيض' } },
      { id: 'var-4b', name: 'بني', sku: 'SKU-PLATE-B', price: { amount: 50, currency: 'SAR' }, stock: 45, attributes: { color: 'بني' } },
    ],
    reviews: [
      { id: 'rev-4-1', rating: 5, title: 'ممتازة للحفلات', content: 'أطباق ممتازة للحفلات والتجمعات.', author: 'نورة الحربي', date: '2026-06-25', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-5', sku: 'SKU-STIR-200', name: 'عيدان تقليب خشبية', slug: 'wooden-stirrers',
    description: 'عيدان تقليب من الخشب الطبيعي، صديقة للبيئة. مناسبة للقهوة والشاي والمشروبات الباردة. طول 19 سم، مثالية للمقاهي والكوفيهات.',
    shortDescription: 'عيدان تقليب خشبية 19 سم - عبوة 200 قطعة',
    price: { amount: 22, currency: 'SAR' },
    images: [
      { id: 'img-5-1', url: '/images/wooden-stirrers.svg', alt: 'عيدان تقليب خشبية', width: 800, height: 800, isPrimary: true },
    ],
    rating: 4.4, reviewsCount: 200, discount: 0,
    variants: [],
    reviews: [
      { id: 'rev-5-1', rating: 5, title: 'صديقة للبيئة', content: 'عيدان خشبية جيدة جداً وصديقة للبيئة.', author: 'سعود الدوسري', date: '2026-06-28', verified: true },
    ],
  },
  {
    ...mockProduct,
    id: 'prod-6', sku: 'SKU-NAP-200', name: 'مناديل ورقية مطوية', slug: 'paper-napkins',
    description: 'مناديل ورقية ناعمة ومتينة، مثالية للطعام والمشروبات. مصنوعة من ورق عالي الامتصاص. متوفرة بألوان متعددة تناسب ديكور المطعم أو المقهى.',
    shortDescription: 'مناديل ورقية مطوية - عبوة 200 منديل',
    price: { amount: 28, currency: 'SAR', oldAmount: 35 },
    images: [
      { id: 'img-6-1', url: '/images/paper-napkins.svg', alt: 'مناديل ورقية مطوية', width: 800, height: 800, isPrimary: true },
    ],
    rating: 4.3, reviewsCount: 130, discount: 20,
    variants: [
      { id: 'var-6a', name: 'أبيض', sku: 'SKU-NAP-W', price: { amount: 28, currency: 'SAR' }, stock: 80, attributes: { color: 'أبيض' } },
      { id: 'var-6b', name: 'أسود', sku: 'SKU-NAP-K', price: { amount: 30, currency: 'SAR' }, stock: 50, attributes: { color: 'أسود' } },
    ],
    reviews: [
      { id: 'rev-6-1', rating: 4, title: 'ناعمة ومتينة', content: 'مناديل جيدة الامتصاص والملمس.', author: 'رائد القحطاني', date: '2026-07-01', verified: true },
    ],
  },
];

const productCatalogBySlug = new Map(productCatalog.map((p) => [p.slug, p]));

const relatedProducts: Product[] = [
  createMockProduct({ id: 'rel-1', name: 'أكواب ورقية 8 أونصة', slug: 'paper-cups-8oz', price: { amount: 65, currency: 'SAR', oldAmount: 85 }, rating: 4.6, reviewsCount: 89, discount: 24, images: [{ id: 'rel-img-1', url: '/images/paper-cups-8oz.svg', alt: 'أكواب ورقية 8 أونصة', width: 500, height: 500, isPrimary: true }] }),
  createMockProduct({ id: 'rel-2', name: 'غطاء كوب بلاستيكي', slug: 'cup-lid', price: { amount: 30, currency: 'SAR' }, rating: 4.5, reviewsCount: 156, images: [{ id: 'rel-img-2', url: '/images/cup-lid.svg', alt: 'غطاء كوب بلاستيكي', width: 500, height: 500, isPrimary: true }] }),
  createMockProduct({ id: 'rel-3', name: 'أطباق ورقية 9 إنش', slug: 'paper-plates-9', price: { amount: 55, currency: 'SAR', oldAmount: 70 }, rating: 4.7, reviewsCount: 67, discount: 21, images: [{ id: 'rel-img-3', url: '/images/paper-plates.svg', alt: 'أطباق ورقية', width: 500, height: 500, isPrimary: true }] }),
  createMockProduct({ id: 'rel-4', name: 'عيدان تقليب خشبية', slug: 'wooden-stirrers', price: { amount: 18, currency: 'SAR' }, rating: 4.4, reviewsCount: 200, images: [{ id: 'rel-img-4', url: '/images/wooden-stirrers.svg', alt: 'عيدان تقليب خشبية', width: 500, height: 500, isPrimary: true }] }),
];

const COLOR_MAP: Record<string, string> = {
  'أبيض': '#FFFFFF',
  'بني': '#8B4513',
  'أسود': '#1A1A1A',
};

const TAB_IDS = ['description', 'specs', 'reviews', 'shipping'] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  description: 'الوصف',
  specs: 'المواصفات',
  reviews: 'التقييمات',
  shipping: 'الشحن والاسترجاع',
};

const RATING_DISTRIBUTION = [
  { stars: 5, percent: 65 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 10 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 2 },
];

const SPECS = [
  { label: 'الماركة', value: 'TOKYO' },
  { label: 'بلد المنشأ', value: 'المملكة العربية السعودية' },
  { label: 'السعة', value: '12 أونصة (355 مل)' },
  { label: 'المادة', value: 'ورق عالي الجودة' },
  { label: 'العرض', value: '8.5 سم' },
  { label: 'الارتفاع', value: '11.5 سم' },
  { label: 'القطر', value: '7.5 سم' },
  { label: 'العبوة', value: '50 قطعة' },
  { label: 'مقاومة الحرارة', value: 'حتى 85 درجة مئوية' },
  { label: 'مناسب للمعشرات', value: 'نعم' },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${String(rating)} من 5 نجوم`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={'w-4 h-4 ' + (i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function QuantitySelector({ quantity, onIncrease, onDecrease, max }: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max: number;
}) {
  return (
    <Flex align="center" gap="sm" className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="نقص الكمية"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">{String(quantity)}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="زيادة الكمية"
      >
        <Plus className="w-4 h-4" />
      </button>
    </Flex>
  );
}

function ImageGallery({ images }: { images: Product['images'] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Stack gap="sm">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[selectedIndex]?.url ?? IMG}
          alt={images[selectedIndex]?.alt ?? 'المنتج'}
          className="w-full h-full object-cover"
        />
      </div>
      <Grid cols={{ mobile: 4, tablet: 5, desktop: 5 }} gap="sm">
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => { setSelectedIndex(index); }}
            className={
              'aspect-square rounded-lg overflow-hidden border-2 transition-all ' +
              (index === selectedIndex
                ? 'border-gray-900 ring-2 ring-gray-900/20'
                : 'border-transparent hover:border-gray-300')
            }
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </Grid>
    </Stack>
  );
}

function ProductSpecs() {
  return (
    <div className="divide-y divide-gray-100">
      {SPECS.map((spec) => (
        <div key={spec.label} className="flex py-3 text-sm">
          <span className="w-40 text-gray-500 shrink-0">{spec.label}</span>
          <span className="text-gray-900">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewDistributionBar() {
  return (
    <Stack gap="sm">
      {RATING_DISTRIBUTION.map((d) => (
        <Flex key={d.stars} align="center" gap="sm">
          <span className="text-xs text-gray-500 w-3 text-left">{String(d.stars)}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" aria-hidden="true" />
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.percent}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-8">{String(d.percent)}%</span>
        </Flex>
      ))}
    </Stack>
  );
}

function ReviewCard({ review }: { review: Product['reviews'][number] }) {
  return (
    <Card>
      <CardBody>
        <Flex align="center" justify="between" className="mb-2">
          <div>
            <p className="text-sm font-medium text-gray-900">{review.author}</p>
            <p className="text-xs text-gray-400">{review.date}</p>
          </div>
          <StarRating rating={review.rating} />
        </Flex>
        <p className="text-sm font-medium text-gray-900 mb-1">{review.title}</p>
        <p className="text-sm text-gray-600">{review.content}</p>
        {review.verified && (
          <Badge variant="success" size="sm" className="mt-2">
            <Check className="w-3 h-3 mr-1" />
            مشتري موثوق
          </Badge>
        )}
      </CardBody>
    </Card>
  );
}

function ShippingInfo() {
  const items = [
    { icon: <Truck className="w-5 h-5 text-blue-600" />, title: 'توصيل سريع', desc: 'نوصّل طلبك خلال 3-5 أيام عمل لجميع مناطق المملكة.' },
    { icon: <RefreshCw className="w-5 h-5 text-green-600" />, title: 'إرجاع سهل', desc: 'يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام.' },
    { icon: <Shield className="w-5 h-5 text-purple-600" />, title: 'ضمان الجودة', desc: 'جميع منتجاتنا مدعومة بضمان الجودة الرسمي.' },
    { icon: <Package className="w-5 h-5 text-orange-600" />, title: 'تغليف آمن', desc: 'نستخدم تغليف محكم لحماية المنتج أثناء الشحن.' },
  ];
  return (
    <Grid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="md">
      {items.map((item) => (
        <Flex key={item.title} gap="md" align="start" className="p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            {item.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">{item.title}</p>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        </Flex>
      ))}
    </Grid>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link to={'/products/' + product.slug} className="group">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]?.url ?? IMG}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <CardBody>
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </p>
          <Flex align="center" gap="sm">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price.amount)}</span>
            {product.price.oldAmount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price.oldAmount)}</span>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentProduct = (slug ? productCatalogBySlug.get(slug) : undefined) ?? mockProduct;
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    currentProduct.variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');

  const activeVariant = currentProduct.variants.find((v) => v.id === selectedVariant);
  const currentPrice = activeVariant?.price.amount ?? currentProduct.price.amount;
  const currentOldPrice = currentProduct.price.oldAmount;
  const isWishlisted = hasItem(currentProduct.id);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: currentProduct.id,
      productId: currentProduct.id,
      variantId: selectedVariant,
      name: currentProduct.name,
      image: currentProduct.images[0]?.url ?? '',
      price: { amount: currentPrice, currency: 'SAR' },
      quantity,
      maxQuantity: currentProduct.stock,
      stockStatus: currentProduct.stockStatus,
    });
  }, [addItem, selectedVariant, currentPrice, quantity, currentProduct]);

  const handleWishlistToggle = useCallback(() => {
    toggleItem(currentProduct.id);
  }, [toggleItem, currentProduct.id]);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((q) => Math.min(q + 1, currentProduct.stock));
  }, [currentProduct.stock]);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  return (
    <main dir="rtl">
      <Container>
        <Breadcrumbs />

        {/* Two-column layout */}
        <Grid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="xl" className="mb-16">
          {/* Gallery — right side in RTL */}
          <div className="order-1 md:order-2">
            <ImageGallery images={currentProduct.images} />
          </div>

          {/* Product info — left side in RTL */}
          <div className="order-2 md:order-1">
            <Stack gap="lg">
              {/* Badges */}
              <Flex gap="sm" wrap>
                {currentProduct.isNew && <Badge variant="success">جديد</Badge>}
                {currentProduct.isBestSeller && <Badge variant="warning">الأكثر مبيعاً</Badge>}
                {currentProduct.discount > 0 && <Badge variant="danger">خصم {String(currentProduct.discount)}%</Badge>}
                <Badge variant="info">جودة ممتازة</Badge>
              </Flex>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating */}
              <Flex align="center" gap="sm">
                <StarRating rating={currentProduct.rating} />
                <span className="text-sm font-medium text-gray-900">{String(currentProduct.rating)}</span>
                <span className="text-sm text-gray-500">({String(currentProduct.reviewsCount)} تقييم)</span>
                <Divider orientation="vertical" className="h-4 mx-1" />
                <span className={'text-sm font-medium ' + getStockStatusColor(currentProduct.stockStatus)}>
                  {getStockStatusLabel(currentProduct.stockStatus)}
                </span>
              </Flex>

              {/* Price */}
              <Flex align="center" gap="sm" wrap>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
                {currentOldPrice && currentOldPrice > currentPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(currentOldPrice)}</span>
                    <Badge variant="danger" size="sm">
                      وفر {formatPrice(currentOldPrice - currentPrice)}
                    </Badge>
                  </>
                )}
              </Flex>

              <Divider />

              {/* Short description */}
              <p className="text-sm text-gray-600 leading-relaxed">{currentProduct.shortDescription}</p>

              {/* Color / variant selector */}
              {currentProduct.variants.length > 0 && (
                <Stack gap="sm">
                  <p className="text-sm font-medium text-gray-900">
                    اللون: <span className="font-normal text-gray-600">{activeVariant?.name ?? ''}</span>
                  </p>
                  <Flex gap="sm">
                    {currentProduct.variants.map((variant) => {
                      const colorValue: string = (COLOR_MAP[variant.attributes.color ?? ''] as string | undefined) ?? '#CCCCCC';
                      const isSelected = variant.id === selectedVariant;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => { setSelectedVariant(variant.id); setQuantity(1); }}
                          className={
                            'relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ' +
                            (isSelected
                              ? 'border-gray-900 ring-2 ring-gray-900/20'
                              : 'border-gray-300 hover:border-gray-400')
                          }
                          aria-label={variant.name}
                          title={variant.name}
                        >
                          <span
                            className="w-7 h-7 rounded-full border border-gray-200"
                            style={{ backgroundColor: colorValue }}
                          />
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </Flex>
                </Stack>
              )}

              {/* Quantity + Add to cart */}
              <Stack gap="md">
                <Flex align="center" gap="lg" wrap>
                  <Stack gap="xs">
                    <p className="text-sm font-medium text-gray-900">الكمية</p>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      max={currentProduct.stock}
                    />
                  </Stack>
                  <p className="text-xs text-gray-500">
                    {String(currentProduct.stock)} قطعة متاحة
                  </p>
                </Flex>

                <Flex gap="sm">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={currentProduct.stockStatus === 'out_of_stock'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {currentProduct.stockStatus === 'out_of_stock' ? 'غير متوفر' : 'أضف إلى السلة'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlistToggle}
                    className={isWishlisted ? 'text-red-500 border-red-300' : ''}
                    aria-label={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart className={'w-5 h-5 ' + (isWishlisted ? 'fill-red-500' : '')} />
                  </Button>
                </Flex>
              </Stack>

              <Divider />

              {/* Trust badges */}
              <Grid cols={{ mobile: 3, tablet: 3, desktop: 3 }} gap="md">
                <Flex align="center" gap="sm">
                  <Truck className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">توصيل سريع</p>
                    <p className="text-[10px] text-gray-500">3-5 أيام عمل</p>
                  </div>
                </Flex>
                <Flex align="center" gap="sm">
                  <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">دفع آمن</p>
                    <p className="text-[10px] text-gray-500">تشفير SSL</p>
                  </div>
                </Flex>
                <Flex align="center" gap="sm">
                  <RefreshCw className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">إرجاع سهل</p>
                    <p className="text-[10px] text-gray-500">خلال 30 يوم</p>
                  </div>
                </Flex>
              </Grid>

              {/* SKU + tags */}
              <Stack gap="xs">
                <p className="text-xs text-gray-500">
                  رمز المنتج: <span className="text-gray-700">{currentProduct.sku}</span>
                </p>
                <Flex gap="sm" wrap>
                  {currentProduct.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                  ))}
                </Flex>
              </Stack>
            </Stack>
          </div>
        </Grid>

        {/* Product tabs */}
        <Section padding="lg" className="border-t border-gray-200">
          <Stack gap="lg">
            <Flex gap="md" className="border-b border-gray-200 overflow-x-auto">
              {TAB_IDS.map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => { setActiveTab(tabId); }}
                  className={
                    'relative pb-3 text-sm font-medium whitespace-nowrap transition-colors ' +
                    (activeTab === tabId
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700')
                  }
                >
                  {TAB_LABELS[tabId]}
                  {tabId === 'reviews' && (
                    <span className="mr-1 text-xs text-gray-400">({String(currentProduct.reviewsCount)})</span>
                  )}
                  {activeTab === tabId && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </Flex>

            {/* Tab content */}
            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-4">{currentProduct.description}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">المميزات الرئيسية</h3>
                  <ul className="space-y-2">
                    {[
                      'ورق سميك مقاوم للحرارة حتى 85 درجة مئوية',
                      'مقاوم للترطيب والتسرب',
                      'تصميم أنيق مناسب لجميع المناسبات',
                      'مصنوعة من مواد آمنة على الصحة',
                      'عبوة اقتصادية تحتوي 50 قطعة',
                      'مناسبة للمقاهي والمطاعم والاستخدام المنزلي',
                    ].map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && <ProductSpecs />}

              {activeTab === 'reviews' && (
                <Stack gap="lg">
                  <Grid cols={{ mobile: 1, tablet: 3, desktop: 3 }} gap="lg">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-4xl font-bold text-gray-900 mb-1">{String(currentProduct.rating)}</p>
                      <StarRating rating={currentProduct.rating} />
                      <p className="text-sm text-gray-500 mt-1">{String(currentProduct.reviewsCount)} تقييم</p>
                    </div>
                    <div className="col-span-2">
                      <ReviewDistributionBar />
                    </div>
                  </Grid>
                  <Stack gap="md">
                    {currentProduct.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </Stack>
                </Stack>
              )}

              {activeTab === 'shipping' && <ShippingInfo />}
            </div>
          </Stack>
        </Section>

        {/* Related products */}
        <Section padding="lg" className="border-t border-gray-200">
          <Stack gap="lg">
            <Flex align="center" justify="between">
              <h2 className="text-xl font-bold text-gray-900">منتجات ذات صلة</h2>
              <Link
                to={'/categories/' + currentProduct.categoryId}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                عرض الكل
              </Link>
            </Flex>
            <Grid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {relatedProducts.map((product) => (
                <RelatedProductCard key={product.id} product={product} />
              ))}
            </Grid>
          </Stack>
        </Section>
      </Container>
    </main>
  );
}

export default ProductDetailsPage;
