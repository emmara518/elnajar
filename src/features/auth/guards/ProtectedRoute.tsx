import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsLoading, selectIsInitialized } from '../stores/auth.store';
import { LoadingScreen } from '@/components/ui';
import { DEFAULT_REDIRECTS } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);
  const isInitialized = useAuthStore(selectIsInitialized);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={DEFAULT_REDIRECTS.AFTER_LOGOUT} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
