"use client";

import { useParams } from "next/navigation";
import ClientJobDetails from "../../ClientJobDetails";

export default function MessagesPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails initialTab="messages" jobId={id} />
    </div>
  );
}
