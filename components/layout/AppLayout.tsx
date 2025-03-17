"use client";
import React from 'react';
// Temporarily commented out
// import { useDetectAdBlock } from 'adblock-detect-react';
import { usePathname } from 'next/navigation';
// Import commented out until component is available
// import AdBlockePopOver from '@/components/adblocker-modal/AdBlockePopOver';
import NavbarLogin from '../navbar-profile/NavbarLogin';
import Footer from '../footer/Footer';
import { matchDynamicRoutes, matchStaticRoutes } from '@/helpers/utils/routeMatch';
import { GetStarted } from '@/components/getStarted';
import { getToken } from '@/helpers/services/auth';
import { useIsLoginAsUser } from '@/helpers/hooks/useIsLoginAsUser';
import { useAuth } from '@/helpers/contexts/auth-context';
import Loader from '@/components/Loader';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname() || '';
  // Ad block detection temporarily disabled
  // const adBlockDetected = useDetectAdBlock();
  const { loading } = useIsLoginAsUser();
  
  // Define routes where header and footer should be hidden
  const hideHeaderFooter = React.useMemo(() => {
    return (
      matchStaticRoutes(
        [
          '/login',
          '/register/employer',
          '/register/freelancer',
          '/forgot-password',
          '/reset-password',
          '/complete-profile',
          '/2fa',
          '/terms',
          '/post-new-job',
        ],
        pathname
      ) || matchDynamicRoutes(['/invoice/', '/edit/', '/template/'], pathname)
    );
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      {!hideHeaderFooter && <NavbarLogin />}
      
      {/* Main content with fade class but without TransitionGroup */}
      <main className="fade-enter-active fade-enter-done">
        {children}
      </main>
      
      {/* Component commented out until it's available */}
      {/* <AdBlockePopOver adBlockDetected={adBlockDetected} /> */}
      {!hideHeaderFooter && <Footer />}
      {user?.user_type === 'freelancer' && !!getToken() && !hideHeaderFooter && (
        <GetStarted user={user} isLoading={isLoading} />
      )}
    </div>
  );
}

export default AppLayout;
