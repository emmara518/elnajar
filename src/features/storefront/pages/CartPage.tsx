import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, Tag } from 'lucide-react';
import { Container, Section, Stack, Grid, Flex, Card, CardBody, CardHeader, Divider, Button, Input, EmptyState } from '@/design-system';
import { useCartStore } from '../stores/cart.store';
import { formatPrice } from '../utils';

export function CartPage() {
  const { items, summary, couponCode, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Container>
          <div className="py-3" />
        </Container>
        <Section padding="lg">
          <Container>
            <EmptyState
              icon={<ShoppingCart className="w-12 h-12" />}
              title="سلة التسوق فارغة"
              description="لم تقم بإضافة أي منتجات إلى السلة بعد. تصفح المنتجات وأضف ما تريد."
              action={
                <Link to="/products">
                  <Button variant="primary">تصفح المنتجات</Button>
                </Link>
              }
            />
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Container>
        <div className="py-3">
          <nav aria-label="مسار التنقل" dir="rtl">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-gray-700">الرئيسية</Link></li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-300 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium" aria-current="page">سلة التسوق</span>
              </li>
            </ol>
          </nav>
        </div>
      </Container>
      <Section padding="lg">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">سلة التسوق</h1>
          <Grid cols={{ mobile: 1, lg: 3 }} gap="lg">
            <div className="lg:col-span-2">
              <Stack gap={3}>
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardBody>
                      <Flex gap={4} className="items-start">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Flex align="start" justify="between" wrap className="gap-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price.amount)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { removeItem(item.id); }}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="إزالة المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Flex>
                          <Flex align="center" justify="between" className="mt-3">
                            <Flex align="center" gap={1}>
                              <button
                                type="button"
                                onClick={() => { updateQuantity(item.id, item.quantity - 1); }}
                                disabled={item.quantity <= 1}
                                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => { updateQuantity(item.id, item.quantity + 1); }}
                                disabled={item.quantity >= item.maxQuantity}
                                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </Flex>
                            <span className="font-bold text-gray-900">
                              {formatPrice(item.price.amount * item.quantity)}
                            </span>
                          </Flex>
                        </div>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">ملخص الطلب</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Flex justify="between" className="text-sm text-gray-600">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </Flex>
                  <Flex justify="between" className="text-sm text-gray-600">
                    <span>الشحن</span>
                    <span>{summary.shipping === 0 ? 'مجاني' : formatPrice(summary.shipping)}</span>
                  </Flex>
                  <Flex justify="between" className="text-sm text-gray-600">
                    <span>الضريبة</span>
                    <span>{formatPrice(summary.tax)}</span>
                  </Flex>
                  {couponCode && (
                    <Flex justify="between" className="text-sm text-green-600">
                      <span>خصم ({couponCode})</span>
                      <Flex align="center" gap={2}>
                        <span>-{formatPrice(summary.discount)}</span>
                        <button type="button" onClick={removeCoupon} className="text-gray-400 hover:text-red-500" aria-label="إزالة الكود">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Flex>
                    </Flex>
                  )}
                  <Divider />
                  <Flex justify="between" className="text-base font-bold text-gray-900">
                    <span>الإجمالي</span>
                    <span>{formatPrice(summary.total)}</span>
                  </Flex>

                  <Divider />

                  <Stack gap={2}>
                    <Flex gap={2}>
                      <Input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); }}
                        placeholder="كود الخصم"
                        prefix={<Tag className="w-4 h-4" />}
                        aria-label="كود الخصم"
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={!couponInput.trim()}>
                        تطبيق
                      </Button>
                    </Flex>
                  </Stack>

                  <Link to="/checkout" className="block">
                    <Button variant="primary" size="lg" fullWidth>
                      إتمام الطلب
                    </Button>
                  </Link>

                  <Link to="/products" className="block text-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    متابعة التسوق
                  </Link>
                </CardBody>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}

export default CartPage;
