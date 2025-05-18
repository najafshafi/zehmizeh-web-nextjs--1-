"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { SearchFilterProvider } from "@/helpers/contexts/search-filter-context";
import Spinner from "@/components/forms/Spin/Spinner";

// Loading component for Suspense fallback
const SearchLoading = () => (
  <div className="pt-[90px] flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading search results...</p>
  </div>
);

// Dynamically import the Search component with no SSR
const DynamicSearch = dynamic(() => import("./Search"), {
  ssr: false,
  loading: () => <SearchLoading />,
});

export default function SearchPageWrapper() {
  return (
    <div className="pt-[90px]">
      <SearchFilterProvider>
        <Suspense fallback={<SearchLoading />}>
          <DynamicSearch />
        </Suspense>
      </SearchFilterProvider>
    </div>
  );
}
