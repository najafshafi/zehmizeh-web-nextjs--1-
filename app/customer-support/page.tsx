"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar/Navbar";

// Loading component
const ContactUsLoading = () => (
  <div className="pt-[110px] flex justify-center items-center min-h-[70vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-3 text-gray-600">Loading customer support page...</p>
  </div>
);

// Dynamically import with no SSR
const DynamicContactUs = dynamic(
  () => import("@/components/contact-us/ContactUS"),
  {
    ssr: false,
    loading: () => <ContactUsLoading />,
  }
);

// Client-side wrapper component
const CustomerSupportClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <ContactUsLoading />;
  }

  return <DynamicContactUs />;
};

const CustomerSupportPage = () => {
  return (
    <div className="flex flex-col pt-[110px]">
      <Suspense fallback={<ContactUsLoading />}>
        <CustomerSupportClient />
      </Suspense>
    </div>
  );
};

export default CustomerSupportPage;
