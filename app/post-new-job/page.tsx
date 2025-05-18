"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading fallback component for Suspense
const JobPostingLoading = () => (
  <div className="pt-[90px] bg-secondary flex flex-col items-center justify-center min-h-[50vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading job posting form...</p>
  </div>
);

// Dynamically import the client-side wrapper with no SSR
const DynamicPostJobClientWrapper = dynamic(
  () => import("./PostJobClientWrapper"),
  {
    ssr: false,
    loading: () => <JobPostingLoading />,
  }
);

export default function PostNewJobPage() {
  return (
    <div className="pt-[90px] bg-secondary h-[150vh]">
      <Suspense fallback={<JobPostingLoading />}>
        <DynamicPostJobClientWrapper />
      </Suspense>
    </div>
  );
}
