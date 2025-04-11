"use client";

import React from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
// import Navbar from "@/components/navbar/Navbar";

// Dynamically import ClientProfile with SSR disabled
const ClientProfile = dynamic(() => import("./ClientProfile"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
      <Loader />
    </div>
  ),
});

export default function Page() {
  const params = useParams(); // Next.js way to access dynamic params

  return (
    <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
      {/* <Navbar /> */}
      <div>
        <ClientProfile currentTab={params?.tabkey as string} />
      </div>
    </div>
  );
}
