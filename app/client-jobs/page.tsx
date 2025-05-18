"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const ClientJobsLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading jobs...</p>
  </div>
);

// Dynamically import ClientJobs with no SSR
const DynamicClientJobs = dynamic(() => import("./ClientJobs"), {
  ssr: false,
  loading: () => <ClientJobsLoading />,
});

// Client-side only wrapper component
const ClientJobsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <ClientJobsLoading />;
  }

  return <DynamicClientJobs />;
};

export default function ClientJobsPage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<ClientJobsLoading />}>
        <ClientJobsClient />
      </Suspense>
    </div>
  );
}
