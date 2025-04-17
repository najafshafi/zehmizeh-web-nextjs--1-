"use client";

import { useParams } from "next/navigation";
import ClientJobDetails from "../../../ClientJobDetails";

export default function InviteeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const inviteId = params?.inviteId as string;

  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails
        initialTab="invitees"
        jobId={id}
        selectedInviteId={inviteId}
      />
    </div>
  );
}
