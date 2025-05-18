"use client"; // Mark as a Client Component since it uses Redux hooks

import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust path to your store
import Hero from "@/components/hero/Hero";
import HiringProcess from "@/components/hiringprocess/HiringProcess";
import Matches from "@/components/matches/Matches";
import Queries from "@/components/queries/Queries";
import Vision from "@/components/vision/Vision";
import WhyUs from "@/components/whyus/WhyUs";
import { useEffect } from "react";
// Using the newer @tanstack/react-query package
import { useQuery } from "@tanstack/react-query";
import { getHomeCounts } from "@/helpers/http/common";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/forms/Spin/Spinner";

// Add this interface before the Home component
interface CategoryItem {
  id: string;
  name: string;
  count?: number;
  freelancer_count?: number;
  total_freelancers?: number;
  total?: number;
  [key: string]: unknown; // Allow for any other properties that might exist
}

// Loading component for Suspense fallback
const HomeLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <Spinner className="w-8 h-8" />
    <p className="mt-4 text-gray-600">Loading homepage...</p>
  </div>
);

// Dynamic import of the actual Home component
const DynamicHomeContent = dynamic(() => import("./HomeContent"), {
  ssr: false,
  loading: () => <HomeLoading />,
});

// Client-side only wrapper component
const HomeClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <HomeLoading />;
  }

  return <DynamicHomeContent />;
};

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClient />
    </Suspense>
  );
}
