'use client';

import { Provider } from 'react-redux';
import { store } from '../../store'; // Adjust path
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust path
import { bootstrapUser } from '../../lib/auth'; // Adjust path
import Loader from '../Loader'; // Adjust path
import { useEffect } from 'react';
import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider'; // Adjust path

// Inner component to handle bootstrapping logic
function ClientBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isBootstrapping } = useSelector((state: RootState) => state.auth as { isBootstrapping: boolean });

  useEffect(() => {
    bootstrapUser(dispatch);
  }, [dispatch]);

  if (isBootstrapping) return <Loader />;

  return <>{children}</>;
}

// Outer component to provide Redux store
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
      <ClientBootstrap>{children}</ClientBootstrap>
      </ReactQueryProvider>
    </Provider>
  );
}