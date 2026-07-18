import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsInitialized } from '../stores/auth.store';
import { LoadingScreen } from '@/components/ui';

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isInitialized = useAuthStore(selectIsInitialized);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
