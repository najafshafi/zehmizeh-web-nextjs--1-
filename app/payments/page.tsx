// "use client";

// import { Suspense, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import Spinner from "@/components/forms/Spin/Spinner";

// // Loading component for Suspense fallback
// const PaymentsLoading = () => (
//   <div className="pt-[110px] bg-secondary flex flex-col items-center justify-center min-h-[70vh]">
//     <Spinner className="w-8 h-8" />
//     <p className="mt-4 text-gray-600">Loading payments...</p>
//   </div>
// );

// // Client component with isClient check to ensure client-side only rendering
// const PaymentsClient = () => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return <PaymentsLoading />;
//   }

//   return <DynamicPaymentsPageWrapper />;
// };

// // Dynamically import with no SSR to prevent useSearchParams errors
// const DynamicPaymentsPageWrapper = dynamic(
//   () => import("./PaymentsPageWrapper"),
//   {
//     ssr: false,
//     loading: () => <PaymentsLoading />,
//   }
// );

// export default function PaymentsPage() {
//   return (
//     <Suspense fallback={<PaymentsLoading />}>
//       <PaymentsClient />
//     </Suspense>
//   );
// }

import React from "react";
import PaymentsWrapper from "./index";

const page = () => {
  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center ">
      <PaymentsWrapper />
    </div>
  );
};

export default page;
