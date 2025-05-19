"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const FaqLoading = () => (
  <div className="pt-[110px] flex justify-center items-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-3 text-gray-600">Loading FAQ...</p>
  </div>
);

// Dynamically import FaqClientWrapper with no SSR
const DynamicFaqClientWrapper = dynamic(() => import("./FaqClientWrapper"), {
  ssr: false,
  loading: () => <FaqLoading />,
});

export default function SupportFaqPage() {
  return (
    <Suspense fallback={<FaqLoading />}>
      <DynamicFaqClientWrapper />
    </Suspense>
  );
}
