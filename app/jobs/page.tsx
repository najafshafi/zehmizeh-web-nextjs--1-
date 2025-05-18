"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const JobsLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading jobs...</p>
  </div>
);

// Dynamically import Jobs with no SSR
const DynamicJobs = dynamic(() => import("./Jobs"), {
  ssr: false,
  loading: () => <JobsLoading />,
});

export default function JobsPage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <Suspense fallback={<JobsLoading />}>
        <DynamicJobs />
      </Suspense>
    </div>
  );
}
