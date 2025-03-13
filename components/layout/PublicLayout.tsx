// import { useAuth } from 'helpers/contexts/auth-context';
import { Outlet } from 'react-router-dom';
function WebsiteLayout() {
  // const { user } = useAuth();
  //TODO: manage layout here conditionally
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default WebsiteLayout;
