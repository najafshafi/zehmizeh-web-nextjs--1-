"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const RegisterLoading = () => (
  <div className="flex flex-col w-full items-center justify-center bg-secondary min-h-[70vh] pt-[110px]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading registration form...</p>
  </div>
);

// ClientSide wrapper to handle useSearchParams
const RegisterEmployerClientComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <RegisterLoading />;
  }

  return <DynamicRegisterEmployerDecider />;
};

// Dynamically import RegisterEmployerDecider with no SSR
const DynamicRegisterEmployerDecider = dynamic(
  () => import("@/components/forms/RegisterEmployerDecider"),
  {
    ssr: false,
    loading: () => <RegisterLoading />,
  }
);

export default function RegisterEmployerPage() {
  return (
    <div className="flex flex-col w-full items-center bg-secondary min-h-[140vh]">
      <Suspense fallback={<RegisterLoading />}>
        <RegisterEmployerClientComponent />
      </Suspense>
    </div>
  );
}
