import { House, Package, ShoppingCart, ClipboardList, User } from 'lucide-react';
import type { NavItem } from '@/types';
import { ROUTES } from '@/app/constants';

export const bottomNavItems: NavItem[] = [
  { label: 'الرئيسية', href: ROUTES.HOME, icon: House },
  { label: 'المنتجات', href: ROUTES.PRODUCTS, icon: Package },
  { label: 'السلة', href: ROUTES.CART, icon: ShoppingCart },
  { label: 'الطلبات', href: ROUTES.ORDERS, icon: ClipboardList },
  { label: 'حسابي', href: ROUTES.ACCOUNT, icon: User },
];
