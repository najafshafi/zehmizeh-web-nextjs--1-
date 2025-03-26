"use client";

import { budgetChangeSeenDeniedModal } from "@/helpers/http/proposals";
import { TapiResponse } from "@/helpers/types/apiRequestResponse";
import { TJobDetails } from "@/helpers/types/job.type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";

interface Props {
  jobDetails: TJobDetails;
  refetch: () => void;
  userType: "client" | "freelancer";
}

export const ChangeBudgetDeniedModal = ({
  jobDetails,
  refetch,
  userType,
}: Props) => {
  const jobTypeText =
    jobDetails.proposal.approved_budget.type === "fixed"
      ? "budget"
      : "hourly rate";

  /*
      1. is_seen_denied_modal is 0 so user hasn't already seen denied modal
      2. budget change status is denied
      3. user who requested budget change should be same as current user
      */
  const shouldShowModal =
    jobDetails?.proposal?.budget_change?.is_seen_denied_modal === 0 &&
    jobDetails?.proposal?.budget_change?.status === "denied" &&
    jobDetails?.proposal?.budget_change?.requested_by === userType;

  const [isLoading, setIsLoading] = useState(false);

  // Add scroll lock effect
  useEffect(() => {
    if (shouldShowModal) {
      // Store the current scroll position and body padding
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const bodyPadding =
        parseInt(window.getComputedStyle(document.body).paddingRight) || 0;

      // Prevent body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;

      return () => {
        // Restore body scroll
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [shouldShowModal]);

  // budget seen flag change and refetch jobdetails
  const apiCalls = async () => {
    const res = await budgetChangeSeenDeniedModal({
      job_post_id: jobDetails.job_post_id,
      is_seen_denied_modal: 1,
    });
    await refetch();
    return res;
  };

  // call api
  const handleOkay = () => {
    setIsLoading(true);
    toast.promise(apiCalls(), {
      loading: "Please wait...",
      success: (res: TapiResponse<unknown>) => {
        setIsLoading(false);
        return res?.message;
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const textContent =
    userType === "client"
      ? `Your freelancer has declined your ${jobTypeText} decrease request.`
      : `Your client has declined your ${jobTypeText} increase request.`;

  if (!shouldShowModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-[800px] mx-4 bg-white rounded-xl py-8 px-4 md:p-12">
        <button
          type="button"
          className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:text-gray-700 transition-colors"
          onClick={handleOkay}
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-normal mb-6">
            {textContent}
          </h2>
          <button
            type="button"
            onClick={handleOkay}
            disabled={isLoading}
            className="px-8 py-3 text-base font-medium bg-[#F2B420] text-[#212529] rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
