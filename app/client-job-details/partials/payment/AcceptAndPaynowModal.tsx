"use client";

import React, { useEffect } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { CONSTANTS } from "@/helpers/const/constants";
import { numberWithCommas } from "@/helpers/utils/misc";
import { usePayments } from "../../controllers/usePayments";
import { useQueryData } from "@/helpers/hooks/useQueryData";
import { TJobDetails } from "@/helpers/types/job.type";
import { queryKeys } from "@/helpers/const/queryKeys";
import { useParams } from "next/navigation";
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  toggle: () => void;
  handlePayment: () => void;
}

interface Milestone {
  status: string;
  amount: number;
}

export const AcceptAndPaynowModal: React.FC<Props> = ({
  show,
  toggle,
  handlePayment,
}) => {
  const params = useParams<{ id: string }>();
  const id = (params?.id as string) || "";
  const { amount } = usePayments();
  const data = useQueryData<TJobDetails>(queryKeys.jobDetails(id));

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


  const clientAcceptedMilestoneAmount =
    data?.milestone?.reduce((sum: number, item: Milestone) => {
      if (item.status === "paid" || item.status === "released") {
        return sum + item.amount;

      }
      return sum;
    },
    0
  );

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
        <div className="relative w-full max-w-[570px] transform  rounded-lg bg-white text-left shadow-xl transition-all">
          <div className="relative bg-white px-4 py-8 md:p-12">
            {/* Close button */}
            <VscClose
              className="absolute top-4 md:top-0 right-4  md:-right-12 z-50 text-2xl text-black md:text-white hover:text-gray-100 cursor-pointer"
              onClick={toggle}
            />

            <div className="text-2xl font-normal text-center mb-3">
              {CONSTANTS.payment.areYouSureAboutThisTransaction}
            </div>
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
                  {numberWithCommas(amount, "USD")}
                </span>{" "}
                (plus ZMZ fee)
                <span className="inline-block relative">
                  <Tooltip className="ml-1 z-50">
                    <div>
                      <div>When paying with:</div>
                      <div>Credit Card: 4.9%</div>
                      <div>Bank Account: 3%</div>
                    </div>
                  </Tooltip>
                </span>{" "}
                will be charged to your account and it will be sent directly to
                freelancer&apos;s account. Because{" "}
                <b>there is no way to undo this</b>, we recommend using
                &apos;Send Payment&apos; only{" "}
                <b>after the freelancer has submitted work.</b>
                <br />
                <p className="mt-4">
                  Be certain that you&apos;ve checked everything about the work
                  you&apos;re paying for - that all the elements or features are
                  working correctly and that there are no missing parts.
                </p>
              </p>
              {isOverBudget && (
                <p>
                  Accepting this milestone will automatically increase the
                  project&apos;s budget.
                </p>
              )}
            </div>
            <div className="flex flex-row items-center justify-center gap-5 mt-6">
              <button
                type="button"
                className="px-8 py-[0.9rem] text-lg font-normal rounded-full text-gray-800 bg-[#e7e7e7] hover:scale-105 duration-300 transition-transform"
                onClick={toggle}
              >
                I&apos;ll Review the Work First
              </button>
              <button
                type="button"
                className="px-8 py-[0.9rem] text-lg font-normal rounded-full bg-[#F2B420] text-[#212529] hover:scale-105 duration-300 transition-transform"
                onClick={handlePayment}
              >
                Send Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
