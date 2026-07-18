import { Link } from 'react-router-dom';
import { Container, Section, Stack, Button } from '@/design-system';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <Section padding="lg" className="min-h-[60vh] flex items-center">
      <Container>
        <Stack align="center" gap="md" className="text-center">
          <div className="text-8xl font-bold text-gray-200 select-none">404</div>
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">الصفحة غير موجودة</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. قد يكون الرابط غير صحيح أو الصفحة قد تم حذفها.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home className="w-4 h-4" />
              العودة إلى الرئيسية
            </Button>
          </Link>
        </Stack>
      </Container>
    </Section>
  );
}

export default NotFoundPage;
