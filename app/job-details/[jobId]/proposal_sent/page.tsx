'use client';

import JobDetails from '@/pages/job-details-page/JobDetails';

export default function ProposalSentPage({ params }: { params: { jobId: string } }) {
  return <JobDetails />;
}
