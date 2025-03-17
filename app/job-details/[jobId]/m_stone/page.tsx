'use client';

import JobDetails from '@/pages/job-details-page/JobDetails';

export default function MilestonePage({ params }: { params: { jobId: string } }) {
  return <JobDetails />;
} 