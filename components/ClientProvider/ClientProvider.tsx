'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { bootstrapUser } from '@/store/redux/slices/authSlice';
import Loader from '../Loader';
import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { IntercomProvider } from 'react-use-intercom';
import { AuthProvider } from '@/helpers/contexts/auth-context';
import ClientOnly from '@/helpers/contexts/ClientOnly';
import { myTheme } from '../../styles/theme';
import { CssUtils } from '../../styles/CssUtils';
import AOS from 'aos';
import ReactGA from 'react-ga';
import { usePathname } from 'next/navigation';
import { isStagingEnv } from '@/helpers/utils/helper';
import { setCookie } from '@/helpers/utils/cookieHelper';
import { Toaster } from 'react-hot-toast';

// Constants
const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;
const GA_TRACKING_CODE = process.env.REACT_APP_GA_TRACKING_CODE;

const initGA = () => {
  if (GA_TRACKING_CODE) {
    ReactGA.initialize(GA_TRACKING_CODE);
  } else {
    console.error('GA_TRACKING_CODE is not defined');
  }
};

const logPageView = (path: string) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};

const AOS_CONFIG = {
  disable: false,
  startEvent: 'DOMContentLoaded',
  initClassName: 'aos-init',
  animatedClassName: 'aos-animate',
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,
  offset: 120,
  delay: 0,
  duration: 400,
  easing: 'ease',
  once: true,
  mirror: false,
  anchorPlacement: 'top-bottom',
};

function ClientBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isBootstrapping } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(bootstrapUser());
  }, [dispatch]);

  useEffect(() => {
    if (isClient) {
      AOS.init(AOS_CONFIG);
      if (!isStagingEnv()) {
        initGA();
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && !isStagingEnv()) {
      logPageView(pathname);
    }
  }, [pathname, isClient]);

  useEffect(() => {
    if (isClient) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isClient]);

  useEffect(() => {
    if (isClient) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      const utmParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (key.startsWith('utm_')) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(utmParams).length > 0) {
        setCookie('utm_info', JSON.stringify(utmParams));
      }
    }
  }, [isClient]);

  if (isBootstrapping) return <Loader />;

  return (
    <ThemeProvider theme={myTheme}>
      {children}
      <CssUtils theme={undefined} />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={isClient && !isStagingEnv()}>
            <ReactQueryProvider>
        <ClientOnly>
          <AuthProvider>
              <ClientBootstrap>{children}</ClientBootstrap>
          </AuthProvider>
        </ClientOnly>
            </ReactQueryProvider>
      </IntercomProvider>
    </Provider>
  );
}