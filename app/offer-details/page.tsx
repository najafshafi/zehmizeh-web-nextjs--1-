"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function OfferDetailsPage() {
  const router = useRouter();

  // Use React's useEffect to perform client-side navigation
  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="pt-[110px] flex justify-center items-center min-h-[70vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-3 text-gray-600">Redirecting...</p>
    </div>
  );
}
