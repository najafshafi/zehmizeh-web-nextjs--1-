'use client';

import JobDetails from '@/pages/job-details-page/JobDetails';

export default function MilestonePage({ params }: { params: { jobId: string } }) {
  return<div className="pt-[90px] bg-secondary flex flex-col items-center">
  <JobDetails />
</div>;
} 