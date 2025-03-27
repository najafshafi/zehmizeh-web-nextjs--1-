"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the ClientJobDetails component with no SSR
const ClientJobDetails = dynamic(
  () => import("@/pages/client-job-details-page/ClientJobDetails"),
  { ssr: false }
);

export default function GenDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return <ClientJobDetails initialTab="gen_details" jobId={id} />;
}
