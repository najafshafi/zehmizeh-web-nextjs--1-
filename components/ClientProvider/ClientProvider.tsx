'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { bootstrapUser } from '@/store/redux/authSlice';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { AuthProvider } from '@/helpers/contexts/auth-context';
import dynamic from 'next/dynamic';
import { IntercomProvider } from 'react-use-intercom';
import { isStagingEnv } from '@/helpers/utils/helper';

// Constants
const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || '';

// Create ClientOnly component with no SSR
const ClientOnlyComponent = dynamic<{ children: React.ReactNode }>(() => import('@/helpers/contexts/ClientOnly'), { 
  ssr: false,
  loading: () => null 
});

// Create a styled loading component
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

// Configure query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  }
});

// Separate Bootstrap component to handle auth state
function Bootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use selector directly in the component
  const { token, isBootstrapping } = useSelector((state: RootState) => ({
    token: state.auth.token,
    isBootstrapping: state.auth.isBootstrapping
  }));

  useEffect(() => {
    const startBootstrap = async () => {
      console.log('[ClientProvider] Starting bootstrap process', {
        hasToken: !!token,
        isBootstrapping
      });

      if (!token) {
        console.log('[ClientProvider] No token found, skipping bootstrap');
        return;
      }

      try {
        await dispatch(bootstrapUser()).unwrap();
        console.log('[ClientProvider] Bootstrap complete, rendering children');
      } catch (error) {
        console.error('[ClientProvider] Bootstrap failed:', error);
      }
    };

    startBootstrap();
  }, [dispatch, token]);

  if (isBootstrapping) {
    return (
      <LoadingWrapper>
        <div>Loading...</div>
      </LoadingWrapper>
    );
  }

  return children;
}

// Main ClientProvider component
export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingWrapper><div>Loading...</div></LoadingWrapper>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ClientOnlyComponent>
            <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={!isStagingEnv()}>
              <AuthProvider>
                <Bootstrap>{children}</Bootstrap>
              </AuthProvider>
            </IntercomProvider>
          </ClientOnlyComponent>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}