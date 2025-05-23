"use client";

import { useParams } from "next/navigation";
import ClientJobDetails from "../../ClientJobDetails";

export default function FeedbackPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="pt-[110px] bg-secondary flex flex-col items-center">
      <ClientJobDetails initialTab="feedback" jobId={id} />
    </div>
  );
}
