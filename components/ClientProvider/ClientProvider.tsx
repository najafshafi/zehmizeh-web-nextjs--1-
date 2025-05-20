"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { bootstrapUser } from "@/store/redux/slices/authSlice";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
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
import { AnyAction } from "@reduxjs/toolkit";

// Constants
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
    dispatch(bootstrapUser() as unknown as AnyAction);
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
    <ClientOnly>
      <ClientBootstrap>{children}</ClientBootstrap>
    </ClientOnly>
  );
}
