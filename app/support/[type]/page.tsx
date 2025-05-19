"use client";

import React from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component
const SupportLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading support...</p>
  </div>
);

// Dynamic import without SSR
const SupportNoSSR = dynamic(() => import("../Support"), {
  ssr: false,
  loading: () => <SupportLoading />,
});

export default function SupportTypePage() {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <SupportNoSSR />
    </div>
  );
}
