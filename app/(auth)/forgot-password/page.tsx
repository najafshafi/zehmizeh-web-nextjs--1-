"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const ForgotPasswordLoading = () => (
  <div className="flex flex-col w-full items-center justify-center bg-secondary min-h-[70vh] pt-[110px]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
);

// Dynamically import ForgotPassword with no SSR
const DynamicForgotPassword = dynamic(
  () => import("@/components/forms/ForgotPassword"),
  {
    ssr: false,
    loading: () => <ForgotPasswordLoading />,
  }
);

// Client-side wrapper component
const ForgotPasswordClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <ForgotPasswordLoading />;
  }

  return <DynamicForgotPassword />;
};

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center bg-secondary">
      <Suspense fallback={<ForgotPasswordLoading />}>
        <ForgotPasswordClient />
      </Suspense>
    </div>
  );
};

export default ForgotPasswordPage;
