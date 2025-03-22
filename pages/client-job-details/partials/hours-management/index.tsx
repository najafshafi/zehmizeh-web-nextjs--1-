import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  MilestonesWrapper,
  MileStoneListItem,
} from "./hours-management.styled";
import { StatusBadge } from "components/styled/Badges";
import { StyledButton } from "components/forms/Buttons";
import NoDataFound from "components/ui/NoDataFound";
import StyledHtmlText from "components/ui/StyledHtmlText";
import AttachmentPreview from "components/ui/AttachmentPreview";
import PaymentModal from "../payment/PaymentModal";
import ConfirmPaymentModal from "../payment/ConfirmPaymentModal";
import {
  changeStatusDisplayFormat,
  convertToTitleCase,
  numberWithCommas,
} from "helpers/utils/misc";
import { manageHours } from "helpers/http/jobs";
import DeclineReasonPrompt from "../DeclineReasonPrompt";
import { usePayments } from "pages/client-job-details/controllers/usePayments";
import PendingHourlySubmission from "pages/client-job-details/quick-options/PendingHourlySubmission";
import { paymentProcessingStatusHandler } from "helpers/validation/common";
import styled from "styled-components";
import { TcomponentConnectorRef } from "pages/client-job-details/ClientJobDetails";
import { getValueByPercentage } from "helpers/utils/helper";

const PAYMENT_STATUS = {
  released: {
    color: "gray",
  },
  paid: {
    color: "green",
  },
  under_dispute: {
    color: "darkPink",
  },
  declined: {
    color: "darkPink",
  },
  decline: {
    color: "darkPink",
  },
  cancelled: {
    color: "darkPink",
  },
  payment_processing: {
    color: "yellow",
  },
  decline_dispute: {
    color: "darkPink",
  },
};

const MilestoneHintText = styled("p")`
  color: ${(props) => props.theme.colors.red};
`;

const HoursManagement = ({
  milestone,
  refetch,
  setEndJobModal,
  onUpdateDecline,
  componentConnectorRef,
}: {
  milestone: any;
  refetch: () => void;
  setEndJobModal: (val: boolean) => void;
  onUpdateDecline: () => void;
  componentConnectorRef?: TcomponentConnectorRef;
}) => {
  const { setAmount, setJobType, selectedPaymentMethod } = usePayments();

  const [isFinalHourPayable, setIsFinalHourPayable] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [declineReasonPropmt, setDeclineReasonPropmt] =
    useState<boolean>(false);

  const [modalsState, setModalsState] = useState<{
    showConfirmationModal?: boolean;
    showPaymentModal?: boolean;
    milestone?: any;
    tokenId?: string;
    isFinalMileStone?: boolean;
    hourlyStatus?: string;
    pendingHourlySubModal?: boolean;
  }>({
    showConfirmationModal: false,
    showPaymentModal: false,
    milestone: null,
    tokenId: null,
    isFinalMileStone: false,
    hourlyStatus: null,
    pendingHourlySubModal: false,
  });

  const enableEndJobModal = () => {
    if (modalsState?.isFinalMileStone && modalsState?.hourlyStatus) {
      setEndJobModal(true);
    } else {
      setEndJobModal(false);
    }
  };

  // First this will ask for confirmation... Are you sure?
  const askForConfirmation = (item: any) => () => {
    setAmount(item.total_amount);
    setJobType("hourly");
    setModalsState({
      ...modalsState,
      showConfirmationModal: true,
      milestone: item,
      isFinalMileStone: item?.is_final_milestone,
      hourlyStatus: item?.hourly_status,
    });
  };

  const closeConfirmPaymentModal = () => {
    setAmount("");
    setJobType("");
    setModalsState({ showConfirmationModal: false });
  };

  // Once user confirms
  const onConfirm = () => {
    setModalsState({
      ...modalsState,
      showConfirmationModal: false,
      showPaymentModal: true,
    });
  };

  /* When card is added, this will call update milestone api and update the database with the card token.*/
  const handlePayment = (tokenId?: string) => {
    setSelectedMilestoneId(modalsState?.milestone?.hourly_id);
    setModalsState({
      ...modalsState,
      hourlyStatus: "paid",
    });
    const body = {
      action: "edit_hours",
      status: "paid",
      hourly_id: modalsState?.milestone?.hourly_id,
      token: tokenId,
      payment_method: selectedPaymentMethod,
    };

    const promise = manageHours(body);

    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setSelectedMilestoneId("");
        refetch();
        closeConfirmPaymentModal();
        enableEndJobModal();
        return res.response;
      },
      error: (err) => {
        setSelectedMilestoneId("");
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onDecline = (milestoneId: string) => () => {
    setSelectedMilestoneId(milestoneId);
    setDeclineReasonPropmt(true);
    onUpdateDecline();
    // refetch();
  };

  const toggleDeclienReasonModal = () => {
    if (declineReasonPropmt) {
      setSelectedMilestoneId("");
    }
    setDeclineReasonPropmt(!declineReasonPropmt);
  };

  const closePaymentModal = () => {
    // This will close the payment modal
    setAmount("");
    setJobType("");
    setModalsState({ showPaymentModal: false });
  };

  const togglePendingHrSubModal = () => {
    setModalsState({
      ...modalsState,
      pendingHourlySubModal: !modalsState.pendingHourlySubModal,
    });
  };

  const payAndCloseProjectCheckHandler = (
    item: any,
    selectedMilestoneId: any
  ) => {
    const condOne = item?.hourly_id == selectedMilestoneId;
    let isAnyDisputePresent = false;

    milestone?.forEach((dt) => {
      if (!isAnyDisputePresent)
        isAnyDisputePresent = ["under_dispute"].includes(dt["hourly_status"]);
    });

    return condOne || isAnyDisputePresent;
  };
  useEffect(() => {
    let statusArr: any[] = milestone.filter(
      (item) => item?.is_final_milestone === 0
    );
    statusArr = statusArr.map(
      (item) =>
        item?.hourly_status === "paid" ||
        item?.hourly_status === "decline" ||
        // item?.hourly_status === 'under_dispute' ||
        // item?.hourly_status === 'payment_processing' ||
        item?.hourly_status === "cancelled" ||
        item?.dispute_submitted_by === "CLIENT" ||
        item?.dispute_submitted_by === "FREELANCER"
    );

    setIsFinalHourPayable(!statusArr.includes(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const milestoneHandler = (milestone: any) => {
    return milestone.sort(
      (a, b) => b.is_final_milestone - a.is_final_milestone
    );
  };

  return (
    <MilestonesWrapper>
      {milestone?.length == 0 && (
        <NoDataFound
          className="py-5"
          title="The freelancer hasn't submitted any hours yet."
        />
      )}

      {milestone?.length > 0 &&
        milestoneHandler(milestone)?.map((item: any, index: number, self) => (
          <MileStoneListItem
            key={item?.hourly_id}
            className="flex flex-col milestone-item"
            data-hourly-status={item.hourly_status}
          >
            <div className="flex flex-md-row flex-col justify-between gap-md-3 gap-4">
              <div>
                <div className="fs-20 font-normal capital-first-ltr">
                  {item.is_final_milestone
                    ? "Final Submission"
                    : "Submission " + ++index}
                  : {convertToTitleCase(item.title)}
                </div>
                <div className="fs-32 font-normal line-height-100-perc mt-3">
                  {numberWithCommas(item.total_amount, "USD")}
                </div>
                {/* START ----------------------------------------- Showing price client has to pay including fees */}
                {item.hourly_status === "pending" && (
                  <div className="fs-14 mt-1 mb-2">
                    (
                    {numberWithCommas(
                      getValueByPercentage(item.total_amount, 102.9),
                      "USD"
                    )}{" "}
                    -{" "}
                    {numberWithCommas(
                      getValueByPercentage(item.total_amount, 104.9),
                      "USD"
                    )}{" "}
                    with fee)
                  </div>
                )}
                {/* END ----------------------------------------- Showing price client has to pay including fees */}
              </div>
              {item.hourly_status !== "pending" ? (
                <div className="flex flex-col align-items-md-end">
                  {[
                    "paid",
                    "under_dispute",
                    "declined",
                    "decline",
                    "released",
                    "payment_processing",
                    "cancelled",
                    "decline_dispute",
                  ].includes(item.hourly_status) && (
                    <>
                      <div>
                        <StatusBadge
                          color={PAYMENT_STATUS[item.hourly_status]?.color}
                        >
                          {["decline_dispute"].includes(item.hourly_status) &&
                          item?.dispute_submitted_by === "CLIENT"
                            ? "Closed by Client"
                            : ["decline_dispute"].includes(
                                item.hourly_status
                              ) && item?.dispute_submitted_by === "FREELANCER"
                            ? "Canceled"
                            : ["decline", "declined"].includes(
                                item.hourly_status
                              )
                            ? "Declined"
                            : ["cancelled"].includes(item.hourly_status) &&
                              item?.is_paid === 0
                            ? "Canceled by Freelancer"
                            : item.hourly_status === "payment_processing"
                            ? paymentProcessingStatusHandler(
                                item?.payment_method
                              )
                            : changeStatusDisplayFormat(
                                item.hourly_status,
                                "_"
                              )}
                        </StatusBadge>
                      </div>
                    </>
                  )}
                  {!!item?.date_created && (
                    <div className="fs-18 font-normal mt-3">
                      Submitted on
                      {item?.date_created
                        ? " " +
                          moment(item?.date_created).format("MMM DD, YYYY")
                        : " -"}
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
                  {item?.hourly_status == "paid" && (
                    <div className="fs-18 font-normal">
                      Paid on
                      {item?.paid_date
                        ? " " + moment(item?.paid_date).format("MMM DD, YYYY")
                        : " -"}
                    </div>
                  )}
                </div>
              ) : // Desktop view only
              !item.is_final_milestone ? (
                <div>
                  <StyledButton
                    padding="1rem 2.5rem"
                    className="d-none d-md-block"
                    disabled={item?.hourly_id == selectedMilestoneId}
                    onClick={() => {
                      // If there are more than 1 hourly payment that need to be accepted
                      // then opening list modal to show all hourly payment
                      const moreThanOnePendingMilestone =
                        self.filter(
                          (x) =>
                            !x?.is_final_milestone &&
                            x?.hourly_status === "pending"
                        ).length > 1;
                      if (
                        moreThanOnePendingMilestone &&
                        componentConnectorRef.current?.openMilestoneListModal
                      ) {
                        componentConnectorRef.current.openMilestoneListModal();
                        return;
                      }

                      // if there's only one payment then opening confirmation modal
                      askForConfirmation(item)();
                    }}
                  >
                    Pay
                  </StyledButton>
                </div>
              ) : null}
            </div>
            <div className="flex mt-md-3 flex-md-row flex-col justify-between align-items-md-end gap-3">
              <div>
                <StyledHtmlText
                  needToBeShorten
                  htmlString={item.description}
                  id={`mstone_${item.hourly_id}`}
                />
                {/* Hint text to dont start working until milestone is approved */}
                {item.hourly_status === "pending" && item?.failure_message && (
                  <MilestoneHintText className="mb-0 mt-1 fs-20">
                    <b>Payment Failed:</b> Your last payment failed because{" "}
                    {item?.failure_message}
                  </MilestoneHintText>
                )}
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
              {item.hourly_status == "pending" && !item.is_final_milestone ? (
                // Mobile view only
                <StyledButton
                  padding="1rem 2rem"
                  className="d-block d-md-none"
                  disabled={item?.hourly_id == selectedMilestoneId}
                  onClick={askForConfirmation(item)}
                >
                  Pay
                </StyledButton>
              ) : null}
            </div>

            {item.is_final_milestone &&
            ![
              "paid",
              "payment_processing",
              "under_dispute",
              "decline_dispute",
            ].includes(item.hourly_status) ? (
              <div className="flex flex-md-row flex-col mt-3 gap-3 justify-content-md-end justify-center">
                <StyledButton
                  variant="outline-dark"
                  padding="1rem 2rem"
                  disabled={item?.hourly_id == selectedMilestoneId}
                  onClick={onDecline(item.hourly_id)}
                >
                  Decline - I Want to Continue Project
                </StyledButton>
                <StyledButton
                  style={{
                    opacity:
                      isFinalHourPayable &&
                      !payAndCloseProjectCheckHandler(item, selectedMilestoneId)
                        ? 1
                        : 0.5,
                  }}
                  padding="1rem 2rem"
                  disabled={payAndCloseProjectCheckHandler(
                    item,
                    selectedMilestoneId
                  )}
                  onClick={() =>
                    isFinalHourPayable
                      ? askForConfirmation(item)()
                      : togglePendingHrSubModal()
                  }
                >
                  Pay & Close Project
                </StyledButton>
              </div>
            ) : null}
          </MileStoneListItem>
        ))}

      <PendingHourlySubmission
        onConfirm={() => togglePendingHrSubModal()}
        toggle={() => togglePendingHrSubModal()}
        show={modalsState.pendingHourlySubModal}
      />

      <DeclineReasonPrompt
        type="hourly"
        show={declineReasonPropmt}
        toggle={toggleDeclienReasonModal}
        onSubmit={refetch}
        milestoneId={selectedMilestoneId}
      />

      <PaymentModal
        show={modalsState?.showPaymentModal}
        onCancel={closePaymentModal}
        onPay={handlePayment}
        processingPayment={selectedMilestoneId !== ""}
      />

      <ConfirmPaymentModal
        show={modalsState?.showConfirmationModal}
        isReleasePrompt={false}
        toggle={closeConfirmPaymentModal}
        onConfirm={onConfirm}
        loading={selectedMilestoneId !== ""}
        buttonText="Pay"
      />
    </MilestonesWrapper>
  );
};

export default HoursManagement;
