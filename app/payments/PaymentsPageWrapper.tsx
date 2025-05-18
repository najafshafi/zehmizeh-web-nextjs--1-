"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const PaymentsLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading payments...</p>
  </div>
);

// Dynamically import the Payments component
const DynamicPaymentsWrapper = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => <PaymentsLoading />,
});

export default function PaymentsPageWrapper() {
  // Add client-side rendering check
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <PaymentsLoading />;
  }

  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<PaymentsLoading />}>
        <DynamicPaymentsWrapper />
      </Suspense>
    </div>
  );
}
