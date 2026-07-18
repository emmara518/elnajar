import { Navigate } from 'react-router-dom';
import type { AppRole } from '../types';
import { useAuthStore, selectUser } from '../stores/auth.store';
import { ROLE_HIERARCHY } from '../constants';
import { DEFAULT_REDIRECTS } from '../constants';

interface RoleRouteProps {
  children: React.ReactNode;
  roles?: AppRole[];
  minimumRole?: AppRole;
  exactRole?: AppRole;
  fallback?: React.ReactNode;
}

export function RoleRoute({ children, roles, minimumRole, exactRole, fallback }: RoleRouteProps) {
  const user = useAuthStore(selectUser);
  const userRole = user?.role;

  if (!userRole) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to={DEFAULT_REDIRECTS.UNAUTHORIZED} replace />;
  }

  let hasAccess = true;

  if (exactRole) {
    hasAccess = userRole === exactRole;
  } else if (roles && roles.length > 0) {
    hasAccess = roles.includes(userRole);
  } else if (minimumRole) {
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];
    hasAccess = userLevel >= requiredLevel;
  }

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to={DEFAULT_REDIRECTS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
