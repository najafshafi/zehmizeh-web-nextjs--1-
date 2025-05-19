"use client";

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const SearchLoading = () => (
  <div className="pt-[90px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading search results...</p>
  </div>
);

// Dynamically import with no SSR to prevent useSearchParams errors
const DynamicSearchPageWrapper = dynamic(() => import("./SearchPageWrapper"), {
  ssr: false,
  loading: () => <SearchLoading />
});

// Client-side only wrapper component
const SearchClient = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <SearchLoading />;
  }
  
  return <DynamicSearchPageWrapper />;
};

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchClient />
    </Suspense>
  );
}
