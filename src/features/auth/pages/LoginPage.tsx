import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas';
import type { LoginFormData } from '../schemas';
import { Button, Input, Card, CardBody, Container, Stack } from '@/design-system';
import { useAuthStore, selectIsAuthenticated } from '../stores/auth.store';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    void navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof LoginFormData;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      useAuthStore.getState().login({
        id: 'user-demo-1',
        email: formData.email,
        name: 'أحمد محمد',
        role: 'owner',
        roleId: 'role-1',
        isEmailVerified: true,
        isActive: true,
        permissions: [],
        lastLoginAt: new Date().toISOString(),
      });
      void navigate(from, { replace: true });
    }, 1200);
  };

  const handleChange = (field: keyof LoginFormData, value: string | boolean): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
      <Stack gap="6" className="w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="mt-2 text-gray-600">أهلاً بك في متجر TOKYO</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap="4">
                {generalError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {generalError}
                  </div>
                )}

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={formData.email}
                  onChange={(e) => { handleChange('email', e.target.value); }}
                  error={errors.email}
                  placeholder="أدخل البريد الإلكتروني"
                  autoComplete="email"
                  autoFocus
                  required
                />

                <div>
                  <Input
                    label="كلمة المرور"
                    type="password"
                    value={formData.password}
                    onChange={(e) => { handleChange('password', e.target.value); }}
                    error={errors.password}
                    placeholder="أدخل كلمة المرور"
                    autoComplete="current-password"
                    required
                  />
                  <div className="mt-1 text-left">
                    <Link to="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-800">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => { handleChange('rememberMe', e.target.checked); }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  تذكرني
                </label>

                <Button type="submit" fullWidth disabled={isSubmitting} isLoading={isSubmitting}>
                  {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  ليس لديك حساب؟{' '}
                  <Link to="/auth/reset-password" className="text-blue-600 hover:text-blue-800 font-medium">
                    إنشاء حساب
                  </Link>
                </div>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}

export default LoginPage;
export { LoginPage };
