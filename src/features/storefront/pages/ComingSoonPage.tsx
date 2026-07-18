import { useState } from 'react';
import { Container, Section, Stack, Flex, Card, CardBody, Button, Input, Badge, Divider } from '@/design-system';
import { Bell, Mail, Send, Clock } from 'lucide-react';
import { newsletterSchema } from '../schemas';

export function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    setError(null);
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'بريد إلكتروني غير صحيح');
      return;
    }
    setIsLoading(true);
    setTimeout(() => { setIsSubscribed(true); setEmail(''); setIsLoading(false); }, 1500);
  };

  return (
    <Section padding="lg" className="min-h-[70vh] flex items-center">
      <Container>
        <Card className="max-w-2xl mx-auto">
          <CardBody className="text-center py-12 md:py-16">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>

            <Badge variant="info" className="mb-4">قريباً</Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              شيء رائع قادم!
            </h1>

            <p className="text-gray-500 max-w-md mx-auto mb-4">
              نحن نعمل على إطلاق متجرنا الجديد. كن أول من يعلم عند الإطلاق واحصل على خصم خاص ٢٠٪.
            </p>

            <Divider className="max-w-xs mx-auto my-6" />

            {isSubscribed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto">
                <Flex align="center" gap={3} justify="center">
                  <Bell className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    تم الاشتراك بنجاح! سنخبرك عند الإطلاق.
                  </span>
                </Flex>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <Stack gap={3}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="بريدك الإلكتروني"
                    error={error ?? undefined}
                    disabled={isLoading}
                    prefix={<Mail className="w-4 h-4" />}
                    aria-label="البريد الإلكتروني"
                  />
                  <Button type="submit" isLoading={isLoading} disabled={isLoading} size="lg" fullWidth>
                    <Send className="w-4 h-4" />
                    {isLoading ? 'جاري الاشتراك...' : 'أخبرني عند الإطلاق'}
                  </Button>
                </Stack>
              </form>
            )}

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">+١٠٠٠</p>
                <p className="text-xs text-gray-500">منتج</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">+٥٠</p>
                <p className="text-xs text-gray-500">ماركة</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                <p className="text-2xl font-bold text-gray-900">خضـم ٢٠٪</p>
                <p className="text-xs text-gray-500">لأول المشتركين</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </Section>
  );
}

export default ComingSoonPage;
