"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { bootstrapUser } from "@/store/redux/slices/authSlice";
import Loader from "../Loader";
import ReactQueryProvider from "../ReactQueryProvider/ReactQueryProvider";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { IntercomProvider } from "react-use-intercom";
import { AuthProvider } from "@/helpers/contexts/auth-context";
import ClientOnly from "@/helpers/contexts/ClientOnly";
import { myTheme } from "../../styles/theme";
import { CssUtils } from "../../styles/CssUtils";
import AOS from "aos";
import ReactGA from "react-ga";
import { usePathname } from "next/navigation";
import { isStagingEnv } from "@/helpers/utils/helper";
import { setCookie } from "@/helpers/utils/cookieHelper";
import { Toaster } from "react-hot-toast";
import AppLayout from "../layout/AppLayout";

// Constants
const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";
const GA_TRACKING_CODE = process.env.NEXT_PUBLIC_GA_TRACKING_CODE;

// Types for AOS
type AnchorPlacement =
  | "top-bottom"
  | "top-center"
  | "top-top"
  | "center-bottom"
  | "center-center"
  | "center-top"
  | "bottom-bottom"
  | "bottom-center"
  | "bottom-top";

type EasingOptions = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

const initGA = () => {
  if (GA_TRACKING_CODE) {
    ReactGA.initialize(GA_TRACKING_CODE);
  } else {
    console.error("GA_TRACKING_CODE is not defined");
  }
};

const logPageView = (path: string) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};

const AOS_CONFIG = {
  disable: false,
  startEvent: "DOMContentLoaded",
  initClassName: "aos-init",
  animatedClassName: "aos-animate",
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,
  offset: 120,
  delay: 0,
  duration: 400,
  easing: "ease" as EasingOptions,
  once: true,
  mirror: false,
  anchorPlacement: "top-bottom" as AnchorPlacement,
};

function ClientBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isBootstrapping } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname() || "";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(bootstrapUser() as any);
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
      const utmParams = Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (key.startsWith("utm_")) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      if (Object.keys(utmParams).length > 0) {
        setCookie("utm_info", JSON.stringify(utmParams));
      }
    }
  }, [isClient]);

  if (isBootstrapping) return <Loader />;

  return (
    <ThemeProvider theme={myTheme}>
      <AppLayout>{children}</AppLayout>
      <CssUtils theme={myTheme} />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      <IntercomProvider
        appId={INTERCOM_APP_ID}
        autoBoot={isClient && !isStagingEnv()}
      >
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

// "use client";

// import { Provider } from "react-redux";
// import { store } from "@/store/store";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { bootstrapUser } from "@/store/redux/slices/authSlice";
// import Loader from "../Loader";
// import ReactQueryProvider from "../ReactQueryProvider/ReactQueryProvider";
// import { useEffect, useState, lazy, Suspense } from "react";
// import { ThemeProvider } from "styled-components";
// import { IntercomProvider } from "react-use-intercom";
// import { AuthProvider } from "@/helpers/contexts/auth-context";
// import ClientOnly from "@/helpers/contexts/ClientOnly";
// import { myTheme } from "../../styles/theme";
// import { CssUtils } from "../../styles/CssUtils";
// import { usePathname } from "next/navigation";
// import { isStagingEnv } from "@/helpers/utils/helper";
// import { setCookie } from "@/helpers/utils/cookieHelper";
// import { Toaster } from "react-hot-toast";
// import { AnyAction } from "@reduxjs/toolkit";

// // Lazy load non-critical components
// const AppLayout = lazy(() => import("../layout/AppLayout"));

// // Dynamic imports for heavy libraries
// const loadAOS = () => import("aos").then((module) => module.default);
// const loadReactGA = () => import("react-ga").then((module) => module.default);

// // Constants
// const INTERCOM_APP_ID = process.env.REACT_APP_INTERCOM_APP_ID || "";
// const GA_TRACKING_CODE = process.env.REACT_APP_GA_TRACKING_CODE;

// // Types for AOS
// type AnchorPlacement =
//   | "top-bottom"
//   | "top-center"
//   | "top-top"
//   | "center-bottom"
//   | "center-center"
//   | "center-top"
//   | "bottom-bottom"
//   | "bottom-center"
//   | "bottom-top";

// type EasingOptions = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

// const AOS_CONFIG = {
//   disable: false,
//   startEvent: "DOMContentLoaded",
//   initClassName: "aos-init",
//   animatedClassName: "aos-animate",
//   useClassNames: false,
//   disableMutationObserver: false,
//   debounceDelay: 50,
//   throttleDelay: 99,
//   offset: 120,
//   delay: 0,
//   duration: 400,
//   easing: "ease" as EasingOptions,
//   once: true,
//   mirror: false,
//   anchorPlacement: "top-bottom" as AnchorPlacement,
// };

// function ClientBootstrap({ children }: { children: React.ReactNode }) {
//   const dispatch = useDispatch();
//   const { isBootstrapping } = useSelector((state: RootState) => state.auth);
//   const pathname = usePathname() || "";
//   const [isClient, setIsClient] = useState(false);

//   // Split effects to reduce main thread work
//   useEffect(() => {
//     setIsClient(true);
//     // Type the action properly
//     dispatch(bootstrapUser() as unknown as AnyAction);
//   }, [dispatch]);

//   // Defer non-critical operations
//   useEffect(() => {
//     if (!isClient) return;

//     // Initialize analytics after a delay
//     const timer = setTimeout(() => {
//       if (!isStagingEnv()) {
//         loadReactGA().then((ReactGA) => {
//           ReactGA.initialize(GA_TRACKING_CODE || "");
//           ReactGA.set({ page: pathname });
//           ReactGA.pageview(pathname);
//         });
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [pathname, isClient]);

//   // Initialize AOS with a delay
//   useEffect(() => {
//     if (!isClient) return;

//     const timer = setTimeout(() => {
//       loadAOS().then((AOS) => {
//         AOS.init(AOS_CONFIG);
//       });
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, [isClient]);

//   // Handle scroll with requestAnimationFrame
//   useEffect(() => {
//     if (!isClient) return;

//     requestAnimationFrame(() => {
//       window.scrollTo(0, 0);
//     });
//   }, [pathname, isClient]);

//   // Handle UTM parameters
//   useEffect(() => {
//     if (!isClient) return;

//     const timer = setTimeout(() => {
//       const urlSearchParams = new URLSearchParams(window.location.search);
//       const params = Object.fromEntries(urlSearchParams.entries());
//       const utmParams = Object.entries(params).reduce((acc, [key, value]) => {
//         if (key.startsWith("utm_")) {
//           acc[key] = value;
//         }
//         return acc;
//       }, {} as Record<string, string>);

//       if (Object.keys(utmParams).length > 0) {
//         setCookie("utm_info", JSON.stringify(utmParams));
//       }
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [isClient]);

//   if (isBootstrapping) return <Loader />;

//   return (
//     <ThemeProvider theme={myTheme}>
//       <Suspense fallback={<Loader />}>
//         <AppLayout>{children}</AppLayout>
//       </Suspense>
//       <CssUtils theme={myTheme} />
//       <Toaster position="top-center" />
//     </ThemeProvider>
//   );
// }

// export default function ClientProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   return (
//     <Provider store={store}>
//       {/* Only load Intercom when absolutely needed */}
//       <IntercomProvider
//         appId={INTERCOM_APP_ID}
//         autoBoot={false}
//         shouldInitialize={isClient && !isStagingEnv()}
//       >
//         <ReactQueryProvider>
//           <ClientOnly>
//             <AuthProvider>
//               <ClientBootstrap>{children}</ClientBootstrap>
//             </AuthProvider>
//           </ClientOnly>
//         </ReactQueryProvider>
//       </IntercomProvider>
//     </Provider>
//   );
// }
