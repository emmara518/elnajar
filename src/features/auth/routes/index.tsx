import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { GuestRoute } from '../guards/GuestRoute';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { RoleRoute } from '../guards/RoleRoute';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const LogoutPage = lazy(() => import('../pages/LogoutPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const InvitePage = lazy(() => import('../pages/InvitePage'));
const AcceptInvitePage = lazy(() => import('../pages/AcceptInvitePage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));

export type AuthRouteHandle = {
  title: string;
  isPublic?: boolean;
};

export const authRoutes: RouteObject[] = [
  {
    path: 'auth/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
    handle: { title: 'تسجيل الدخول', isPublic: true } satisfies AuthRouteHandle,
  },
  {
    path: 'auth/logout',
    element: (
      <ProtectedRoute>
        <LogoutPage />
      </ProtectedRoute>
    ),
    handle: { title: 'تسجيل الخروج' } satisfies AuthRouteHandle,
  },
  {
    path: 'auth/reset-password',
    element: (
      <GuestRoute>
        <ResetPasswordPage />
      </GuestRoute>
    ),
    handle: { title: 'إعادة تعيين كلمة المرور', isPublic: true } satisfies AuthRouteHandle,
  },
  {
    path: 'auth/invite',
    element: (
      <ProtectedRoute>
        <RoleRoute minimumRole="owner">
          <InvitePage />
        </RoleRoute>
      </ProtectedRoute>
    ),
    handle: { title: 'دعوة موظف' } satisfies AuthRouteHandle,
  },
  {
    path: 'auth/accept-invite',
    element: <AcceptInvitePage />,
    handle: { title: 'قبول الدعوة', isPublic: true } satisfies AuthRouteHandle,
  },
  {
    path: 'auth/unauthorized',
    element: <UnauthorizedPage />,
    handle: { title: 'غير مصرح', isPublic: true } satisfies AuthRouteHandle,
  },
];
