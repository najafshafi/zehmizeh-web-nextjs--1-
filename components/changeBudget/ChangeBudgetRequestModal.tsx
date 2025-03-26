"use client";

import { useRefetch } from "@/helpers/hooks/useQueryData";
import { budgetChangeAcceptOrDenied } from "@/helpers/http/proposals";
import { TapiResponse } from "@/helpers/types/apiRequestResponse";
import { TJobDetails } from "@/helpers/types/job.type";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";

interface Props {
  jobDetails: TJobDetails;
  userType: "client" | "freelancer";
}

interface ButtonConfig {
  text: string;
  variant: "primary" | "secondary";
  onClick: () => void;
}

interface TextContent {
  buttons: ButtonConfig[];
  header: string;
  contentText: string;
}

export const ChangeBudgetRequestModal = ({ jobDetails, userType }: Props) => {
  const jobTypeText =
    jobDetails.proposal.approved_budget.type === "fixed"
      ? "budget"
      : "hourly rate";

  const { refetch } = useRefetch(queryKeys.jobDetails(jobDetails.job_post_id));
  const [loading, setLoading] = useState<boolean>(false);

  const shouldShowModal = useMemo(() => {
    let isCorrectUser = false;
    if (jobDetails?.proposal?.budget_change?.requested_by === "client")
      isCorrectUser = userType === "freelancer";
    if (jobDetails?.proposal?.budget_change?.requested_by === "freelancer")
      isCorrectUser = userType === "client";

    return (
      jobDetails.proposal.budget_change.status === "pending" && isCorrectUser
    );
  }, [
    jobDetails?.proposal?.budget_change?.requested_by,
    jobDetails?.proposal?.budget_change?.status,
    userType,
  ]);

  const apiCall = async (isAccepted: boolean) => {
    const res = await budgetChangeAcceptOrDenied({
      job_post_id: jobDetails.job_post_id,
      status: isAccepted ? "accepted" : "denied",
    });
    await refetch();
    return res;
  };

  const handleSubmit = (isAccepted: boolean) => {
    setLoading(true);

    toast.promise(apiCall(isAccepted), {
      loading: "Please wait...",
      success: (res: TapiResponse<unknown>) => {
        setLoading(false);
        return res?.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const textContent = useMemo((): TextContent => {
    let buttons: ButtonConfig[] = [];
    let header = "";
    let contentText = "";

    if (userType === "client") {
      header = `Your Freelancer is Requesting a ${jobTypeText} Increase`;
      contentText = `Your freelancer has requested the project's ${jobTypeText} be raised from <b>$${jobDetails.proposal.approved_budget.amount}</b> to <b>$${jobDetails.proposal.budget_change.amount}</b>.<br/>If you agree to this ${jobTypeText}, click the 'Accept Increase' button
              below.<br/>If you do not want to increase for now, click the 'Decline' button
              below.`;
      buttons = [
        {
          text: "Decline",
          onClick: () => handleSubmit(false),
          variant: "secondary",
        },
        {
          text: "Accept Increase",
          onClick: () => handleSubmit(true),
          variant: "primary",
        },
      ];
    }
    if (userType === "freelancer") {
      header = `Your Client is Requesting a ${jobTypeText} Decrease`;
      contentText = `Your client has requested the project's ${jobTypeText} be reduced from <b>$${jobDetails.proposal.approved_budget.amount}</b> to <b>$${jobDetails.proposal.budget_change.amount}</b> \nIf you agree to this ${jobTypeText}, click the 'Accept Decrease' button
              below.\nIf you do not want to decrease for now, click the 'Decline' button
              below.`;
      buttons = [
        {
          text: "Decline",
          onClick: () => handleSubmit(false),
          variant: "secondary",
        },
        {
          text: "Accept Decrease",
          onClick: () => handleSubmit(true),
          variant: "primary",
        },
      ];
    }
    return { buttons, header, contentText };
  }, [
    jobDetails?.proposal?.approved_budget?.amount,
    jobDetails?.proposal?.budget_change?.amount,
    jobTypeText,
    userType,
  ]);

  if (!shouldShowModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={() => handleSubmit(false)}
      />
      <div className="relative bg-white rounded-xl w-full max-w-[600px] mx-4 p-6 md:p-8">
        <button
          type="button"
          className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={() => handleSubmit(false)}
          aria-label="Close modal"
        >
          <VscClose size={24} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-normal text-center mb-6">
            {textContent.header}
          </h2>

          <div className="text-base md:text-lg text-center mb-8">
            <p dangerouslySetInnerHTML={{ __html: textContent.contentText }} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {textContent.buttons.map(({ onClick, text, variant }) => (
              <button
                key={text}
                type="button"
                disabled={loading}
                onClick={onClick}
                className={`px-8 py-3 text-base font-normal rounded-full transition-all duration-200 disabled:opacity-50 ${
                  variant === "primary"
                    ? "bg-[#F2B420] text-[#212529] hover:scale-105"
                    : "border-2 border-gray-800 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
