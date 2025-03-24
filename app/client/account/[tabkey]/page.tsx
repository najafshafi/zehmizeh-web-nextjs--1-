"use client";

import React from "react";
// import Navbar from "@/components/navbar/Navbar";
import ClientProfile from "@/pages/client-profile/ClientProfile";

interface PageProps {
  params: Promise<{
    tabkey: string;
  }>;
}

// This is a client component that handles the dynamic routing
export default function Page({ params }: PageProps) {
  const resolvedParams = React.use(params);

  return (
    <div>
      <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
        {/* <Navbar /> */}
        <div>
          <ClientProfile currentTab={resolvedParams.tabkey} />
        </div>
      </div>
    </div>
  );
}
