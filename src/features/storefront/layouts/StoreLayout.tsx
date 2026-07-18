import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { MegaMenu } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { useUIStore } from '../stores/ui.store';
import { Skeleton } from '@/design-system';

function StoreLayoutFallback() {
  return (
    <div className="min-h-svh" dir="rtl">
      <div className="h-8 bg-gray-900 animate-pulse" />
      <div className="h-16 bg-white border-b border-gray-200" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function StoreLayout() {
  const setScrolled = useUIStore((s) => s.setScrolled);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, [setScrolled]);

  return (
    <div className="flex min-h-svh flex-col" dir="rtl">
      <AnnouncementBar />
      <div className="relative">
        <Header />
        <MegaMenu />
      </div>

      <SearchOverlay />

      <main className="flex-1 pb-16 lg:pb-0">
        <Suspense fallback={<StoreLayoutFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
