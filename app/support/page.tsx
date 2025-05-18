"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const SupportLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading support page...</p>
  </div>
);

// Dynamically import Support with no SSR
const DynamicSupport = dynamic(() => import("./Support"), {
  ssr: false,
  loading: () => <SupportLoading />,
});

export default function SupportPage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<SupportLoading />}>
        <DynamicSupport />
      </Suspense>
    </div>
  );
}
