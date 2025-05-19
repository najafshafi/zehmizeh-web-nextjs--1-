"use client"
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const DisputesLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading disputes...</p>
  </div>
);

// Dynamically import Disputes with no SSR
const DynamicDisputes = dynamic(() => import("./Disputes"), {
  ssr: false,
  loading: () => <DisputesLoading />,
});

export default function DisputesPage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<DisputesLoading />}>
        <DynamicDisputes />
      </Suspense>
    </div>
  );
}
