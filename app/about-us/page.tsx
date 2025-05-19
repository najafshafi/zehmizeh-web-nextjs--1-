"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const AboutUsLoading = () => (
  <div className="pt-[110px] flex justify-center items-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-3 text-gray-600">Loading about us page...</p>
  </div>
);

// Dynamically import AboutUs component with no SSR
const DynamicAboutUs = dynamic(() => import("@/components/aboutus/AboutUs"), {
  ssr: false,
  loading: () => <AboutUsLoading />,
});

const AboutUsPage = () => {
  return (
    <div className="pt-[110px] flex flex-col">
      <Suspense fallback={<AboutUsLoading />}>
        <DynamicAboutUs />
      </Suspense>
    </div>
  );
};

export default AboutUsPage;
