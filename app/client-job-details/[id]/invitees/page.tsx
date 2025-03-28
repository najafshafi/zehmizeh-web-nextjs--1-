"use client";

import { useParams } from "next/navigation";
import ClientJobDetails from "@/pages/client-job-details-page/ClientJobDetails";

export default function InviteesPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className=" pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails initialTab="invitees" jobId={id} />
    </div>
  );
}
