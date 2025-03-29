import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { MilestonesWrapper, MileStoneListItem } from "./milestones.styled";
import { StatusBadge } from "@/components/styled/Badges";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import DeclineReasonPrompt from "../DeclineReasonPrompt";
import PaymentModal from "../payment/PaymentModal";
import ConfirmPaymentModal from "../payment/ConfirmPaymentModal";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageMilestone, manageMilestoneNew } from "@/helpers/http/jobs";
import { usePayments } from "@/pages/client-job-details-page/controllers/usePayments";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import CheckMark from "@/public/icons/check-mark-green.svg";
import { paymentProcessingStatusHandler } from "@/helpers/validation/common";
import { CLIENT_HOW_TO_PROJECT_BASED_PROJECTS } from "@/helpers/const/CONFIG";
import Info from "@/public/icons/info-octashape.svg";
import { VideoComponent } from "@/components/video";
import styled from "styled-components";
import { TcomponentConnectorRef } from "@/pages/client-job-details-page/ClientJobDetails";
// import { getValueByPercentage } from "@/helpers/utils/helper";
import { AcceptAndPaynowModal } from "../payment/AcceptAndPaynowModal";
import CustomButton from "@/components/custombutton/CustomButton";

// Payment status configurations with color and label mappings
const PAYMENT_STATUS = {
  pending: {
    color: "yellow",
    label: "Milestone Proposal Pending",
  },
  released: {
    color: "gray",
    label: "Paid",
  },
  paid: {
    color: "green",
    label: "Milestone Accepted",
  },
  under_dispute: {
    color: "darkPink",
    label: "Under Dispute",
  },
  waiting_for_release: {
    color: "yellow",
    label: "Waiting for Approval",
  },
  decline: {
    color: "darkPink",
    label: "Milestone Terminated",
  },
  declined: {
    color: "darkPink",
    label: "Milestone Terminated",
  },
  payment_processing: {
    color: "yellow",
    label: "Payment Processing",
  },
  cancelled: {
    color: "darkPink",
    label: "Canceled by Freelancer",
  },
  request_revision: {
    color: "yellow",
    label: "Revisions Requested",
  },
  completed_by_freelancer: {
    color: "yellow",
    label: "Completed - Freelancer Waiting for Payment",
  },
  decline_dispute: {
    color: "darkPink",
    label: "",
  },
};

const MilestoneHintText = styled.div`
  color: ${(props) => props.theme.colors.red};
`;

// Warning text for disputed milestones
const DisputeWarningText = styled.div`
  color: ${(props) => props.theme.colors.primary};
  margin-top: 1rem;
  font-weight: 500;
  display: flex;
  svg {
    margin-right: 0.5rem;
  }
`;

const Milestones = ({
  milestone,
  refetch,
  jobstatus,
  isRefetching,
  componentConnectorRef,
}: {
  milestone: any;
  refetch: () => void;
  jobstatus?: string;
  isRefetching: boolean;
  componentConnectorRef?: TcomponentConnectorRef;
}) => {
  const {
    setAmount,
    setJobType,
    selectedPaymentMethod,
    payDirectlyToFreelancer,
  } = usePayments();

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [requestingRivisions, setRequestingRivisions] =
    useState<boolean>(false);
  const [declineReasonPropmt, setDeclineReasonPropmt] =
    useState<boolean>(false);
  const [isPayNow, setIsPayNow] = useState(false);

  const [modalsState, setModalsState] = useState<{
    showConfirmationModal?: boolean;
    showPayNowConfirmationModal?: boolean;
    showPaymentModal?: boolean;
    milestone?: any;
    isReleasePrompt?: boolean;
    tokenId?: string;
  }>({
    showConfirmationModal: false,
    showPayNowConfirmationModal: false,
    showPaymentModal: false,
    milestone: null,
    isReleasePrompt: false,
    tokenId: null,
  });

  // First this will ask for confirmation... Are you sure?
  const askForConfirmation = (item: any) => () => {
    setAmount(item.amount);
    setJobType("fixed");
    setModalsState({
      ...modalsState,
      showConfirmationModal: true,
      milestone: item,
    });
  };

  const closeConfirmPaymentModal = () => {
    setAmount("");
    setJobType("");
    setModalsState({ showConfirmationModal: false });
  };

  const askForPayNowConfirmation = (item: any) => () => {
    setAmount(item.amount);
    setJobType("fixed");
    setModalsState({
      ...modalsState,
      showPayNowConfirmationModal: true,
      milestone: item,
    });
  };

  const closePayNowModal = () => {
    setAmount("");
    setJobType("");
    setModalsState({ showPayNowConfirmationModal: false });
  };

  // Once user confirms
  const onConfirm = () => {
    if (modalsState.isReleasePrompt) {
      /* On confirmation of release */
      updateMilestoneNew(modalsState?.milestone?.milestone_id, "released");
    } else {
      /* On confirmation for payment */
      setModalsState({
        ...modalsState,
        showConfirmationModal: false,
        showPaymentModal: true,
      });
    }
  };

  const onConfirmPayNow = () => {
    setIsPayNow(true);
    setModalsState({
      ...modalsState,
      showPayNowConfirmationModal: false,
      showPaymentModal: true,
    });
  };

  /* Makes the actual payment and update into database */
  const handlePayment = (tokenId?: string) => {
    updateMilestoneNew(modalsState?.milestone?.milestone_id, "paid", tokenId);
  };

  const toggleDeclienReasonModal = () => {
    if (declineReasonPropmt) {
      setSelectedMilestoneId("");
    }
    setDeclineReasonPropmt(!declineReasonPropmt);
  };

  // This will close the payment modal
  const closePaymentModal = () => {
    setAmount("");
    setJobType("");
    setModalsState({ showPaymentModal: false });
  };

  /* The actual api call to update the status of the milestone */
  const updateMilestoneNew = async (
    milestoneId: string,
    status: string,
    token?: string
  ) => {
    setSelectedMilestoneId(milestoneId);
    const body: any = {
      action: "edit_milestone",
      status,
      milestone_id: milestoneId,
      payment_method: selectedPaymentMethod,
    };

    // Token will come only when paying the milestone
    if (token) body.token = token;

    // if user selected accept & pay now then calling pay now function else escrow function
    const promise = isPayNow
      ? payDirectlyToFreelancer(milestoneId, token)
      : manageMilestoneNew(body);

    toast.promise(promise, {
      loading: "Loading...",
      success: ({ data }) => {
        setSelectedMilestoneId("");
        setAmount("");
        setJobType("");
        setModalsState({});
        refetch();

        return data?.response;
      },
      error: (error) => {
        setSelectedMilestoneId("");
        return error?.response?.data?.message || "error";
      },
    });
  };

  const requestRevisions = (milestoneId: string) => () => {
    setSelectedMilestoneId(milestoneId);
    setRequestingRivisions(true);
    const body = {
      action: "request_revision",
      milestone_id: milestoneId,
    };
    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setRequestingRivisions(false);
        setSelectedMilestoneId("");
        refetch();
        return res.response;
      },
      error: (err) => {
        setRequestingRivisions(false);
        setSelectedMilestoneId("");
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onRelease = (item) => () => {
    setJobType("fixed");
    setAmount(item.amount);
    setModalsState({
      milestone: item,
      showConfirmationModal: true,
      isReleasePrompt: true,
    });
  };

  const getDateLabel = (milestoneStatus: string) => {
    let label = "";
    switch (milestoneStatus) {
      case "released":
        label = "Paid on";
        break;
      case "paid":
        label = "Payment Deposited on";
        break;
      case "request_revision":
        label = "Requested Revision on";
        break;
    }
    return label;
  };

  const getDate = (item) => {
    let date = "";
    const milestoneStatus = item.status;
    switch (milestoneStatus) {
      case "paid":
        date = moment(item?.paid_date).format("MMM DD, YYYY");
        break;
      case "released":
        date = moment(item?.released_date).format("MMM DD, YYYY");
        break;
      case "request_revision":
        date = moment(item?.revision_date).format("MMM DD, YYYY");
        break;
    }
    return date;
  };

  const deliverPaymentBtn = (item) => (
    <>
      <CustomButton
        text={"Deliver Payment"}
        className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-[#167347] text-[18px]"
        disabled={item?.milestone_id == selectedMilestoneId}
        onClick={onRelease(item)}
      />
    </>
  );

  // If there are more than 1 milestone that need to be accepted
  // then opening list modal to show all milestones
  const moreThanOnePendingMilestone =
    milestone.filter((x) => x?.status === "pending" && jobstatus === "active")
      .length > 1;

  return (
    <MilestonesWrapper>
      {milestone?.length == 0 && (
        <div>
          <h4 className="text-center text-2xl font-bold">
            How To Do Project-Based Projects
          </h4>
          {/* START ----------------------------------------- Video for doing project based projects */}
          <div className="my-4">
            <VideoComponent videosrc={CLIENT_HOW_TO_PROJECT_BASED_PROJECTS} />
          </div>
          {/* END ------------------------------------------- Video for doing project based projects */}
          <b className="fs-18">What are milestones?</b>
          <p className="mt-2">
            In project-based projects, freelancers submit 'milestones'{" "}
            <b>BEFORE they do any work.</b>
          </p>
          <p>
            Milestones are mini-project-proposals, where they propose what work
            they'll do for a certain percentage of the budget. So if you agreed
            to pay them $300 for three flyers, they might send three milestones,
            each valued at $100.
          </p>
          <p>
            Alternatively, you don't have to break the budget up. If everyone is
            happy to just do one payment at the end of the project, the
            freelancer can send one milestone that represents the whole project
            in exchange for the whole project's budget.
          </p>
          <b className="fs-18">Doing the Project</b>
          <p className="mt-2">
            When the freelancer sends a milestone and you accept it, you will be
            charged the fee you're promising to pay. ZMZ will hold that fee
            while the freelancer works.
          </p>
          <p>
            When the freelancer is done, they will submit the work here in the
            milestone tab. You'll check that you've received everything that was
            agreed upon. Once that's confirmed, you'll press the "Deliver
            Payment" button to release the fee to the freelancer.
          </p>
          <p>
            <b>For more information</b> , see the "Search for help" section in
            our Help Center, by clicking the yellow icon in the bottom right
            corner.
          </p>
        </div>
      )}

      {milestone?.length > 0 &&
        !isRefetching &&
        milestone?.map((item: any, i, self) => (
          <MileStoneListItem
            key={`item?.milestone_id` + item?.title}
            className="flex flex-col milestone-item"
            data-milestone-status={item.status}
          >
            <div className="flex md:flex-row flex-col justify-between md:gap-3 gap-4">
              <div>
                <div className="text-2xl font-normal capital-first-ltr">
                  {convertToTitleCase(item.title)}
                </div>
                <div className="text-4xl font-normal line-height-100-perc mt-3">
                  {numberWithCommas(item.amount, "USD")}
                </div>

                {/* START ----------------------------------------- Showing price client has to pay including fees */}
                {/*item?.status === 'pending' && (
                  <div className="fs-14 mt-1 mb-2">
                    ({numberWithCommas(getValueByPercentage(item.amount, 102.9), 'USD')} -{' '}
                    {numberWithCommas(getValueByPercentage(item.amount, 104.9), 'USD')} with fee)
                  </div>
                )*/}
                {/* END ------------------------------------------- Showing price client has to pay including fees */}
              </div>
              <div className="status">
                <div className="flex flex-col md:items-end">
                  <>
                    <StatusBadge
                      color={PAYMENT_STATUS[item?.status]?.color || "green"}
                    >
                      {["decline_dispute"].includes(item.status) &&
                      item?.dispute_submitted_by === "CLIENT"
                        ? "Closed by Client"
                        : ["decline_dispute"].includes(item.status) &&
                          item?.dispute_submitted_by === "FREELANCER"
                        ? "Canceled"
                        : jobstatus !== "active" && item.status === "pending"
                        ? "Milestone Never Accepted"
                        : item?.status === "payment_processing"
                        ? paymentProcessingStatusHandler(item?.payment_method)
                        : PAYMENT_STATUS[item?.status]?.label}
                    </StatusBadge>
                  </>
                  {!!item?.date_created && (
                    <div className="text-lg font-normal mt-3">
                      Submitted on
                      {item?.date_created
                        ? " " +
                          moment(item?.date_created).format("MMM DD, YYYY")
                        : " -"}
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
                  {item?.status !== "pending" && (
                    <div className="text-lg font-normal">
                      {getDateLabel(item.status)} {getDate(item)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex mt-md-1 md:flex-row flex-col justify-between md:items-end gap-3">
              <div>
                <StyledHtmlText
                  needToBeShorten
                  htmlString={item.description}
                  id={`mstone_${item.milestone_id}`}
                />
                {item.due_date && (
                  <div className="mt-1">
                    {"Milestone Submission Scheduled: " +
                      formatLocalDate(item.due_date, "MMM DD, YYYY")}
                  </div>
                )}
              </div>
            </div>
            {/* Only show attachments if milestone is not under dispute */}
            {item?.attachments && item?.status !== "under_dispute" && (
              <div className="flex items-center gap-4 flex-wrap mt-3">
                {item?.attachments
                  .split(",")
                  .map((attachment, index: number) => (
                    <div key={`milestone-${index}`}>
                      <AttachmentPreview
                        uploadedFile={attachment}
                        removable={false}
                        shouldShowFileNameAndExtension={false}
                      />
                    </div>
                  ))}
              </div>
            )}
            {/* Show warning message if milestone is under dispute */}
            {item?.status === "under_dispute" && item?.attachments && (
              <DisputeWarningText>
                <Info /> Attachments are not available while this milestone is
                under dispute.
              </DisputeWarningText>
            )}
            {jobstatus === "active" && item?.status === "pending" && (
              <div>
                {/* Hint text to dont start working until milestone is approved */}
                {!!item?.failure_message && (
                  <MilestoneHintText className="mb-0 mt-1 text-2xl">
                    <b>Payment Failed:</b> Your last payment failed because{" "}
                    {item?.failure_message}
                  </MilestoneHintText>
                )}
                <div className="divider my-4" />
                <div className="bottom-buttons flex items-center gap-4">
                  {!moreThanOnePendingMilestone && (
                    <>
                      {/* <StyledButton
                        variant="success"
                        padding="1rem 2rem"
                        disabled={item?.milestone_id == selectedMilestoneId}
                        onClick={askForPayNowConfirmation(item)}
                      >
                        Accept & Pay Now
                      </StyledButton> */}

                      <CustomButton
                        text={"Accept & Pay Nows"}
                        className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-[#167347] text-white text-[18px]"
                        disabled={item?.milestone_id == selectedMilestoneId}
                        onClick={askForPayNowConfirmation(item)}
                      />
                      {/* <StyledButton
                        padding="1rem 2rem"
                        disabled={item?.milestone_id == selectedMilestoneId}
                        onClick={askForConfirmation(item)}
                      >
                        Accept & Deposit
                      </StyledButton> */}
                      <CustomButton
                        text={"Accept & Deposit"}
                        className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-primary text-[18px]"
                        disabled={item?.milestone_id == selectedMilestoneId}
                        onClick={askForConfirmation(item)}
                      />
                    </>
                  )}
                  {moreThanOnePendingMilestone &&
                    componentConnectorRef.current?.openMilestoneListModal && (
                      // <StyledButton
                      //   padding="1rem 2rem"
                      //   disabled={item?.milestone_id == selectedMilestoneId}
                      //   onClick={() => {
                      //     componentConnectorRef.current.openMilestoneListModal();
                      //   }}
                      // >
                      //   Accept Milestone
                      // </StyledButton>
                      <CustomButton
                        text={"Accept Milestone"}
                        className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                        disabled={item?.milestone_id == selectedMilestoneId}
                        onClick={() => {
                          componentConnectorRef.current.openMilestoneListModal();
                        }}
                      />
                    )}
                </div>
              </div>
            )}

            {item.status === "completed_by_freelancer" && (
              <div className="mlstn-completed-notice flex items-center gap-3 mt-4 rounded-lg md:p-3 p-2">
                <span>
                  <Info />
                </span>
                <span className="ml-2 text-lg font-normal">
                  The freelancer has submitted all the work and marked this
                  milestone as &apos;Complete.&apos; Please review the work and
                  deliver the payment.
                </span>
              </div>
            )}

            {/* Deliver payment button on after accepting milestone */}
            {["paid"].includes(item.status) && (
              <div className="bottom-buttons flex items-center gap-3 flex-wrap">
                {deliverPaymentBtn(item)}
              </div>
            )}
            {[
              "waitingForRelease",
              "waiting_for_release",
              "request_revision",
              "completed_by_freelancer",
            ].includes(item?.status) ? (
              <>
                <div className="divider my-4" />
                <div className="bottom-buttons flex items-center gap-3 flex-wrap">
                  {item.status === "request_revision" ? (
                    /* Revisions requested */
                    // <StyledButton
                    //   padding="1rem 2rem"
                    //   variant="outline-success"
                    //   disabled={true}
                    // >
                    //   <CheckMark stroke="green" />
                    //   Revisions request sent
                    // </StyledButton>
                    <div>
                      <CheckMark stroke="green" />
                      <CustomButton
                        text={"Revisions request sent"}
                        className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                        disabled={true}
                        onClick={() => {}}
                      />
                    </div>
                  ) : (
                    /* Request Revisions */
                    // <StyledButton
                    //   padding="1rem 2rem"
                    //   variant="outline-dark"
                    //   disabled={
                    //     item?.milestone_id === selectedMilestoneId &&
                    //     requestingRivisions
                    //   }
                    //   onClick={requestRevisions(item?.milestone_id)}
                    // >
                    //   Request Revisions
                    // </StyledButton>

                    <CustomButton
                      text={"Request Revisions"}
                      className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                      disabled={
                        item?.milestone_id === selectedMilestoneId &&
                        requestingRivisions
                      }
                      onClick={requestRevisions(item?.milestone_id)}
                    />
                  )}
                  {deliverPaymentBtn(item)}
                </div>
              </>
            ) : null}
          </MileStoneListItem>
        ))}

      <DeclineReasonPrompt
        type="milestone"
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
        isReleasePrompt={modalsState?.isReleasePrompt}
        toggle={closeConfirmPaymentModal}
        onConfirm={onConfirm}
        loading={selectedMilestoneId !== ""}
        buttonText={
          !modalsState?.isReleasePrompt ? "Accept & Deposit" : "Confirm and Pay"
        }
      />
      <AcceptAndPaynowModal
        show={modalsState?.showPayNowConfirmationModal}
        toggle={closePayNowModal}
        handlePayment={onConfirmPayNow}
      />
    </MilestonesWrapper>
  );
};

export default Milestones;
