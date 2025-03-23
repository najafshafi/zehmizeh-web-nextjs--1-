"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the ClientJobDetails component with no SSR
const ClientJobDetails = dynamic(
  () => import("@/app/components/ClientJobDetails"),
  { ssr: false }
);

export default function MessagesPage() {
  const params = useParams();
  const id = params?.id as string;

  return <ClientJobDetails initialTab="messages" jobId={id} />;
}
