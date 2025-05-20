"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading component
const RegisterLoading = () => (
  <div className="flex flex-col w-full items-center justify-center bg-secondary min-h-[70vh] pt-[110px]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading registration form...</p>
  </div>
);

// Dynamically import with no SSR
const DynamicRegisterEmployerWrapper = dynamic(
  () => import("./RegisterEmployerWrapper"),
  {
    ssr: false,
    loading: () => <RegisterLoading />,
  }
);

// Client-side wrapper component
const RegisterEmployerClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <RegisterLoading />;
  }

  return <DynamicRegisterEmployerWrapper />;
};

export default function RegisterEmployerPage() {
  return (
    <div className="flex flex-col w-full items-center bg-secondary min-h-[140vh]">
      <Suspense fallback={<RegisterLoading />}>
        <RegisterEmployerClient />
      </Suspense>
    </div>
  );
}
