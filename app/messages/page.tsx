"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Loading component for Suspense fallback
const MessagesLoading = () => (
  <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Loading messages...</p>
  </div>
);

// Dynamically import MessagingPage with no SSR
const DynamicMessagingPage = dynamic(
  () => import("@/components/messaging-page"),
  {
    ssr: false,
    loading: () => <MessagesLoading />,
  }
);

export default function Messages() {
  return (
    <Suspense fallback={<MessagesLoading />}>
      <DynamicMessagingPage />
    </Suspense>
  );
}
