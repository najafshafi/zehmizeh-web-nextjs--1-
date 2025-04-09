"use client";

import React from "react";
import { useParams } from "next/navigation";
// import Navbar from "@/components/navbar/Navbar";
import ClientProfile from "./ClientProfile"; // Ensure the correct import path

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
