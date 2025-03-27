"use client";

import { useEffect, useState } from "react";
import CustomButton from "@/components/custombutton/CustomButton";
import Checkbox from "@/components/forms/CheckBox";
import { CONSTANTS } from "@/helpers/const/constants";
import { VscClose } from "react-icons/vsc";

interface Milestone {
  title: string;
  description: string;
  is_final_milestone: number;
  hourly_id?: string;
  milestone_id?: string;
  hourly_status?: string;
  status?: string;
  [key: string]: string | number | undefined;
}

interface JobDetails {
  jobType: string;
}

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedMilestones: Milestone[];
  setSelectedMilestones: (milestones: Milestone[]) => void;
  milestones: Milestone[];
  jobdetails: JobDetails;
  askForConfirmation: (type: "PAY_NOW" | "DEPOSIT") => () => void;
}

export const MilestoneListModal = ({
  show = false,
  setShow,
  setSelectedMilestones,
  selectedMilestones,
  milestones,
  jobdetails,
  askForConfirmation,
}: Props) => {
  const job_status: string =
    jobdetails?.jobType === "hourly" ? "hourly_status" : "status";
  const pendingMilestones = milestones.filter(
    (mil) => mil[job_status] === "pending"
  );
  const [checkValues, setCheckValues] = useState<boolean[]>(
    Array(pendingMilestones?.length).fill(false)
  );
  const [checkAllValue, setCheckAllValue] = useState<boolean>(false);

  // Add body scroll lock effect
  useEffect(() => {
    if (show) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Cleanup function
      return () => {
        // Restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [show]);

  const selectAllHandler = (checked: boolean) => {
    setCheckValues(() => Array(pendingMilestones?.length).fill(checked));
    setSelectedMilestones(checked ? pendingMilestones : []);
    setCheckAllValue(checked);
  };

  const toggleHandler = (
    check: boolean,
    milestone: Milestone,
    index: number
  ) => {
    setCheckValues((checkValues) =>
      checkValues.map((checkArrVal, ind) =>
        ind === index ? check : checkArrVal
      )
    );
    if (check) return setSelectedMilestones([...selectedMilestones, milestone]);

    const milestone_id_flag =
      jobdetails?.jobType === "hourly" ? "hourly_id" : "milestone_id";
    return setSelectedMilestones(
      selectedMilestones.filter(
        (mil) => mil[milestone_id_flag] !== milestone[milestone_id_flag]
      )
    );
  };

  useEffect(() => {
    setCheckAllValue(!checkValues.includes(false));
  }, [checkValues]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShow(false)}
        />

        {/* Modal */}
        <div className="relative w-full max-w-[800px] transform overflow-hidden rounded-lg bg-white  py-8 px-4 md:p-12 text-left shadow-xl transition-all">
          <VscClose
            className="absolute right-4 top-4 lg:top-0 lg:-right-8 lg:text-white text-gray-400 hover:text-gray-500 transition-colors z-50"
            onClick={() => setShow(false)}
          />

          <div className="text-center sm:text-left">
            <h4
              className="text-2xl text-gray-900"
              style={{ fontWeight: "500" }}
            >
              {jobdetails?.jobType === "hourly"
                ? CONSTANTS.job.selectSubmissionsYoureReadyToPayFor
                : `Select any milestone proposals that you're ready to accept and make deposits for:`}
            </h4>

            {pendingMilestones?.map((milestone, index: number) => {
              if (
                jobdetails?.jobType === "hourly" &&
                milestone?.is_final_milestone
              )
                return null;
              return (
                <div key={`milestone-group-${index}`}>
                  {index === 0 && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        <Checkbox
                          checked={checkAllValue}
                          toggle={(e: React.ChangeEvent<HTMLInputElement>) =>
                            selectAllHandler(e.target.checked)
                          }
                        />
                        <span className="ml-3 text-gray-700">Select All</span>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 rounded-lg border border-gray-200 p-6">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Checkbox
                          checked={checkValues[index]}
                          toggle={(e: React.ChangeEvent<HTMLInputElement>) =>
                            toggleHandler(e.target.checked, milestone, index)
                          }
                        />
                        <span className="ml-2 font-semibold text-gray-900">
                          {milestone.title}
                        </span>
                      </div>
                      <div
                        className="mt-2 text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: milestone.description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-6 flex items-center justify-end gap-5">
              {jobdetails?.jobType !== "hourly" && (
                <CustomButton
                  text="Accept & Pay Now"
                  className="px-8 py-[0.9rem] text-lg font-normal bg-[#167347] text-white rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedMilestones.length === 0}
                  onClick={askForConfirmation("PAY_NOW")}
                />
              )}

              <CustomButton
                text={
                  jobdetails?.jobType === "hourly" ? "Pay" : "Accept & Deposit"
                }
                className="px-8 py-[0.9rem] text-lg font-normal bg-[#F2B420] text-[#212529] rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedMilestones.length === 0}
                onClick={askForConfirmation("DEPOSIT")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
