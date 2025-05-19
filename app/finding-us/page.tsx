"use client";

import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading component
const FindingUsLoading = () => (
  <div className="flex flex-col pt-[110px] justify-center items-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading location information...</p>
  </div>
);

// Dynamically import with no SSR
const DynamicFindingUsWrapper = dynamic(() => import("./FindingUsWrapper"), {
  ssr: false,
  loading: () => <FindingUsLoading />,
});

// Client-side wrapper component
const FindingUsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <FindingUsLoading />;
  }

  return <DynamicFindingUsWrapper />;
};

const FindingUsPage = () => {
  return (
    <div className="flex flex-col pt-[110px]">
      <Suspense fallback={<FindingUsLoading />}>
        <FindingUsClient />
      </Suspense>
    </div>
  );
};

export default FindingUsPage;
