"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for loading state
const SupportLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading support...</p>
  </div>
);

// Dynamically import the Support component with no SSR
const DynamicSupport = dynamic(() => import("../Support"), {
  ssr: false,
  loading: () => <SupportLoading />,
});

// Client-side wrapper component
export default function SupportClientWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <SupportLoading />;
  }

  return <DynamicSupport />;
}
