import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SafeArea } from './SafeArea';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { PageContainer } from './PageContainer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { bottomNavItems } from '@/config/navigation';

export function AppLayout() {
  return (
    <SafeArea top>
      <div className="flex min-h-svh flex-col">
        <Header />

        <PageContainer className="flex-1 pb-16">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </PageContainer>

        <BottomNavigation items={bottomNavItems} />
      </div>
    </SafeArea>
  );
}
