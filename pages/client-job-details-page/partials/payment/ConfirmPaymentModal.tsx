"use client";

import React, { useEffect } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { usePayments } from "@/pages/client-job-details-page/controllers/usePayments";
import { numberWithCommas } from "@/helpers/utils/misc";
import { CONSTANTS } from "@/helpers/const/constants";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useParams } from "next/navigation";
import { TJobDetails } from "@/helpers/types/job.type";
import { VscClose } from "react-icons/vsc";

interface Milestone {
  status: string;
  amount: number;
}

interface Props {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
  isReleasePrompt: boolean;
  buttonText?: string;
}

const ConfirmPaymentModal: React.FC<Props> = ({
  show,
  toggle,
  onConfirm,
  loading,
  isReleasePrompt,
  buttonText,
}) => {
  const params = useParams<{ id: string }>();
  const id = (params?.id as string) || "";
  const data = useQueryData<TJobDetails>(queryKeys.jobDetails(id));
  const { amount, jobType } = usePayments();

  // Body scroll lock effect
  useEffect(() => {
    if (show) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [show]);

  // Add null check and default empty array for milestones
  const clientAcceptedMilestoneAmount = (data?.milestone || []).reduce(
    (sum: number, item: Milestone) => {
      if (item?.status === "paid" || item?.status === "released") {
        return sum + (item?.amount || 0);
      }
      return sum;
    },
    0
  );

  // Add null checks for budget calculations
  const remainingBudget = data?.proposal?.approved_budget?.amount
    ? data.proposal.approved_budget.amount - clientAcceptedMilestoneAmount
    : data?.budget?.amount
    ? data.budget.amount - clientAcceptedMilestoneAmount
    : 0;

  const remainingAmount = `${numberWithCommas(remainingBudget, "USD")}`;
  const isOverBudget = remainingBudget - amount < 0;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={toggle}
        />

        {/* Modal */}
        <div className="relative w-full max-w-[570px] transform rounded-lg bg-white text-left shadow-xl transition-all">
          <div className="relative bg-white px-4 py-8 md:p-12">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 transition-colors cursor-pointer z-10"
              onClick={toggle}
            >
              <VscClose size={24} />
            </button>

            {jobType === "hourly" && (
              <>
                <div className="text-2xl font-normal text-center mb-3">
                  {CONSTANTS.payment.areYouSureAboutThisTransaction}
                </div>
                <div className="text-xl font-normal text-center mb-[0.8rem]">
                  Clicking &quot;Pay&quot; on this submission means{" "}
                  {numberWithCommas(amount, "USD")} (plus ZMZ fee){" "}
                  <span className="inline-block relative">
                    <Tooltip className="ml-1 z-20">
                      <div>
                        <div>When paying with:</div>
                        <div>Credit Card: 4.9%</div>
                        <div>Bank Account: 2.9%</div>
                      </div>
                    </Tooltip>
                  </span>{" "}
                  will be charged from your account. The money will be sent
                  directly to the freelancer and there is no way to undo this.
                </div>
                <div className="text-xl font-normal text-center">
                  Be certain that you&apos;ve checked everything about the work
                  you&apos;re paying for - that all the elements or features are
                  working correctly and that there are no missing parts.
                </div>
              </>
            )}

            {jobType === "fixed" && (
              <>
                <div className="text-2xl font-normal text-center mb-3">
                  {isOverBudget
                    ? CONSTANTS.payment.theMilestoneGoesOverBudget
                    : isReleasePrompt
                    ? CONSTANTS.payment.areYouSureAboutThisDelivery
                    : CONSTANTS.payment.areYouSureAboutThisTransaction}
                </div>
                {isReleasePrompt ? (
                  <>
                    <div className="text-xl font-normal">
                      This will deliver the milestone deposit (
                      {numberWithCommas(amount, "USD")}) directly to the
                      freelancer&apos;s bank account and{" "}
                      <b>there is no way to undo this.</b>
                    </div>
                    <p className="text-xl font-normal mt-2">
                      Delivering this payment also means you are confirming that{" "}
                      <b>
                        the freelancer has completed the services they committed
                        to in this milestone.
                      </b>
                    </p>
                    <p className="text-xl font-normal mt-2">
                      Be certain that you&apos;ve checked everything about the
                      work you&apos;re paying for - that all the elements or
                      features are working correctly and that there are no
                      missing parts.
                    </p>
                  </>
                ) : (
                  <div className="text-lg font-normal">
                    {isOverBudget && (
                      <p className="mb-2">
                        The remaining budget for this project is{" "}
                        <span className="font-bold">{remainingAmount}</span>.
                        <br />
                      </p>
                    )}
                    <p className={isOverBudget ? "mb-2" : ""}>
                      If you accept this milestone,{" "}
                      <span className="font-bold">
                        {numberWithCommas(amount, "USD")}{" "}
                      </span>
                      (plus ZMZ fee)
                      <span className="inline-block relative">
                        <Tooltip className="ml-1 z-20">
                          <div>
                            <div>When paying with:</div>
                            <div>Credit Card: 4.9%</div>
                            <div>Bank Account: 3%</div>
                          </div>
                        </Tooltip>
                      </span>{" "}
                      will be charged to your account. It will be held by ZMZ
                      until you request to have the payment delivered.
                    </p>
                    {isOverBudget && (
                      <p>
                        Accepting this milestone will automatically increase the
                        project&apos;s budget.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="flex flex-col md:flex-row justify-center mt-6 gap-4">
              {isReleasePrompt && (
                <button
                  type="button"
                  className="px-8 py-[0.9rem] text-lg font-normal rounded-full text-gray-800 bg-[#e7e7e7] hover:scale-105 duration-300 transition-transform"
                  onClick={toggle}
                >
                  {CONSTANTS.payment.reviewWorkFirst}
                </button>
              )}
              <button
                type="button"
                className={`px-8 py-[0.9rem] text-lg font-normal rounded-full bg-[#F2B420] text-[#212529] hover:scale-105 duration-300 transition-transform ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onConfirm}
                disabled={loading}
              >
                {buttonText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
