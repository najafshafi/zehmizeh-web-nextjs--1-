"use client";

import MessagingPage from "@/components/messaging-page";
import { Suspense } from "react";

export default function Messages() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagingPage />
    </Suspense>
  );
}
