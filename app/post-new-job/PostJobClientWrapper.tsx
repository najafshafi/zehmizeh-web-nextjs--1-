"use client";

import React, { useState, useEffect } from "react";
import Spinner from "@/components/forms/Spin/Spinner";
import NewJob from "./NewJob";

// Loading component for client-side state
const JobPostingLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading job posting form...</p>
  </div>
);

// Client-side only wrapper component
export default function PostJobClientWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <JobPostingLoading />;
  }

  return <NewJob params={{}} />;
}
