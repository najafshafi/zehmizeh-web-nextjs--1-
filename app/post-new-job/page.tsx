"use client";
import React, { Suspense, useState, useEffect } from "react";
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

// Client-side wrapper component
const PostNewJobClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <JobPostingLoading />;
  }

  return <DynamicPostJobClientWrapper />;
};

export default function PostNewJobPage() {
  return (
    <div className="pt-[90px] bg-secondary h-[150vh]">
      <Suspense fallback={<JobPostingLoading />}>
        <PostNewJobClient />
      </Suspense>
    </div>
  );
}
