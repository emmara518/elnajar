import { Flex, Card, CardBody, CardHeader, Divider } from '@/design-system';
import { formatPrice } from '../utils';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingLabel?: string;
  children?: React.ReactNode;
}

export function OrderSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  shippingLabel = 'مجاني',
  children,
}: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">ملخص الطلب</h2>
      </CardHeader>
      <CardBody className="space-y-3">
        <Flex justify="between" className="text-sm text-gray-600">
          <span>المجموع الفرعي</span>
          <span>{formatPrice(subtotal)}</span>
        </Flex>
        <Flex justify="between" className="text-sm text-green-600">
          <span>الشحن</span>
          <span>{shipping === 0 ? shippingLabel : formatPrice(shipping)}</span>
        </Flex>
        <Flex justify="between" className="text-sm text-gray-600">
          <span>ضريبة القيمة المضافة (15%)</span>
          <span>{formatPrice(tax)}</span>
        </Flex>
        {discount > 0 && (
          <Flex justify="between" className="text-sm text-red-500">
            <span>الخصم</span>
            <span>-{formatPrice(discount)}</span>
          </Flex>
        )}
        <Divider />
        <Flex justify="between" className="text-base font-bold text-gray-900">
          <span>الإجمالي</span>
          <span>{formatPrice(total)}</span>
        </Flex>
        {children}
      </CardBody>
    </Card>
  );
}
