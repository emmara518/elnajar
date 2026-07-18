import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { acceptInviteSchema } from '../schemas';
import type { AcceptInviteFormData } from '../schemas';
import { Button } from '@/design-system';
import { Input } from '@/design-system';
import { Card, CardBody } from '@/design-system';
import { Container } from '@/design-system';
import { Stack } from '@/design-system';
import { DEFAULT_REDIRECTS } from '../constants';

function AcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [formData, setFormData] = useState<AcceptInviteFormData>({
    token,
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AcceptInviteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token && !formData.token) {
      setFormData((prev) => ({ ...prev, token }));
    }
  }, [token, formData.token]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = acceptInviteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AcceptInviteFormData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof AcceptInviteFormData;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1000);
  };

  const handleChange = (field: keyof AcceptInviteFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    void navigate(DEFAULT_REDIRECTS.AFTER_ACCEPT_INVITE, { replace: true });
    return null;
  }

  if (!token) {
    return (
      <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
        <Card>
          <CardBody>
            <Stack gap="4" className="text-center">
              <div className="rounded-full bg-red-50 p-3 mx-auto w-fit">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">رمز دعوة غير صالح</h2>
              <p className="text-gray-600">لم يتم العثور على رمز دعوة صالح. يرجى التحقق من رابط الدعوة</p>
                  <Button variant="outline" onClick={() => { void navigate(DEFAULT_REDIRECTS.AFTER_LOGIN); }}>
                العودة لتسجيل الدخول
              </Button>
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
          <h1 className="text-2xl font-bold">قبول الدعوة</h1>
          <p className="mt-2 text-gray-600">أنشئ حسابك للانضمام إلى المنشأة</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap="4">
                {submitError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {submitError}
                  </div>
                )}

                <Input
                  label="الاسم"
                  type="text"
                  value={formData.name}
                  onChange={(e) => { handleChange('name', e.target.value); }}
                  error={errors.name}
                  placeholder="أدخل اسمك الكامل"
                  autoFocus
                  required
                />

                <Input
                  label="كلمة المرور"
                  type="password"
                  value={formData.password}
                  onChange={(e) => { handleChange('password', e.target.value); }}
                  error={errors.password}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="new-password"
                  required
                />

                <Input
                  label="تأكيد كلمة المرور"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => { handleChange('confirmPassword', e.target.value); }}
                  error={errors.confirmPassword}
                  placeholder="أعد إدخال كلمة المرور"
                  autoComplete="new-password"
                  required
                />

                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}

export default AcceptInvitePage;
export { AcceptInvitePage };
