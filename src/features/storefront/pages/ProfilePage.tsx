import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Ticket,
  Wallet,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Truck,
  RotateCcw,
  Receipt,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Star,
  Home,
  Briefcase,
  LayoutDashboard,
} from 'lucide-react';
import {
  Container,
  Section,
  Stack,
  Grid,
  Flex,
  Card,
  CardBody,
  Button,
  Badge,
  Divider,
  Avatar,
  EmptyState,
} from '@/design-system';
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart.store';
import { formatPrice } from '../utils';

const mockUser = {
  id: 'user-1',
  name: 'أحمد محمد',
  email: 'ahmed.m@gmail.com',
  phone: '0512345678',
  avatarUrl: undefined,
  role: 'guest' as const,
  roleId: 'role-1',
  isEmailVerified: true,
  isActive: true,
};

interface MockAddress {
  id: string;
  label: string;
  isDefault: boolean;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  country: string;
  phone: string;
}

const mockAddresses: MockAddress[] = [
  {
    id: 'addr-1',
    label: 'المنزل',
    isDefault: true,
    city: 'الجزيرة',
    district: '',
    street: 'شارع التلل، بجوار مسجد السلام',
    postalCode: '12345',
    country: 'مصر',
    phone: '01012345678',
  },
  {
    id: 'addr-2',
    label: 'العمل',
    isDefault: false,
    city: 'القاهرة الجديدة',
    district: '',
    street: 'شارع التيسين الشمالي',
    postalCode: '11835',
    country: 'مصر',
    phone: '01123456789',
  },
];

type OrderStatus = 'delivered' | 'in_transit' | 'confirmed';

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  statusLabel: string;
  itemCount: number;
  total: number;
}

const mockOrders: MockOrder[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-25051578',
    date: '2025-05-13',
    status: 'delivered',
    statusLabel: 'تم التوصيل',
    itemCount: 3,
    total: 267.3,
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-25051022',
    date: '2025-05-10',
    status: 'in_transit',
    statusLabel: 'جاري التوصيل',
    itemCount: 2,
    total: 189.0,
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-25050755',
    date: '2025-05-07',
    status: 'confirmed',
    statusLabel: 'تم تأكيد الطلب',
    itemCount: 1,
    total: 95.5,
  },
];

function mockProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    sku: `SKU-${overrides.id}`,
    name: 'منتج',
    slug: `product-${overrides.id}`,
    description: 'وصف',
    shortDescription: 'وصف قصير',
    price: { amount: 199, currency: 'SAR' },
    images: [
      {
        id: `img-${overrides.id}`,
        url: '/images/paper-plates.svg',
        alt: 'منتج',
        width: 500,
        height: 500,
        isPrimary: true,
      },
    ],
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
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const wishlistProducts: Product[] = [
  mockProduct({ id: 'prod-1', name: 'سماعات لاسلكية', slug: 'wireless-earbuds', brand: 'SoundPro', price: { amount: 349, currency: 'SAR', oldAmount: 499 }, discount: 30 }),
  mockProduct({ id: 'prod-2', name: 'ساعة ذكية رياضية', slug: 'sport-watch', brand: 'TechFit', price: { amount: 599, currency: 'SAR', oldAmount: 799 }, discount: 25 }),
  mockProduct({ id: 'prod-3', name: 'حقيبة يد أنيقة', slug: 'elegant-handbag', brand: 'VogueStyle', price: { amount: 449, currency: 'SAR', oldAmount: 649 }, discount: 31 }),
  mockProduct({ id: 'prod-4', name: 'نظارة شمسية فاخرة', slug: 'luxury-sunglasses', brand: 'VogueStyle', price: { amount: 299, currency: 'SAR', oldAmount: 429 }, discount: 30 }),
  mockProduct({ id: 'prod-5', name: 'ماوس لاسلكي احترافي', slug: 'pro-mouse', brand: 'TechGear', price: { amount: 189, currency: 'SAR', oldAmount: 259 }, discount: 27 }),
];

type SidebarTab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'coupons' | 'wallet' | 'invoices' | 'settings' | 'logout';

interface SidebarItem {
  id: SidebarTab;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'طلباتي', icon: <Package className="w-5 h-5" /> },
  { id: 'wishlist', label: 'قائمة المفضلة', icon: <Heart className="w-5 h-5" /> },
  { id: 'addresses', label: 'العنوانين', icon: <MapPin className="w-5 h-5" /> },
  { id: 'coupons', label: 'الكوبونات والعروض', icon: <Ticket className="w-5 h-5" /> },
  { id: 'wallet', label: 'المحفظة', icon: <Wallet className="w-5 h-5" /> },
  { id: 'invoices', label: 'فواتيري', icon: <FileText className="w-5 h-5" /> },
  { id: 'settings', label: 'إعدادات الحساب', icon: <Settings className="w-5 h-5" /> },
  { id: 'logout', label: 'تسجيل الخروج', icon: <LogOut className="w-5 h-5" /> },
];

const orderStatusVariant: Record<OrderStatus, 'success' | 'info' | 'warning'> = {
  delivered: 'success',
  in_transit: 'info',
  confirmed: 'warning',
};

function Breadcrumbs() {
  return (
    <nav aria-label="التنقل" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-gray-900 transition-colors">
            الرئيسية
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-300">/</li>
        <li className="text-gray-900 font-medium">حسابي</li>
      </ol>
    </nav>
  );
}

function SidebarNav({
  activeTab,
  onTabChange,
}: {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}) {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    if (item.id === 'logout') {
      useAuthStore.getState().logout();
      navigate('/');
      return;
    }
    onTabChange(item.id);
  };

  return (
    <Card className="hidden lg:block">
      <CardBody className="p-0">
        <nav aria-label="قائمة الحساب">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : item.id === 'logout'
                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </CardBody>
    </Card>
  );
}

function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}) {
  const navigate = useNavigate();

  const handleTabChange = (tabId: SidebarTab) => {
    if (tabId === 'logout') {
      useAuthStore.getState().logout();
      navigate('/');
      return;
    }
    onTabChange(tabId);
  };

  return (
    <div className="lg:hidden overflow-x-auto -mx-4 px-4 mb-6">
      <div className="flex gap-2 min-w-max">
        {sidebarItems.filter((item) => item.id !== 'logout').map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabChange(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UserInfoCard() {
  return (
    <Card>
      <CardBody className="p-6">
        <Flex align="center" gap={6}>
          <Avatar
            src={mockUser.avatarUrl}
            alt={mockUser.name}
            size="xl"
            fallback={mockUser.name.charAt(0)}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{mockUser.name}</h2>
            <p className="text-sm text-gray-500 mt-1 truncate">{mockUser.email}</p>
            <p className="text-sm text-gray-500">{mockUser.phone}</p>
            <Flex align="center" gap={4} className="mt-3 flex-wrap">
              <Badge variant="info" size="sm">
                عضو منذ يناير 2024
              </Badge>
              <Badge variant="success" size="sm">
                <Star className="w-3 h-3 mr-1 inline" />
                320 نقطة
              </Badge>
            </Flex>
          </div>
          <Link to="/account" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-1" />
              تعديل
            </Button>
          </Link>
        </Flex>
      </CardBody>
    </Card>
  );
}

function QuickActionsGrid() {
  const actions = [
    { icon: <Truck className="w-6 h-6" />, label: 'تتبع طلب', href: '/orders', color: 'bg-blue-100 text-blue-600' },
    { icon: <RotateCcw className="w-6 h-6" />, label: 'إعادة طلب', href: '/orders', color: 'bg-green-100 text-green-600' },
    { icon: <Receipt className="w-6 h-6" />, label: 'الفواتير', href: '/invoices', color: 'bg-purple-100 text-purple-600' },
    { icon: <ShoppingBag className="w-6 h-6" />, label: 'روابط سريعة', href: '/', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <Grid cols={2} sm={2} md={4} gap={4}>
      {actions.map((action) => (
        <Link key={action.label} to={action.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardBody className="p-4">
              <Flex direction="column" align="center" gap={3}>
                <div className={`p-3 rounded-full ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.label}
                </span>
              </Flex>
            </CardBody>
          </Card>
        </Link>
      ))}
    </Grid>
  );
}

function OrdersSection() {
  return (
    <Stack gap={6}>
      <Flex align="center" justify="between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">طلباتي الأخيرة</h3>
          <p className="text-sm text-gray-500 mt-1">{mockOrders.length} طلبات</p>
        </div>
        <Link to="/orders">
          <Button variant="ghost" size="sm">
            عرض كل الطلبات
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </Flex>

      <Stack gap={3}>
        {mockOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardBody className="p-4">
              <Flex align="center" justify="between" className="flex-wrap gap-3">
                <Flex align="center" gap={4}>
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                  </div>
                </Flex>

                <Flex align="center" gap={4} className="flex-wrap">
                  <Badge variant={orderStatusVariant[order.status]} size="sm">
                    {order.statusLabel}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {order.itemCount} {order.itemCount === 1 ? 'منتج' : 'منتجات'}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                  <Link to="/orders">
                    <Button variant="outline" size="xs">
                      التفاصيل
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

function AddressBookSection() {
  const addressIcon = (label: string) => {
    if (label === 'المنزل') return <Home className="w-5 h-5" />;
    if (label === 'العمل') return <Briefcase className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  return (
    <Stack gap={6}>
      <Flex align="center" justify="between">
        <div>
              <h3 className="text-lg font-bold text-gray-900">إدارة العناوين</h3>
          <p className="text-sm text-gray-500 mt-1">{mockAddresses.length} عناوين محفوظة</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          إضافة عنوان جديد
        </Button>
      </Flex>

      <Grid cols={1} md={2} gap={4}>
        {mockAddresses.map((address) => (
          <Card key={address.id} className="hover:shadow-md transition-shadow relative">
            {address.isDefault && (
              <div className="absolute top-3 left-3">
                <Badge variant="success" size="sm">الافتراضي</Badge>
              </div>
            )}
            <CardBody className="p-5">
              <Flex align="start" gap={3}>
                <div className="p-2.5 bg-gray-100 rounded-lg mt-0.5">
                  {addressIcon(address.label)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900">{address.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                  <p className="text-sm text-gray-600">{address.city}، {address.country} {address.postalCode}</p>
                  <p className="text-xs text-gray-500 mt-2">{address.phone}</p>
                </div>
              </Flex>
              <Divider className="my-4" />
              <Flex align="center" gap={2} justify="end">
                <Button variant="ghost" size="xs">
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  تعديل
                </Button>
                <Button variant="ghost" size="xs" className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  حذف
                </Button>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

function WishlistSection() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product: Product) => {
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
  };

  return (
    <Stack gap={6}>
      <Flex align="center" justify="between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">قائمة المفضلة</h3>
          <p className="text-sm text-gray-500 mt-1">{wishlistProducts.length} منتجات</p>
        </div>
        <Link to="/wishlist">
          <Button variant="ghost" size="sm">
            عرض الكل
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </Flex>

      <div className="overflow-x-auto -mx-4 px-4">
        <Flex gap={4} className="min-w-max pb-2">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="w-48 flex-shrink-0 hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <Badge variant="danger" className="absolute top-2 right-2" size="sm">
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              <CardBody className="p-3">
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price.amount)}
                  </span>
                  {product.price.oldAmount && product.price.oldAmount > product.price.amount && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.price.oldAmount)}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  أضف إلى السلة
                </Button>
              </CardBody>
            </Card>
          ))}
        </Flex>
      </div>
    </Stack>
  );
}

function EmptyTabContent({ title }: { title: string }) {
  return (
    <EmptyState
      icon={<Package className="w-12 h-12" />}
      title={title}
      description="سيتم تفعيل هذه الميزة قريباً"
      action={
        <Link to="/">
          <Button variant="primary">العودة إلى الصفحة الرئيسية</Button>
        </Link>
      }
    />
  );
}

function MainContent({ activeTab }: { activeTab: SidebarTab }) {
  switch (activeTab) {
    case 'orders':
      return <OrdersSection />;
    case 'addresses':
      return <AddressBookSection />;
    case 'wishlist':
      return <WishlistSection />;
    case 'dashboard':
      return (
        <Stack gap={8}>
          <UserInfoCard />
          <QuickActionsGrid />
          <OrdersSection />
        </Stack>
      );
    case 'coupons':
      return <EmptyTabContent title="الكوبونات والعروض" />;
    case 'wallet':
      return <EmptyTabContent title="المحفظة" />;
    case 'invoices':
      return <EmptyTabContent title="فواتيري" />;
    case 'settings':
      return <EmptyTabContent title="إعدادات الحساب" />;
    default:
      return <EmptyTabContent title="لوحة التحكم" />;
  }
}

export function ProfilePage() {
  const user = useAuthStore(selectUser);
  const [activeTab, setActiveTab] = useState<SidebarTab>('orders');

  if (!user) {
    return (
      <Section>
        <Container>
          <EmptyState
            icon={<User className="w-12 h-12" />}
            title="يرجى تسجيل الدخول"
            description="تحتاج إلى تسجيل الدخول للوصول إلى حسابك الشخصي"
            action={
              <Link to="/auth/login">
                <Button variant="primary">تسجيل الدخول</Button>
              </Link>
            }
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Breadcrumbs />

        <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <Grid cols={1} lg={4} gap={8}>
          <div className="lg:col-span-1">
            <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'dashboard' ? (
              <MainContent activeTab={activeTab} />
            ) : (
              <Stack gap={6}>
                {activeTab === 'orders' && <UserInfoCard />}
                <Card>
                  <CardBody className="p-6">
                    <MainContent activeTab={activeTab} />
                  </CardBody>
                </Card>
              </Stack>
            )}
          </div>
        </Grid>
      </Container>
    </Section>
  );
}

export default ProfilePage;
