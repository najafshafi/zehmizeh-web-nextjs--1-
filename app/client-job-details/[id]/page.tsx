"use client";
import React from "react";
import ClientJobDetails from "@/pages/client-job-details-page/ClientJobDetails";
import { useParams } from "next/navigation";

const ClientJobDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className=" pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails jobId={id} />
    </div>
  );
};

export default ClientJobDetailsPage;
