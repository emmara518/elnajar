import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '@/design-system';
import { Container } from '@/design-system';
import { Stack } from '@/design-system';

function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      void navigate('/', { replace: true });
    };
    void performLogout();
  }, [logout, navigate]);

  return (
    <Container maxWidth="sm" className="flex min-h-screen items-center justify-center">
      <Stack gap="4" className="items-center text-center">
        <Spinner size="lg" />
        <p className="text-gray-600">جاري تسجيل الخروج...</p>
      </Stack>
    </Container>
  );
}

export default LogoutPage;
export { LogoutPage };
