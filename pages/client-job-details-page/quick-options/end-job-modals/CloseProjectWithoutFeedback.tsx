"use client";

import { StatusBadge } from "@/components/styled/Badges";
import { endJob, jobClosureRequest } from "@/helpers/http/jobs";
import { useState } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";

interface JobDetails {
  budget?: {
    type: string;
  };
}

interface Props {
  onEndJob: (onlyToggleModal?: boolean) => void;
  jobPostId: string;
  onError: (message: string) => void;
  jobDetails: JobDetails;
}

interface JobClosureRequestBody {
  job_id: string;
}

interface EndJobRequestBody {
  job_id: string;
  status: string;
  reason: string;
  incomplete_description: string;
}

interface ApiResponse {
  status: boolean;
  message?: string;
  response?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const CloseProjectWithoutFeedback = ({
  onEndJob,
  jobPostId,
  onError,
  jobDetails,
}: Props) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const isHourlyBasedProject = jobDetails?.budget?.type === "hourly";

  const handleJobClosureRequest = () => {
    setLoading(true);
    const body: JobClosureRequestBody = {
      job_id: jobPostId,
    };

    toast.loading("Please wait...");
    jobClosureRequest(body)
      .then((res: ApiResponse) => {
        setLoading(false);
        if (res.status) {
          onEndJob();
          toast.success(
            res.response || "Project closure requested successfully"
          );
        } else {
          onError(res.message || "Failed to request project closure");
        }
        toast.dismiss();
      })
      .catch((err: ApiError) => {
        setLoading(false);
        onError(err?.response?.data?.message || "An error occurred");
        toast.dismiss();
      });
  };

  const handleEndJob = () => {
    setLoading(true);
    const body: EndJobRequestBody = {
      job_id: jobPostId,
      status: "in-complete",
      reason: "freelancer hasnt been paid at all",
      incomplete_description: "",
    };
    toast.loading("Please wait...");
    endJob(body)
      .then((res: ApiResponse) => {
        setLoading(false);
        if (res.status) {
          onEndJob();
          toast.success(res.message || "Project closed successfully");
        } else {
          onError(res.message || "Failed to close project");
        }
        toast.dismiss();
      })
      .catch((err: ApiError) => {
        setLoading(false);
        onError(err?.response?.data?.message || "An error occurred");
        toast.dismiss();
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm  bg-black/40 z-50">
      {/* Backdrop
      <div className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"></div> */}
      <div className="w-full max-w-[678px]  px-4 py-8 md:p-12 bg-white rounded-lg relative">
        {/* Close button */}
        <button
          type="button"
          className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 transition-colors"
          onClick={() => onEndJob(true)}
        >
          <VscClose className="h-6 w-6" />
        </button>

        {!isHourlyBasedProject && (
          <div className="absolute top-4 right-4">
            <StatusBadge color="yellow">{step}/2</StatusBadge>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-center text-[28px] font-bold">
              This Project will be marked &apos;Incomplete&apos;
            </div>
            <div className="my-7">
              <div>
                <span>
                  Any project that is closed before the freelancer has been paid
                  is automatically marked as &apos;Incomplete.&apos; Having been
                  part of this project therefore does not contribute to the
                  freelancer&apos;s record on ZMZ.
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={`px-8 py-[0.9rem] text-lg font-normal rounded-full transition-transform duration-200 hover:scale-105 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "bg-[#F2B420] text-[#212529] hover:bg-[#e5a91c]"
                }`}
                disabled={loading}
                onClick={() => {
                  if (isHourlyBasedProject) {
                    handleEndJob();
                  } else {
                    setStep(2);
                  }
                }}
              >
                {isHourlyBasedProject ? "Close Project" : "Continue"}
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center text-[28px] font-bold">
              The Freelancer Has Not Been Paid
            </div>
            <div className="my-7">
              <div className="space-y-4">
                <p>
                  The freelancer has not been paid for any milestones on this
                  project.
                </p>
                <p>
                  Therefore, they will have to agree to the project closure
                  before the project is closed. They&apos;ll receive a
                  notification of this closure request.
                </p>
                <p>
                  Until the project is closed, you&apos;ll still be able to
                  communicate with them through the Messages tab.
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-4">
              <div>
                <button
                  type="button"
                  className={`px-8 py-3 text-base font-normal rounded-full transition-transform duration-200 hover:scale-105 border-2 border-gray-800 text-gray-800 hover:bg-gray-100 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                  onClick={() => onEndJob(true)}
                >
                  Keep Project Open
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className={`px-8 py-[0.9rem] text-lg font-normal rounded-full transition-transform duration-200 hover:scale-105 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-[#F2B420] text-[#212529] hover:bg-[#e5a91c]"
                  }`}
                  disabled={loading}
                  onClick={handleJobClosureRequest}
                >
                  Accept - Request to Close Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
