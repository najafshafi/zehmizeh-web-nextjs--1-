'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function JobDetailsPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const { jobId } = params;

  useEffect(() => {
    router.replace(`/job-details/${jobId}/gen_details`);
  }, [jobId, router]);

  return null;
} 