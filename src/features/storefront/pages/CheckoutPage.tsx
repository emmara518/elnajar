import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, CreditCard, Truck, Check, ChevronLeft,
  MapPin, Phone, Mail, User, Shield, Clock, ShoppingBag, Banknote,
} from 'lucide-react';
import { Container, Section, Stack, Grid, Flex, Card, CardBody, CardHeader, Button, Badge, Divider, Input, Textarea } from '@/design-system';
import { useCartStore } from '../stores/cart.store';
import { formatPrice } from '../utils';

const steps = [
  { id: 1, label: ' سلة التسوق' },
  { id: 2, label: 'بيانات الشحن' },
  { id: 3, label: 'طريقة الدفع' },
  { id: 4, label: 'تأكيد الطلب' },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, summary, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingInfo, setShippingInfo] = useState({
    name: 'أحمد محمد',
    phone: '0512345678',
    email: 'ahmed@example.com',
    city: 'الرياض',
    district: 'حي النزهة',
    address: 'شارع الملك فهد، بجوار مول الرياض',
    notes: '',
  });

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      setIsSuccess(true);
      setCurrentStep(4);
    }, 2000);
  };

  if (isSuccess) {
    const orderNumber = 'ORD-25051578';
    return (
      <Section padding="lg" className="min-h-[70vh] flex items-center">
        <Container maxWidth="sm">
          <div className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <Badge variant="success" className="mb-4">تم بنجاح</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">تم تأكيد طلبك بنجاح!</h1>
            <p className="text-gray-500 mb-1">رقم الطلب: <span className="font-bold text-gray-900">{orderNumber}</span></p>
            <p className="text-gray-500 mb-8">سيتم التواصل معك لتأكيد التوصيل خلال 24 ساعة.</p>
            <Card className="mb-8">
              <CardBody className="space-y-4">
                <Flex align="center" gap={3}>
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">العنوان</p>
                    <p className="text-xs text-gray-500">{shippingInfo.address}، {shippingInfo.district}، {shippingInfo.city}</p>
                  </div>
                </Flex>
                <Flex align="center" gap={3}>
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">طريقة الدفع</p>
                    <p className="text-xs text-gray-500">{paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</p>
                  </div>
                </Flex>
                <Flex align="center" gap={3}>
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">وقت التوصيل المتوقع</p>
                    <p className="text-xs text-gray-500">3 - 5 أيام عمل</p>
                  </div>
                </Flex>
              </CardBody>
            </Card>
            <Stack gap={3}>
              <Button variant="primary" size="lg" fullWidth onClick={() => { navigate('/orders'); }}>
                تتبع الطلب
              </Button>
              <Link to="/" className="block text-center text-sm text-blue-600 hover:text-blue-700">
                العودة للرئيسية
              </Link>
            </Stack>
          </div>
        </Container>
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section padding="lg" className="min-h-[70vh] flex items-center">
        <Container maxWidth="sm">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">سلة التسوق فارغة</h1>
            <p className="text-gray-500 mb-6">أضف منتجات إلى السلة لبدء عملية الشراء.</p>
            <Link to="/products">
              <Button variant="primary" size="lg">تصفح المنتجات</Button>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Container>
        <div className="py-4">
          <nav aria-label="مسار التنقل">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-gray-700">الرئيسية</Link></li>
              <li className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                <Link to="/cart" className="hover:text-gray-700">سلة التسوق</Link>
              </li>
              <li className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                <span className="text-gray-900 font-medium">إتمام الطلب</span>
              </li>
            </ol>
          </nav>
        </div>
      </Container>

      <Section padding="lg" className="pt-0">
        <Container>
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep > step.id ? 'bg-blue-600 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <Grid cols={{ mobile: 1, lg: 3 }} gap="lg">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">مراجعة الطلب</h2>
                <Stack gap={3}>
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardBody>
                        <Flex gap={4} align="center">
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">الكمية: {item.quantity} × {formatPrice(item.price.amount)}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{formatPrice(item.price.amount * item.quantity)}</p>
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
                  <CardBody className="space-y-3">
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(summary.subtotal)}</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>الشحن</span>
                      <span className="text-green-600">مجاني</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>الضريبة</span>
                      <span>{formatPrice(summary.tax)}</span>
                    </Flex>
                    {summary.discount > 0 && (
                      <Flex justify="between" className="text-sm text-green-600">
                        <span>خصم</span>
                        <span>-{formatPrice(summary.discount)}</span>
                      </Flex>
                    )}
                    <Divider />
                    <Flex justify="between" className="text-base font-bold text-gray-900">
                      <span>الإجمالي</span>
                      <span>{formatPrice(summary.total)}</span>
                    </Flex>
                    <Button variant="primary" size="lg" fullWidth onClick={() => { setCurrentStep(2); }}>
                      متابعة
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </Grid>
          )}

          {currentStep === 2 && (
            <Grid cols={{ mobile: 1, lg: 3 }} gap="lg">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">بيانات الشحن</h2>
                  </CardHeader>
                  <CardBody>
                    <Stack gap={4}>
                      <Grid cols={{ mobile: 1, sm: 2 }} gap={4}>
                        <Input
                          label="الاسم الكامل"
                          value={shippingInfo.name}
                          onChange={(e) => { handleShippingChange('name', e.target.value); }}
                          prefix={<User className="w-4 h-4" />}
                        />
                        <Input
                          label="رقم الهاتف"
                          value={shippingInfo.phone}
                          onChange={(e) => { handleShippingChange('phone', e.target.value); }}
                          prefix={<Phone className="w-4 h-4" />}
                        />
                      </Grid>
                      <Input
                        label="البريد الإلكتروني"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => { handleShippingChange('email', e.target.value); }}
                        prefix={<Mail className="w-4 h-4" />}
                      />
                      <Grid cols={{ mobile: 1, sm: 2 }} gap={4}>
                        <Input
                          label="المدينة"
                          value={shippingInfo.city}
                          onChange={(e) => { handleShippingChange('city', e.target.value); }}
                          prefix={<MapPin className="w-4 h-4" />}
                        />
                        <Input
                          label="الحي"
                          value={shippingInfo.district}
                          onChange={(e) => { handleShippingChange('district', e.target.value); }}
                        />
                      </Grid>
                      <Input
                        label="العنوان بالتفصيل"
                        value={shippingInfo.address}
                        onChange={(e) => { handleShippingChange('address', e.target.value); }}
                      />
                      <Textarea
                        label="ملاحظات (اختياري)"
                        value={shippingInfo.notes}
                        onChange={(e) => { handleShippingChange('notes', e.target.value); }}
                        placeholder="أي ملاحظات إضافية للتوصيل"
                      />
                    </Stack>
                  </CardBody>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">ملخص الطلب</h2>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(summary.subtotal)}</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-green-600">
                      <span>الشحن</span>
                      <span>مجاني</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>ضريبة القيمة المضافة (15%)</span>
                      <span>{formatPrice(summary.tax)}</span>
                    </Flex>
                    {summary.discount > 0 && (
                      <Flex justify="between" className="text-sm text-red-500">
                        <span>الخصم</span>
                        <span>-{formatPrice(summary.discount)}</span>
                      </Flex>
                    )}
                    <Divider />
                    <Flex justify="between" className="text-base font-bold text-gray-900">
                      <span>الإجمالي</span>
                      <span>{formatPrice(summary.total)}</span>
                    </Flex>
                    <Divider />
                    <Button variant="primary" size="lg" fullWidth onClick={() => { setCurrentStep(3); }}>
                      متابعة إلى الدفع
                    </Button>
                    <Button variant="outline" size="sm" fullWidth onClick={() => { setCurrentStep(1); }}>
                      السابق
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </Grid>
          )}

          {currentStep === 3 && (
            <Grid cols={{ mobile: 1, lg: 3 }} gap="lg">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">طريقة الدفع</h2>
                  </CardHeader>
                  <CardBody>
                    <Stack gap={3}>
                      {[
                        { id: 'cod', label: 'الدفع عند الاستلام (نقداً)', description: 'ادفع نقداً عند استلام الطلب', icon: <Banknote className="w-5 h-5" /> },
                        { id: 'card', label: 'بطاقة ائتمان / خصم مباشر', description: 'فيزا، ماستركارد، مدى', icon: <CreditCard className="w-5 h-5" /> },
                        { id: 'mada', label: 'مدى', description: 'الدفع عبر بطاقة مدى البنكية', icon: <CreditCard className="w-5 h-5" /> },
                        { id: 'applepay', label: 'Apple Pay', description: 'الدفع عبر Apple Pay', icon: <CreditCard className="w-5 h-5" /> },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => { setPaymentMethod(method.id); }}
                          className={`w-full text-right p-4 rounded-lg border-2 transition-colors ${
                            paymentMethod === method.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Flex align="center" gap={3}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'
                            }`}>
                              {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                            </div>
                            <span className="text-gray-500">{method.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{method.label}</p>
                              <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                          </Flex>
                        </button>
                      ))}
                    </Stack>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <Flex align="center" gap={3}>
                        <Shield className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-blue-700">معلومات الدفع الخاصة بك آمنة ومشفرة بالكامل.</p>
                      </Flex>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">ملخص الطلب</h2>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(summary.subtotal)}</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-green-600">
                      <span>الشحن</span>
                      <span>مجاني</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>ضريبة القيمة المضافة (15%)</span>
                      <span>{formatPrice(summary.tax)}</span>
                    </Flex>
                    {summary.discount > 0 && (
                      <Flex justify="between" className="text-sm text-red-500">
                        <span>الخصم</span>
                        <span>-{formatPrice(summary.discount)}</span>
                      </Flex>
                    )}
                    <Divider />
                    <Flex justify="between" className="text-base font-bold text-gray-900">
                      <span>الإجمالي</span>
                      <span>{formatPrice(summary.total)}</span>
                    </Flex>
                    <Divider />
                    <Button variant="primary" size="lg" fullWidth onClick={() => { setCurrentStep(4); }}>
                      مراجعة الطلب
                    </Button>
                    <Button variant="outline" size="sm" fullWidth onClick={() => { setCurrentStep(2); }}>
                      السابق
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </Grid>
          )}

          {currentStep === 4 && (
            <Grid cols={{ mobile: 1, lg: 3 }} gap="lg">
              <div className="lg:col-span-2">
                <Stack gap={4}>
                  <Card>
                    <CardHeader>
                      <Flex align="center" gap={2}>
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">عنوان الشحن</h2>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <p className="text-sm text-gray-900">{shippingInfo.name}</p>
                      <p className="text-sm text-gray-500">{shippingInfo.address}، {shippingInfo.district}، {shippingInfo.city}</p>
                      <p className="text-sm text-gray-500">{shippingInfo.phone}</p>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Flex align="center" gap={2}>
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">طريقة الدفع</h2>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <p className="text-sm text-gray-900">
                        {paymentMethod === 'cod' ? 'الدفع عند الاستلام (نقداً)' :
                         paymentMethod === 'card' ? 'بطاقة ائتمان / خصم مباشر' :
                         paymentMethod === 'mada' ? 'مدى' : 'Apple Pay'}
                      </p>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Flex align="center" gap={2}>
                        <Package className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">المنتجات</h2>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack gap={3}>
                        {items.map((item) => (
                          <Flex key={item.id} justify="between" align="center">
                            <Flex gap={3} align="center">
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                              </div>
                            </Flex>
                            <p className="text-sm font-medium text-gray-900">{formatPrice(item.price.amount * item.quantity)}</p>
                          </Flex>
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                </Stack>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900">إجمالي الطلب</h2>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(summary.subtotal)}</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-green-600">
                      <span>الشحن</span>
                      <span>مجاني</span>
                    </Flex>
                    <Flex justify="between" className="text-sm text-gray-600">
                      <span>الضريبة</span>
                      <span>{formatPrice(summary.tax)}</span>
                    </Flex>
                    {summary.discount > 0 && (
                      <Flex justify="between" className="text-sm text-green-600">
                        <span>خصم</span>
                        <span>-{formatPrice(summary.discount)}</span>
                      </Flex>
                    )}
                    <Divider />
                    <Flex justify="between" className="text-lg font-bold text-gray-900">
                      <span>الإجمالي</span>
                      <span>{formatPrice(summary.total)}</span>
                    </Flex>
                    <Divider />
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      onClick={handlePlaceOrder}
                    >
                      {isProcessing ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
                    </Button>
                    <Button variant="outline" size="sm" fullWidth onClick={() => { setCurrentStep(3); }}>
                      السابق
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      بالنقر على "تأكيد الطلب" فإنك توافق على شروط وأحكام المتجر
                    </p>
                  </CardBody>
                </Card>
              </div>
            </Grid>
          )}
        </Container>
      </Section>
    </>
  );
}

export default CheckoutPage;
