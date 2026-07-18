import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPasswordSchema } from '../schemas';
import { Button } from '@/design-system';
import { Input } from '@/design-system';
import { Card, CardBody } from '@/design-system';
import { Container } from '@/design-system';
import { Stack } from '@/design-system';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = resetPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'بيانات غير صحيحة');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
        <Card>
          <CardBody>
            <Stack gap="4" className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">تم إرسال رابط إعادة التعيين</h2>
              <p className="text-gray-600">
                إذا كان البريد الإلكتروني مسجلاً في النظام، ستتلقى رابطاً لإعادة تعيين كلمة المرور
              </p>
              <Link to="/auth/login" className="text-sm text-blue-600 hover:text-blue-800">
                العودة لتسجيل الدخول
              </Link>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
      <Stack gap="6" className="w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">إعادة تعيين كلمة المرور</h1>
          <p className="mt-2 text-gray-600">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap="4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {error}
                  </div>
                )}

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="أدخل البريد الإلكتروني"
                  autoComplete="email"
                  autoFocus
                  required
                />

                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>

        <div className="text-center">
          <Link to="/auth/login" className="text-sm text-blue-600 hover:text-blue-800">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </Stack>
    </Container>
  );
}

export default ResetPasswordPage;
export { ResetPasswordPage };
