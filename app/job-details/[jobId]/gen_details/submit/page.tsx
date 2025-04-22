"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import toast from "react-hot-toast";

import SubmitProposalModal from "@/components/jobs/SubmitProposalModal";
import { getJobDetails } from "@/helpers/http/jobs";
import Spinner from "@/components/forms/Spin/Spinner";

export default function SubmitProposalPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;

  const [showModal, setShowModal] = useState(true);

  // Fetch job data
  const {
    data: jobData,
    isLoading,
    error,
  } = useQuery(["job-details", jobId], () => getJobDetails(jobId), {
    enabled: !!jobId,
    retry: 1,
    onError: (err: any) => {
      toast.error(err?.message || "Failed to load job details");
      router.back();
    },
  });

  // Handle modal close
  const handleToggle = () => {
    setShowModal(false);
    router.back();
  };

  // Handle successful proposal submission
  const handleSubmitProposal = () => {
    setShowModal(false);
    router.back();
  };

  // If job data failed to load, don't render the modal
  if (error) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner loadingText="Loading job details..." />
        </div>
      ) : jobData?.data ? (
        <SubmitProposalModal
          show={showModal}
          toggle={handleToggle}
          data={jobData.data}
          onSubmitProposal={handleSubmitProposal}
        />
      ) : null}
    </div>
  );
}
