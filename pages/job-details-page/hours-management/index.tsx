/*
 * This is the the main component that displays the list of hourly submissions
 */

import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  MilestonesWrapper,
  MileStoneListItem,
} from "./hours-management.styled";
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
import { Link } from "react-router-dom";

const STATUS = {
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

const HoursManagement = ({
  milestone,
  refetch,
  jobPostId,
  hourlyRate,
}: {
  milestone: any;
  refetch: () => void;
  jobPostId: string;
  hourlyRate: any;
}) => {
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
    <MilestonesWrapper>
      {milestone?.length == 0 && (
        <div>
          <NoDataFound className="pb-2" />
          <p className="text-center mt-4">
            Check{" "}
            <Link to="/support/faq/working_a_project">
              Working a Project FAQs
            </Link>{" "}
            section for more information
          </p>
        </div>
      )}
      {milestone?.length > 0 &&
        milestone?.map((item: any, index: number) => (
          <MileStoneListItem
            key={item.milestone_id}
            className="flex flex-col gap-2 milestone-item"
            data-hourly-status={item.hourly_status}
          >
            <div>
              <div className="flex justify-between gap-3">
                <div
                  className={classNames(
                    "heading fs-20 font-normal capital-first-ltr",
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
                        ? paymentProcessingStatusHandler(item?.payment_method)
                        : changeStatusDisplayFormat(item.hourly_status, "_")}
                    </StatusBadge>
                  </div>
                )}
              </div>
              <div
                className={classNames(
                  "flex md:flex-row flex-col justify-between align-items-md-end gap-2",
                  {
                    "mt-3": item.hourly_status !== "pending",
                  }
                )}
              >
                <h4 className="amount fs-32 font-normal">
                  {numberWithCommas(item.total_amount, "USD")}
                </h4>

                <div>
                  {!!item.date_created && (
                    <div className="fs-18 font-normal">
                      Submitted on{" "}
                      {item.date_created
                        ? moment(item.date_created).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                  {!!item.cancelled_date && (
                    <div className="fs-18 font-normal">
                      Closed on{" "}
                      {item.cancelled_date
                        ? moment(item.cancelled_date).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                  {item.hourly_status == "paid" && (
                    <div className="fs-18 font-normal">
                      Paid on{" "}
                      {item.paid_date
                        ? moment(item.paid_date).format("MMM DD, YYYY")
                        : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between align-items-md-end gap-3">
              <div>
                <StyledHtmlText
                  needToBeShorten
                  htmlString={item.description}
                  id={`mstone_${item.hourly_id}`}
                />

                {item?.attachments ? (
                  <div className="flex items-center justify-content-start gap-3">
                    {item?.attachments?.split(",").map((att, index) => (
                      <div className="mt-3" key={`attachments-${index}`}>
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
                <div className="request-release-btn">
                  <StatusBadge color="yellow">
                    Waiting for Client to Pay
                  </StatusBadge>
                </div>
              )}
            </div>
          </MileStoneListItem>
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
    </MilestonesWrapper>
  );
};

export default HoursManagement;
