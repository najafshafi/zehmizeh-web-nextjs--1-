"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const ResetPasswordLoading = () => (
  <div className="flex flex-col w-full h-screen items-center justify-center bg-secondary">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading reset password form...</p>
  </div>
);

// Dynamically import ResetPassword component with no SSR
const DynamicResetPassword = dynamic(
  () => import("@/components/forms/ResetPassword"),
  {
    ssr: false,
    loading: () => <ResetPasswordLoading />,
  }
);

// Client-side wrapper component
const ResetPasswordClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <ResetPasswordLoading />;
  }

  return <DynamicResetPassword />;
};

const Page = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center bg-secondary">
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
};

export default Page;
