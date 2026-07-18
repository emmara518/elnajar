import { Link } from 'react-router-dom';
import { Container, Section, Stack, Card, CardBody, Button, Divider } from '@/design-system';
import { Truck, RotateCcw, Phone, HelpCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../layouts/Breadcrumbs';

const infoContent: Record<string, { icon: React.ReactNode; title: string; description: string; sections: { heading: string; items: string[] }[] }> = {
  shipping: {
    icon: <Truck className="w-10 h-10 text-blue-600" />,
    title: 'الشحن والتوصيل',
    description: 'نوفر خدمة توصيل سريعة وآمنة لجميع مناطق المملكة العربية السعودية.',
    sections: [
      {
        heading: 'مدة التوصيل',
        items: [
          'الرياض وجدة: ١-٢ أيام عمل',
          'المدن الرئيسية: ٢-٣ أيام عمل',
          'المناطق الأخرى: ٣-٥ أيام عمل',
        ],
      },
      {
        heading: 'رسوم الشحن',
        items: [
          'شحن مجاني للطلبات فوق ٢٠٠ ريال',
          'رسوم الشحن للطلبات الأقل: ١٥ ريال',
          'التوصيل السريع متاح مقابل ٢٥ ريال إضافية',
        ],
      },
      {
        heading: 'ملاحظات',
        items: [
          'الطلبات تُعالج خلال ٢٤ ساعة من تاريخ الطلب',
          'يُمكن تتبع الطلب من صفحة الحساب',
          'التسليم من الباب إلى الباب',
        ],
      },
    ],
  },
  returns: {
    icon: <RotateCcw className="w-10 h-10 text-blue-600" />,
    title: 'الإرجاع والاستبدال',
    description: 'نضمن لك حق إرجاع أو استبدال المنتجات خلال ١٤ يوم من تاريخ الاستلام.',
    sections: [
      {
        heading: 'سياسة الإرجاع',
        items: [
          'يُمكن إرجاع المنتجات خلال ١٤ يومًا من تاريخ الاستلام',
          'المنتج يجب أن يكون في حالته الأصلية وفي التغليف الأصلي',
          'المنتجات المفتوحة أو المستخدمة لا يمكن إرجاعها',
        ],
      },
      {
        heading: 'كيفية الإرجاع',
        items: [
          'تواصل مع خدمة العملاء عبر صفحة اتصل بنا',
          'اختر المنتج المراد إرجاعه وسبب الإرجاع',
          'سيتم جمع المنتج من عنوانك',
          'سيتم استرداد المبلغ خلال ٥-٧ أيام عمل',
        ],
      },
      {
        heading: 'الاستبدال',
        items: [
          'يُمكن استبدال المنتج بآخر بديل',
          'الفرق في السعر يُدفع أو يُسترد',
          'التوصيل المجاني للاستبدال',
        ],
      },
    ],
  },
  contact: {
    icon: <Phone className="w-10 h-10 text-blue-600" />,
    title: 'اتصل بنا',
    description: 'فريق خدمة العملاء جاهز لمساعدتك. تواصل معنا عبر أي من القنوات التالية.',
    sections: [
      {
        heading: 'قنوات التواصل',
        items: [
          'البريد الإلكتروني: support@tokyostore.sa',
          'الهاتف: ٩٢٠٠٠١٢٣٤',
          'واتساب: ٩٦٦٥٠٠٠١٢٣٤',
        ],
      },
      {
        heading: 'ساعات العمل',
        items: [
          'الأحد إلى الخميس: ٩ صباحًا - ٦ مساءً',
          'الجمعة: مغلق',
          'السبت: ١٠ صباحًا - ٤ مساءً',
        ],
      },
      {
        heading: 'الموقع',
        items: [
          'الرياض، المملكة العربية السعودية',
          'ص.ب: ١٢٣٤٥',
        ],
      },
    ],
  },
  faq: {
    icon: <HelpCircle className="w-10 h-10 text-blue-600" />,
    title: 'الأسئلة الشائعة',
    description: 'إجابات على أكثر الأسئلة شيوعًا حول خدماتنا ومنتجاتنا.',
    sections: [
      {
        heading: 'الطلبات والدفع',
        items: [
          'يُمكن الدفع عبر: مدى، فيزا، ماستركارد، أبل باي، أو الدفع عند الاستلام',
          'يمكن إلغاء الطلب خلال ساعة من تاريخه إذا لم يكن قد شُحن بعد',
          'جميع الأسعار شاملة ضريبة القيمة المضافة ١٥٪',
        ],
      },
      {
        heading: 'المنتجات',
        items: [
          'جميع منتجاتنا أصلية ومدعومة بضمان رسمي',
          'الصور توضيحية وقد تختلف قليلاً عن المنتج الفعلي',
          'أحجام ومواصفات كل منتج موضحة في صفحة تفاصيل المنتج',
        ],
      },
      {
        heading: 'الحساب والبيانات',
        items: [
          'يُمكن إنشاء حساب bằng البريد الإلكتروني أو رقم الجوال',
          'بياناتك الحماية كاملة وفق سياسة الخصوصية',
          'يُمكن حذف الحساب في أي من خلال صفحة إعدادات الحساب',
        ],
      },
    ],
  },
};

export function InfoPage({ pageKey }: { pageKey: string }) {
  const content = infoContent[pageKey];
  if (!content) return null;

  return (
    <>
      <Container>
        <Breadcrumbs />
      </Container>
      <Section padding="lg">
        <Container>
          <Stack gap="lg" className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                {content.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
              <p className="text-gray-500">{content.description}</p>
            </div>

            {content.sections.map((section, idx) => (
              <div key={idx}>
                {idx > 0 && <Divider className="my-6" />}
                <Card>
                  <CardBody>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.heading}</h2>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
            ))}

            <div className="text-center pt-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowRight className="w-4 h-4" />
                  العودة إلى الرئيسية
                </Button>
              </Link>
            </div>
          </Stack>
        </Container>
      </Section>
    </>
  );
}

export default InfoPage;
