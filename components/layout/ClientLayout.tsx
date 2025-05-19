"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavbarLogin from "../navbar-profile/NavbarLogin";
import Footer from "../footer/Footer";
import {
  matchDynamicRoutes,
  matchStaticRoutes,
} from "@/helpers/utils/routeMatch";
import { GetStarted } from "@/components/getStarted";
import { getToken, getStorageUser } from "@/helpers/services/auth";
import { useIsLoginAsUser } from "@/helpers/hooks/useIsLoginAsUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { bootstrapUser, setBootstraping } from "@/store/redux/slices/authSlice";
import Loader from "@/components/Loader";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { IClientDetails } from "@/helpers/types/client.type";
import AOS from "aos";
import "aos/dist/aos.css";

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

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { user, isBootstrapping } = useSelector(
    (state: RootState) => state.auth
  );
  const pathname = usePathname() || "";
  const { loading: loginAsUserLoading } = useIsLoginAsUser();
  const [forceReady, setForceReady] = useState(false);
  const [isAosInitialized, setIsAosInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Bootstrap the user when the component mounts
  useEffect(() => {
    if (isClient) {
      dispatch(bootstrapUser() as any);

      // Safety timeout - force continue after 1 second even if bootstrapping gets stuck
      const timer = setTimeout(() => {
        setForceReady(true);
        dispatch(setBootstraping(false));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, isClient]);

  // Initialize AOS
  useEffect(() => {
    if (!isAosInitialized && isClient) {
      try {
        AOS.init(AOS_CONFIG);
        setIsAosInitialized(true);
      } catch (error) {
        console.error("Error initializing AOS:", error);
      }
    }
  }, [isAosInitialized, isClient]);

  // Scroll to top on route change
  useEffect(() => {
    if (isClient) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isClient]);

  // Define routes where header and footer should be hidden
  const hideHeaderFooter = React.useMemo(() => {
    return (
      matchStaticRoutes(
        [
          "/login",
          "/register/employer",
          "/register/freelancer",
          "/forgot-password",
          "/reset-password",
          "/complete-profile",
          "/2fa",
          "/terms",
          "/post-new-job",
        ],
        pathname
      ) || matchDynamicRoutes(["/invoice/", "/edit/", "/template/"], pathname)
    );
  }, [pathname]);

  // Get user from localStorage if Redux state is not available (but only on client)
  const actualUser = isClient ? user || getStorageUser() : null;

  // Loading state handling - show spinner only briefly during bootstrapping
  const isLoading =
    isClient && (isBootstrapping || loginAsUserLoading) && !forceReady;

  // Check if user is a freelancer
  const isFreelancer = actualUser?.user_type === "freelancer";

  // Get token
  const token = isClient ? getToken() : null;

  // Show a loader while bootstrapping, but only on client
  if (isLoading) {
    return <Loader height={300} />;
  }

  // In SSR or initial render, show content without additional checks
  return (
    <div className="App">
      {!hideHeaderFooter && <NavbarLogin />}

      {/* Main content */}
      <main className="fade-enter-active fade-enter-done">{children}</main>

      {!hideHeaderFooter && <Footer />}
      {isClient && isFreelancer && token && !hideHeaderFooter && (
        <GetStarted user={actualUser as IFreelancerDetails} isLoading={false} />
      )}
    </div>
  );
}
