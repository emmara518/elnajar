import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const ExamplePage = lazy(() => import('../pages/ExamplePage'));
const ExampleDetailPage = lazy(() => import('../pages/ExampleDetailPage'));

export type ExampleRouteHandle = {
  title: string;
  permissions?: string[];
};

export const exampleRoutes: RouteObject[] = [
  {
    path: 'examples',
    element: <ExamplePage />,
    handle: {
      title: 'الأمثلة',
      permissions: ['example.view'],
    } satisfies ExampleRouteHandle,
  },
  {
    path: 'examples/:id',
    element: <ExampleDetailPage />,
    handle: {
      title: 'تفاصيل المثال',
      permissions: ['example.view'],
    } satisfies ExampleRouteHandle,
  },
];
