import React from 'react';
// TODO: Update versioning for adblock-detect-react
// changed to patch updates because 1.3.0 was giving error
import { useDetectAdBlock } from 'adblock-detect-react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import AdBlockePopOver from '@/components/adblocker-modal/AdBlockePopOver';
import SiteHeader from '@/components/header/Header';
import SiteFooter from '@/components/footer/Footer';
import { matchDynamicRoutes, matchStaticRoutes } from '@/helpers/utils/routeMatch';
import { GetStarted } from '@/components/getStarted';
import { getToken } from '@/helpers/services/auth';
import { useIsLoginAsUser } from '@/helpers/hooks/useIsLoginAsUser';
import Loader from '@/components/Loader';
import { useAuth } from '@/helpers/contexts/auth-context';

function AppLayout({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const adBlockDetected = useDetectAdBlock();
  const { loading } = useIsLoginAsUser();
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
        location.pathname
      ) || matchDynamicRoutes(['/invoice/', '/edit/', '/template/'], location.pathname)
    );
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      {!hideHeaderFooter && <SiteHeader />}

      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          classNames="fade"
          // timeout={5000}
          timeout={{ enter: 700, exit: 0 }}
          // onExit={() => {
          //   const node = document.body;
          //   node.style.position = 'fixed';
          // }}
          // onExited={() => {
          //   const node = document.body;
          //   node.style.position = 'static';
          // }}
          // timeout={3000}
          unmountOnExit
          appear
        >
          {children}
        </CSSTransition>
      </TransitionGroup>
      <AdBlockePopOver adBlockDetected={adBlockDetected} />
      {!hideHeaderFooter && <SiteFooter />}
      {user?.user_type === 'freelancer' && !!getToken() && !hideHeaderFooter && (
        <GetStarted user={user} isLoading={isLoading} />
      )}
    </div>
  );
}

export default AppLayout;
