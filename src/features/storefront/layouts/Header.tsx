import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cart.store';
import { useWishlistStore } from '../stores/wishlist.store';
import { useSearchStore } from '../stores/search.store';

export function Header() {
  const itemCount = useCartStore((s) => s.summary.itemCount);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openSearch = useSearchStore((s) => s.openSearch);

  const handleSearchToggle = useCallback(() => { openSearch(); }, [openSearch]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-gray-900 shrink-0" aria-label="الرئيسية">
          TOKYO
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="القائمة الرئيسية">
          <Link to="/categories" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
            الأقسام
          </Link>
          <Link to="/products" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
            المنتجات
          </Link>
          <Link to="/products?offer=new" className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50">
            الجديد
          </Link>
          <Link to="/products?offer=sale" className="px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50">
            العروض
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            onClick={handleSearchToggle}
            aria-label="بحث"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <Link
            to="/wishlist"
            className="relative p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            aria-label={`المفضلة (${String(wishlistCount)})`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" aria-hidden="true">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            aria-label={`السلة (${String(itemCount)})`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" aria-hidden="true">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
