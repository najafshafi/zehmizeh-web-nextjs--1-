"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  QueryClient as LegacyQueryClient,
  QueryClientProvider as LegacyQueryClientProvider,
} from "react-query";
import React, { useState } from "react";

export default function UnifiedQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize the new Tanstack query client (v4+)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Initialize the legacy React Query client (v3)
  const [legacyQueryClient] = useState(
    () =>
      new LegacyQueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            cacheTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Nest the providers to support both versions
  return (
    <QueryClientProvider client={queryClient}>
      <LegacyQueryClientProvider client={legacyQueryClient}>
        {children}
      </LegacyQueryClientProvider>
    </QueryClientProvider>
  );
}
