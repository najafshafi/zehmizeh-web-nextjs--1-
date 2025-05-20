"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/helpers/contexts/auth-context";
import { PropsWithChildren, useState, useEffect, Suspense } from "react";
import { IntercomProvider } from "react-use-intercom";
import { isStagingEnv } from "@/helpers/utils/helper";
import { Providers as ReduxProviders } from "@/store/provider";
import ReactQueryProvider from "@/components/ReactQueryProvider/ReactQueryProvider";

// Constants
const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";

// Fallback component for Suspense
const ProvidersFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export function Providers({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    // <Suspense fallback={<ProvidersFallback />}>
    <SessionProvider>
      <ReactQueryProvider>
        <IntercomProvider
          appId={INTERCOM_APP_ID}
          autoBoot={isClient && !isStagingEnv()}
        >
          <ReduxProviders>
            <AuthProvider>{children}</AuthProvider>
          </ReduxProviders>
        </IntercomProvider>
      </ReactQueryProvider>
    </SessionProvider>
    // </Suspense>
  );
}
