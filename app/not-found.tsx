"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Loading component
const NotFoundLoading = () => (
  <div className="h-screen flex justify-center items-center flex-col">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
);

// Dynamically import 404 component with no SSR
const Dynamic404 = dynamic(() => import("./NotFoundContent"), {
  ssr: false,
  loading: () => <NotFoundLoading />,
});

// Client-side only wrapper component
const NotFoundClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <NotFoundLoading />;
  }

  return <Dynamic404 />;
};

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundLoading />}>
      <NotFoundClient />
    </Suspense>
  );
}
