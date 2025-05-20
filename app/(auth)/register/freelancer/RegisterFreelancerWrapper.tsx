"use client";

import React from "react";
import RegisterFreelancerDecider from "@/components/forms/RegisterFreelancerDecider";
import { Suspense } from "react";

// Loading component
const RegisterLoading = () => (
  <div className="flex flex-col w-full items-center justify-center bg-secondary min-h-[70vh] pt-[110px]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading registration form...</p>
  </div>
);

const RegisterFreelancerWrapper: React.FC = () => {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterFreelancerDecider />
    </Suspense>
  );
};

export default RegisterFreelancerWrapper;
