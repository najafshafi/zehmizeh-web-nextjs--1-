"use client";

import React from "react";
import FindingUs from "@/components/findingus/FindingUs";
import { Suspense } from "react";

// Loading component
const FindingUsLoading = () => (
  <div className="flex flex-col pt-[110px] justify-center items-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading location information...</p>
  </div>
);

const FindingUsWrapper: React.FC = () => {
  return (
    <Suspense fallback={<FindingUsLoading />}>
      <FindingUs />
    </Suspense>
  );
};

export default FindingUsWrapper;
