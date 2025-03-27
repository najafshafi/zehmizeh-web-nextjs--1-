// "use client";

// import { useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Loader from "@/components/Loader";

// export default function ClientJobDetailsIdPage() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params?.id as string;

//   useEffect(() => {
//     if (id) {
//       // Redirect to the gen_details tab by default
//       router.push(`/client-job-details/${id}/gen_details`);
//     }
//   }, [router, id]);

//   return (
//     <div className="flex mt-[110px] justify-center items-center h-[calc(100vh-110px)] w-full bg-secondary">
//       <Loader />
//     </div>
//   );
// }
"use client";
import React from "react";
import ClientJobDetails from "@/pages/client-job-details-page/ClientJobDetails";
import { useParams } from "next/navigation";

const ClientJobDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="pt-[90px] bg-secondary flex flex-col items-center">
      <ClientJobDetails jobId={id} />
    </div>
  );
};

export default ClientJobDetailsPage;
