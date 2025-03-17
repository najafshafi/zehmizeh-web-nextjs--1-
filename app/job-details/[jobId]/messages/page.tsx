'use client';

import JobDetails from '@/pages/job-details-page/JobDetails';

export default function MessagesPage({ params }: { params: { jobId: string } }) {
  return <JobDetails />;
} 