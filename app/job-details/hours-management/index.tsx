/*
 * This is the the main component that displays the list of hourly submissions
 */

import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/styled/Badges";
import StripeCompleteWarning from "@/components/jobs/StripeCompleteWarning";
import NoDataFound from "@/components/ui/NoDataFound";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import AddHoursForm from "./AddHoursForm";
import MoreButton from "./MoreButton";
import {
  changeStatusDisplayFormat,
  convertToTitleCase,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageHours } from "@/helpers/http/jobs";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import classNames from "classnames";
import { paymentProcessingStatusHandler } from "@/helpers/validation/common";
import Link from "next/link";

interface HourlyStatus {
  color: string;
}

interface StatusMap {
  paid: HourlyStatus;
  under_dispute: HourlyStatus;
  decline: HourlyStatus;
  declined: HourlyStatus;
  payment_processing: HourlyStatus;
  cancelled: HourlyStatus;
  decline_dispute: HourlyStatus;
  [key: string]: HourlyStatus | undefined;
}

const STATUS: StatusMap = {
  paid: {
    color: "green",
  },
  under_dispute: {
    color: "darkPink",
  },
  decline: {
    color: "darkPink",
  },
  declined: {
    color: "darkPink",
  },
  payment_processing: {
    color: "yellow",
  },
  cancelled: {
    color: "darkPink",
  },
  decline_dispute: {
    color: "darkPink",
  },
};

interface Milestone {
  milestone_id: string | number;
  hourly_status: string;
  is_final_milestone: boolean;
  title: string;
  hourly_id: string;
  dispute_submitted_by?: "CLIENT" | "FREELANCER";
  is_paid?: number;
  payment_method?: "ACH" | "OTHER" | string;
  date_created?: string;
  cancelled_date?: string;
  paid_date?: string;
  description: string;
  attachments?: string;
  total_amount: number;
}

interface HoursManagementProps {
  milestone: Milestone[];
  refetch: () => void;
  jobPostId: string;
  hourlyRate: number;
}

const HoursManagement = ({
  milestone,
  refetch,
  jobPostId,
  hourlyRate,
}: HoursManagementProps) => {
  const [showMilestoneForm, setShowMilestoneForm] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const toggleMilestoneForm = () => {
    setShowMilestoneForm(!showMilestoneForm);
  };
  const [stripeWarningModalState, setStripeModalWarningState] = useState<any>({
    show: false,
    stripeStatus: "",
  });

  const onDelete = (hourlyId: string) => {
    // Delete hours api call

    const body = {
      action: "delete_hours",
      hourly_id: hourlyId,
    };
    const promise = manageHours(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        refetch();
        return res.response;
      },
      error: (err) => {
        return err?.response?.data?.message || "error";
      },
    });
  };

  const handleEdit = (item: any) => {
    // On click of edit hours

    setSelectedMilestone(item);
    toggleMilestoneForm();
  };

  const onSubmit = () => {
    setSelectedMilestone(null);
    refetch();
  };

  const closeStripeModal = () => {
    setStripeModalWarningState({
      show: false,
      stripeStatus: "",
    });
  };

  return (
    <div className="mx-auto mt-10 w-[816px] max-w-full">
      {milestone?.length == 0 && (
        <div>
          <NoDataFound className="pb-2" />
          <p className="mt-4 text-center">
            Check{" "}
            <Link
              href="/support/faq/working_a_project"
              className="text-yellow-500"
            >
              Working a Project FAQs
            </Link>{" "}
            section for more information
          </p>
        </div>
      )}
      {milestone?.length > 0 &&
        milestone?.map((item: Milestone, index: number) => (
          <div
            key={item.milestone_id}
            className="mt-6 flex flex-col gap-2 rounded-[1.25rem] bg-white p-7 shadow-[0px_4px_74px_rgba(0,0,0,0.04)]"
            data-hourly-status={item.hourly_status}
          >
            <div>
              <div className="flex justify-between gap-3">
                <div
                  className={classNames(
                    "heading text-xl font-normal first-letter:capitalize",
                    {
                      "mb-3": item.is_final_milestone,
                    }
                  )}
                >
                  {item.is_final_milestone
                    ? "Final Submission"
                    : "Submission " + ++index}
                  : {convertToTitleCase(item.title)}
                </div>
                {item.hourly_status === "pending" ? (
                  !item.is_final_milestone ? (
                    <MoreButton
                      onDelete={() => onDelete(item.hourly_id)}
                      handleEdit={() => handleEdit(item)}
                    />
                  ) : null
                ) : (
                  <div>
                    <StatusBadge
                      color={STATUS[item.hourly_status]?.color || "green"}
                    >
                      {["decline_dispute"].includes(item.hourly_status) &&
                      item?.dispute_submitted_by === "CLIENT"
                        ? "Closed by Client"
                        : ["decline_dispute"].includes(item.hourly_status) &&
                            item?.dispute_submitted_by === "FREELANCER"
                          ? "Canceled"
                          : ["decline", "declined"].includes(item.hourly_status)
                            ? "Declined"
                            : ["cancelled"].includes(item.hourly_status) &&
                                item?.is_paid === 0
                              ? "Canceled by Freelancer"
                              : item.hourly_status === "payment_processing"
                                ? paymentProcessingStatusHandler(
                                    item?.payment_method as "ACH" | "OTHER"
                                  )
                                : changeStatusDisplayFormat(
                                    item.hourly_status,
                                    "_"
                                  )}
                    </StatusBadge>
                  </div>
                )}
              </div>
              <div
                className={classNames(
                  "flex flex-col justify-between gap-2 md:flex-row md:items-end",
                  {
                    "mt-3": item.hourly_status !== "pending",
                  }
                )}
              >
                <h4 className="text-3xl font-normal">
                  {numberWithCommas(item.total_amount, "USD")}
                </h4>

                <div>
                  {!!item.date_created && (
                    <div className="text-lg font-normal">
                      Submitted on{" "}
                      {item.date_created
                        ? moment(item.date_created).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                  {!!item.cancelled_date && (
                    <div className="text-lg font-normal">
                      Closed on{" "}
                      {item.cancelled_date
                        ? moment(item.cancelled_date).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                  {item.hourly_status == "paid" && (
                    <div className="text-lg font-normal">
                      Paid on{" "}
                      {item.paid_date
                        ? moment(item.paid_date).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <StyledHtmlText
                  needToBeShorten
                  htmlString={item.description}
                  id={`mstone_${item.hourly_id}`}
                />

                {item?.attachments ? (
                  <div className="mt-3 flex items-center justify-start gap-3">
                    {item.attachments
                      .split(",")
                      .map((att: string, index: number) => (
                        <div key={`attachments-${index}`}>
                          <AttachmentPreview
                            uploadedFile={att}
                            removable={false}
                            shouldShowFileNameAndExtension={false}
                          />
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
              {item.hourly_status == "pending" && (
                <div>
                  <StatusBadge color="yellow">
                    Waiting for Client to Pay
                  </StatusBadge>
                </div>
              )}
            </div>
          </div>
        ))}

      <AddHoursForm
        show={showMilestoneForm}
        toggle={toggleMilestoneForm}
        onSubmit={onSubmit}
        jobPostId={jobPostId}
        selectedMilestone={selectedMilestone}
        hourlyRate={hourlyRate}
      />

      {/* Stripe | bank details popup */}
      <StripeCompleteWarning
        show={stripeWarningModalState?.show}
        stripeStatus={stripeWarningModalState?.stripeStatus}
        toggle={closeStripeModal}
      />
    </div>
  );
};

export default HoursManagement;
