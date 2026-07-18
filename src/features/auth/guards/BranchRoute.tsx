import { Navigate } from 'react-router-dom';
import { useSessionStore, selectBranchContext } from '../stores/session.store';

interface BranchRouteProps {
  children: React.ReactNode;
  requireBranch?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function BranchRoute({ children, requireBranch = true, fallback, redirectTo }: BranchRouteProps) {
  const branchContext = useSessionStore(selectBranchContext);

  if (requireBranch && !branchContext?.branchId) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to={redirectTo ?? '/branch-select'} replace />;
  }

  return <>{children}</>;
}
