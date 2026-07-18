import { Link } from 'react-router-dom';
import { Button } from '@/design-system';
import { Container } from '@/design-system';
import { Stack } from '@/design-system';

function UnauthorizedPage() {
  return (
    <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
      <Stack gap="6" className="w-full text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="text-2xl font-semibold">غير مصرح بالوصول</h2>
        <p className="text-gray-600">
          ليس لديك الصلاحية المطلوبة للوصول إلى هذه الصفحة
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="primary">العودة للرئيسية</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline">تسجيل الدخول</Button>
          </Link>
        </div>
      </Stack>
    </Container>
  );
}

export default UnauthorizedPage;
export { UnauthorizedPage };
