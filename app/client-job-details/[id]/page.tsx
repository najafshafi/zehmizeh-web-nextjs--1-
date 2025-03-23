"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ClientJobDetailsIdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      // Redirect to the gen_details tab by default
      router.push(`/client-job-details/${id}/gen_details`);
    }
  }, [router, id]);

  return <div>Redirecting to job details...</div>;
}
