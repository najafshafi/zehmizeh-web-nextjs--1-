import React from 'react';
import PageWrapper from 'components/styled/PageWrapper';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'helpers/contexts/auth-context';

function PageLayout() {
  const location = useLocation();
  const auth = useAuth();

  const showSidebar = React.useMemo(() => {
    return !location.pathname.includes('complete-profile');
  }, [location.pathname]);

  if (!auth.user) return <Outlet />;

  return (
    <PageWrapper
      className={`withMinimized ${!showSidebar ? 'no-sidebar' : ''}`}
    >
      {showSidebar && <SideBar />}
      <div className={`container-f`}>
        <section className="p-3">
          <Outlet />
        </section>
      </div>
    </PageWrapper>
  );
}

const SideBar = () => {
  return <div>Sidebar</div>;
};

export default PageLayout;
