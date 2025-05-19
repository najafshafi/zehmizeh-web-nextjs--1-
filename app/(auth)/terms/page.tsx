"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const TermsLoading = () => (
  <div className="flex flex-col w-full h-screen items-center justify-center bg-secondary">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading terms...</p>
  </div>
);

// Dynamically import Terms with no SSR
const DynamicTerms = dynamic(
  () => import("@/components/forms/authComp/Terms"),
  {
    ssr: false,
    loading: () => <TermsLoading />,
  }
);

// Client-side wrapper component
const TermsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <TermsLoading />;
  }

  return <DynamicTerms />;
};

const Page = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center bg-secondary">
      <Suspense fallback={<TermsLoading />}>
        <TermsClient />
      </Suspense>
    </div>
  );
};

export default Page;
