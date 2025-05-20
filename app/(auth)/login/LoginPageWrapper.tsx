"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const LoginLoading = () => (
  <div className="flex flex-col w-full items-center justify-center bg-secondary min-h-[70vh] pt-[110px]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading login form...</p>
  </div>
);

// Dynamically import the LoginForm component with no SSR
const DynamicLoginForm = dynamic(() => import("@/components/forms/LoginForm"), {
  ssr: false,
  loading: () => <LoginLoading />,
});

export default function LoginPageWrapper() {
  return (
    <div className="flex flex-col w-full items-center bg-secondary min-h-[140vh]">
      <Suspense fallback={<LoginLoading />}>
        <DynamicLoginForm />
      </Suspense>
    </div>
  );
}
