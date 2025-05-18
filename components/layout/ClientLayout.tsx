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

  // Bootstrap the user when the component mounts
  useEffect(() => {
    dispatch(bootstrapUser() as any);

    // Safety timeout - force continue after 2 seconds even if bootstrapping gets stuck
    const timer = setTimeout(() => {
      setForceReady(true);
      dispatch(setBootstraping(false));
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Initialize AOS
  useEffect(() => {
    if (!isAosInitialized && typeof window !== "undefined") {
      AOS.init(AOS_CONFIG);
      setIsAosInitialized(true);
    }
  }, [isAosInitialized]);

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

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

  // Loading state handling
  const isLoading = (isBootstrapping || loginAsUserLoading) && !forceReady;

  // Get user from localStorage if Redux state is not available
  const actualUser = user || getStorageUser();

  // Show a loader while bootstrapping
  if (isLoading) {
    return <Loader height={300} />;
  }

  return (
    <div className="App">
      {!hideHeaderFooter && <NavbarLogin />}

      {/* Main content */}
      <main className="fade-enter-active fade-enter-done">{children}</main>

      {!hideHeaderFooter && <Footer />}
      {actualUser?.user_type === "freelancer" &&
        !!getToken() &&
        !hideHeaderFooter && <GetStarted user={actualUser} isLoading={false} />}
    </div>
  );
}
