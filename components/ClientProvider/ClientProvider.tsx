// 'use client';

// import { Provider } from 'react-redux';
// import { store } from '../../store'; // Adjust path
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../store'; // Adjust path
// import { bootstrapUser } from '../../lib/auth'; // Adjust path
// import Loader from '../Loader'; // Adjust path
// import { useEffect } from 'react';
// import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider'; // Adjust path

// // Inner component to handle bootstrapping logic
// function ClientBootstrap({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();
//   const { isBootstrapping } = useSelector((state: RootState) => state.auth as { isBootstrapping: boolean });

//   useEffect(() => {
//     bootstrapUser(dispatch);
//   }, [dispatch]);

//   if (isBootstrapping) return <Loader />;

//   return <>{children}</>;
// }

// // Outer component to provide Redux store
// export default function ClientProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       <ReactQueryProvider>
//       <ClientBootstrap>{children}</ClientBootstrap>
//       </ReactQueryProvider>
//     </Provider>
//   );
// }

'use client';

import { Provider } from 'react-redux';
import { store } from '../../store'; // Adjust path
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store'; // Adjust path
import { bootstrapUser } from '../../lib/auth'; // Adjust path
import Loader from '../Loader'; // Adjust path
import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider'; // Adjust path
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { IntercomProvider } from 'react-use-intercom';
import { AuthProvider } from '@/helpers/contexts/auth-context';
import { MyGlobalStyle } from '../../styles/GlobalStyle'; // Adjust path
import { myTheme } from '../../styles/theme'; // Adjust path
import { CssUtils } from '../../styles/CssUtils'; // Adjust path
import AOS from 'aos';
import ReactGA from 'react-ga';
import { usePathname } from 'next/navigation';
import { isStagingEnv } from '@/helpers/utils/helper'; // Adjust path
import { setCookie } from '@/helpers/utils/cookieHelper'; // Adjust path

// Constants from App.tsx
const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;
const GA_TRACKING_CODE = process.env.REACT_APP_GA_TRACKING_CODE;

// Google Analytics setup
const initGA = () => {
  if (GA_TRACKING_CODE) {
    ReactGA.initialize(GA_TRACKING_CODE);
  } else {
    console.error('GA_TRACKING_CODE is not defined');
  }
};

const logPageView = (path) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};

// AOS Animation configuration
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

function ClientBootstrap({ children }) {
  const dispatch = useDispatch();
  const { isBootstrapping } = useSelector((state: RootState) => state.auth);
  const [autoBoot, setAutoBoot] = useState(false);
  const pathname = usePathname();

  // Bootstrap user authentication
  useEffect(() => {
    bootstrapUser(dispatch);
  }, [dispatch]);

  // Set Intercom autoBoot based on environment
  useEffect(() => {
    setAutoBoot(!isStagingEnv());
  }, []);

  // Initialize AOS and Google Analytics
  useEffect(() => {
    AOS.init(AOS_CONFIG);
    if (!isStagingEnv()) {
      initGA();
    }
  }, []);

  // Log page views on path changes
  useEffect(() => {
    if (!isStagingEnv()) {
      logPageView(pathname);
    }
  }, [pathname]);

  // Scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle UTM parameters on mount
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (key.startsWith('utm_')) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(utmParams).length > 0) {
      setCookie('utm_info', JSON.stringify(utmParams));
    }
  }, []);

  if (isBootstrapping) return <Loader />;

  return (
    <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={autoBoot}>
      <AuthProvider>
        <ThemeProvider theme={myTheme}>
          {children}
          <MyGlobalStyle />
          <CssUtils theme={undefined} />
        </ThemeProvider>
      </AuthProvider>
    </IntercomProvider>
  );
}

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <ClientBootstrap>{children}</ClientBootstrap>
      </ReactQueryProvider>
    </Provider>
  );
}