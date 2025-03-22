"use client";

import MessagingPage from "@/pages/messaging-page";
import { Suspense } from "react";

export default function Messages() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagingPage />
    </Suspense>
  );
}
