import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ErrorPage } from '@/components/ui/ErrorPage';
import { StoreLayout } from '@/features/storefront/layouts/StoreLayout';
import { NotFoundPage } from '@/components/ui/NotFoundPage';

const HomePage = lazy(() => import('@/features/storefront/pages/HomePage'));
const CategoriesPage = lazy(() => import('@/features/storefront/pages/CategoriesPage'));
const ProductListingPage = lazy(() => import('@/features/storefront/pages/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('@/features/storefront/pages/ProductDetailsPage'));
const SearchResultsPage = lazy(() => import('@/features/storefront/pages/SearchResultsPage'));
const WishlistPage = lazy(() => import('@/features/storefront/pages/WishlistPage'));
const CartPage = lazy(() => import('@/features/storefront/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/features/storefront/pages/CheckoutPage'));
const ProfilePage = lazy(() => import('@/features/storefront/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const ShippingPage = lazy(() => import('@/features/storefront/pages/ShippingPage'));
const ReturnsPage = lazy(() => import('@/features/storefront/pages/ReturnsPage'));
const ContactPage = lazy(() => import('@/features/storefront/pages/ContactPage'));
const FaqPage = lazy(() => import('@/features/storefront/pages/FaqPage'));

const routes: RouteObject[] = [
  { index: true, element: <HomePage />, handle: { title: 'الرئيسية' } },
  { path: 'categories', element: <CategoriesPage />, handle: { title: 'الأقسام' } },
  { path: 'categories/:slug', element: <ProductListingPage />, handle: { title: 'التصنيف' } },
  { path: 'products', element: <ProductListingPage />, handle: { title: 'المنتجات' } },
  { path: 'products/:slug', element: <ProductDetailsPage />, handle: { title: 'تفاصيل المنتج' } },
  { path: 'search', element: <SearchResultsPage />, handle: { title: 'البحث' } },
  { path: 'wishlist', element: <WishlistPage />, handle: { title: 'المفضلة' } },
  { path: 'cart', element: <CartPage />, handle: { title: 'السلة' } },
  { path: 'checkout', element: <CheckoutPage />, handle: { title: 'إتمام الطلب' } },
  { path: 'orders', element: <ProfilePage />, handle: { title: 'الطلبات' } },
  { path: 'account', element: <ProfilePage />, handle: { title: 'حسابي' } },
  { path: 'auth/login', element: <LoginPage />, handle: { title: 'تسجيل الدخول' } },
  { path: 'auth/reset-password', element: <ResetPasswordPage />, handle: { title: 'إعادة تعيين كلمة المرور' } },
  { path: 'shipping', element: <ShippingPage />, handle: { title: 'الشحن والتوصيل' } },
  { path: 'returns', element: <ReturnsPage />, handle: { title: 'الإرجاع والاستبدال' } },
  { path: 'contact', element: <ContactPage />, handle: { title: 'اتصل بنا' } },
  { path: 'faq', element: <FaqPage />, handle: { title: 'الأسئلة الشائعة' } },
  { path: '*', element: <NotFoundPage />, handle: { title: 'الصفحة غير موجودة' } },
];

export const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    errorElement: <ErrorPage />,
    children: routes,
  },
]);
