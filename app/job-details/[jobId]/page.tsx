"use client";

import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

interface PageParams {
  jobId: string;
}

export default function JobDetailsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const router = useRouter();
  const { jobId } = use(params);

  useEffect(() => {
    router.replace(`/job-details/${jobId}/gen_details`);
  }, [jobId, router]);

  return null;
}
