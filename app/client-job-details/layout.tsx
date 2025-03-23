"use client";

import React from "react";

export default function ClientJobDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="client-job-details-layout pt-[90px] bg-secondary flex flex-col items-center">
      {children}
    </div>
  );
}
