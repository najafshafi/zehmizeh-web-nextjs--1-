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

// 'use client';

// import { Provider } from 'react-redux';
// import { store } from '@/store/store';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { bootstrapUser } from '@/store/redux/authSlice';
// import Loader from '../Loader';
// import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider';
// import { useEffect } from 'react';
// import { ThemeProvider } from 'styled-components';
// import { IntercomProvider } from 'react-use-intercom';
// import { AuthProvider } from '@/helpers/contexts/auth-context';
// import ClientOnly from '@/helpers/contexts/ClientOnly';
// import { myTheme } from '../../styles/theme';
// import { CssUtils } from '../../styles/CssUtils';
// import AOS from 'aos';
// import ReactGA from 'react-ga';
// import { usePathname } from 'next/navigation';
// import { isStagingEnv } from '@/helpers/utils/helper';
// import { setCookie } from '@/helpers/utils/cookieHelper';

// // Constants from App.tsx
// const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID;
// const GA_TRACKING_CODE = process.env.REACT_APP_GA_TRACKING_CODE;

// // Google Analytics setup
// const initGA = () => {
//   if (GA_TRACKING_CODE) {
//     ReactGA.initialize(GA_TRACKING_CODE);
//   } else {
//     console.error('GA_TRACKING_CODE is not defined');
//   }
// };

// const logPageView = (path) => {
//   ReactGA.set({ page: path });
//   ReactGA.pageview(path);
// };

// // AOS Animation configuration
// const AOS_CONFIG = {
//   disable: false,
//   startEvent: 'DOMContentLoaded',
//   initClassName: 'aos-init',
//   animatedClassName: 'aos-animate',
//   useClassNames: false,
//   disableMutationObserver: false,
//   debounceDelay: 50,
//   throttleDelay: 99,
//   offset: 120,
//   delay: 0,
//   duration: 400,
//   easing: 'ease',
//   once: true,
//   mirror: false,
//   anchorPlacement: 'top-bottom',
// };

// function ClientBootstrap({ children }) {
//   const dispatch = useDispatch();
//   const { isBootstrapping } = useSelector((state: RootState) => state.auth);
//   const pathname = usePathname();

//   // Bootstrap user authentication on mount
//   useEffect(() => {
//     dispatch(bootstrapUser()); // Trigger bootstrapUser action
//   }, [dispatch]);

//   // Initialize AOS and Google Analytics
//   useEffect(() => {
//     AOS.init(AOS_CONFIG);
//     if (!isStagingEnv()) {
//       initGA();
//     }
//   }, []);

//   // Log page views on path changes
//   useEffect(() => {
//     if (!isStagingEnv()) {
//       logPageView(pathname);
//     }
//   }, [pathname]);

//   // Scroll to top on path change
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   // Handle UTM parameters on mount
//   useEffect(() => {
//     const urlSearchParams = new URLSearchParams(window.location.search);
//     const params = Object.fromEntries(urlSearchParams.entries());
//     const utmParams = Object.entries(params).reduce((acc, [key, value]) => {
//       if (key.startsWith('utm_')) {
//         acc[key] = value;
//       }
//       return acc;
//     }, {});

//     if (Object.keys(utmParams).length > 0) {
//       setCookie('utm_info', JSON.stringify(utmParams));
//     }
//   }, []);

//   if (isBootstrapping) return <Loader />;

//   return (
//     <ThemeProvider theme={myTheme}>
//       {children}
//       <CssUtils theme={undefined} />
//     </ThemeProvider>
//   );
// }

// export default function ClientProvider({ children }) {
//   return (
//     <Provider store={store}>
//       <IntercomProvider appId={INTERCOM_APP_ID} autoBoot={!isStagingEnv()}>
//         <ClientOnly>
//           <AuthProvider>
//             <ReactQueryProvider>
//               <ClientBootstrap>{children}</ClientBootstrap>
//             </ReactQueryProvider>
//           </AuthProvider>
//         </ClientOnly>
//       </IntercomProvider>
//     </Provider>
//   );
// }


'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { bootstrapUser } from '@/store/redux/slices/authSlice';
import Loader from '../Loader';
import ReactQueryProvider from '../ReactQueryProvider/ReactQueryProvider';
import { useEffect, useState } from 'react'; // Add useState
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
  const [isClient, setIsClient] = useState(false); // Track if we're on client

  useEffect(() => {
    setIsClient(true); // Set to true once mounted on client
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
        <ClientOnly>
          <AuthProvider>
            <ReactQueryProvider>
              <ClientBootstrap>{children}</ClientBootstrap>
            </ReactQueryProvider>
          </AuthProvider>
        </ClientOnly>
      </IntercomProvider>
    </Provider>
  );
}