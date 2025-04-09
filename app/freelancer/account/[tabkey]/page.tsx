"use client";

import React from "react";
// import Navbar from "@/components/navbar/Navbar";
import FreelancerProfileSettings from "./FreelancerProfileSettings";

// This is a client component that handles the dynamic routing
export default function Page() {
  return (
    <div>
      <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
        {/* <Navbar /> */}
        <div>
          <FreelancerProfileSettings />
        </div>
      </div>
    </div>
  );
}
