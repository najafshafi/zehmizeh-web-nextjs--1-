/*
 * This is the main component of the milestones on freelacner side that displays the list of milestones *
 */

import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { StatusBadge } from "@/components/styled/Badges";
import StripeCompleteWarning from "@/components/jobs/StripeCompleteWarning";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import AddMilestoneForm from "./AddMilestoneForm";
import EditMilestoneForm from "./EditMilestoneForm";
import CancelMileStoneModal from "./CancelMilestoneModal";
import MoreButton from "./MoreButton";
import MarkMilestoneAsCompleted from "./MarkMilestoneAsCompletedModal";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
} from "@/helpers/utils/misc";
import { manageMilestone } from "@/helpers/http/jobs";
import { getUser } from "@/helpers/http/auth";
import AttachmentSubmitModal, {
  FileAttachment,
} from "../modals/AttachmentSubmitModal";
import { MilestoneTypes as ImportedMilestoneTypes } from "@/helpers/types/milestone.type";
import Info from "@/public/icons/info-octashape.svg";
import { paymentProcessingStatusHandler } from "@/helpers/validation/common";
import Link from "next/link";
import CustomButton from "@/components/custombutton/CustomButton";

type PaymentStatusType = {
  [key: string]: {
    color: string;
    label: string;
  };
};

interface MilestoneResponse {
  status: boolean;
  message?: string;
  response?: string;
}

const PAYMENT_STATUS: PaymentStatusType = {
  released: {
    color: "green",
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
    label: "Waiting for Work Approval",
  },
  decline: {
    color: "darkPink",
    label: "Client has terminated milestone",
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
  pending: {
    color: "yellow",
    label: "Milestone Proposal Pending",
  },
  decline_dispute: {
    color: "darkPink",
    label: "",
  },
  completed_by_freelancer: {
    color: "yellow",
    label: "Milestone Completed - Awaiting Payment",
  },
};

interface MilestoneTypesWithStringAmount
  extends Omit<ImportedMilestoneTypes, "amount" | "due_date"> {
  amount: string;
  due_date: string;
  hourly_id?: string;
  total_amount?: string;
  hourly_status?: string;
}

interface MilestoneProps {
  milestone: MilestoneTypesWithStringAmount[];
  jobStatus: string;
  refetch: () => void;
  clientUserId: string;
  jobPostId: string;
  restrictPostingMilestone?: boolean;
  remainingBudget: number;
}

interface CancelMilestoneModalState {
  show: boolean;
  milesotne?: MilestoneTypesWithStringAmount;
  canceling?: boolean;
}

interface StripeWarningModalState {
  show: boolean;
  stripeStatus: string;
}

const Milestones = ({
  milestone,
  refetch,
  clientUserId,
  jobPostId,
  restrictPostingMilestone = false,
  remainingBudget,
}: MilestoneProps) => {
  const [showMilestoneForm, setShowMilestoneForm] = useState<boolean>(false);
  const [showMarkMilestoneAsCompleted, setShowMarkMilestoneAsCompleted] =
    useState<{
      show: boolean;
      loading: boolean;
    }>({
      show: false,
      loading: false,
    });

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showAttachmentSubmitModal, setShowAttachmentSubmitModal] = useState<{
    show: boolean;
    loading?: boolean;
  }>({
    show: false,
  });
  const [cancelMilestoneModalState, setCancelMilestoneModalState] =
    useState<CancelMilestoneModalState>({
      show: false,
      canceling: false,
    });

  const [stripeWarningModalState, setStripeModalWarningState] =
    useState<StripeWarningModalState>({
      show: false,
      stripeStatus: "",
    });

  const toggleMilestoneForm = () => {
    setShowMilestoneForm(!showMilestoneForm);
  };

  const onDelete =
    (selectedMilestone: MilestoneTypesWithStringAmount) => () => {
      setCancelMilestoneModalState({
        show: true,
        milesotne: selectedMilestone,
      });
    };

  const [postedWork, setPostedWork] = useState<string>("");

  const handleEdit = (index: number) => () => {
    setEditIndex(index);
  };

  const onSubmit = () => {
    setEditIndex(-1);
    refetch();
  };

  const updateMilestoneStatus =
    (milestoneId: number, fileURL: string) => () => {
      setSelectedMilestoneId(milestoneId);
      const body = {
        action: "revision_confirm",
        milestone_id: milestoneId,
        attachments: fileURL,
      };
      const promise = manageMilestone(body);
      toast.promise(promise, {
        loading: "Loading...",
        success: (res) => {
          setSelectedMilestoneId(0);
          setShowAttachmentSubmitModal({ show: false });
          refetch();
          return res.response;
        },
        error: (err) => {
          setShowAttachmentSubmitModal({ show: false });
          setSelectedMilestoneId(0);
          return err?.response?.data?.message || "error";
        },
      });
    };

  const markMilestoneCompleted = () => {
    setShowMarkMilestoneAsCompleted({
      ...showMarkMilestoneAsCompleted,
      loading: true,
    });

    const body = {
      action: "completed_by_freelancer",
      milestone_id: selectedMilestoneId,
    };

    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setShowMarkMilestoneAsCompleted({ show: false, loading: false });
        refetch();
        return res.message;
      },
      error: (err) => {
        setShowMarkMilestoneAsCompleted({ show: false, loading: false });
        return err?.message;
      },
    });
  };

  const showStripeWarning = (status: string) => {
    setStripeModalWarningState({
      show: true,
      stripeStatus: status,
    });
  };

  const closeStripeModal = () => {
    setStripeModalWarningState({
      show: false,
      stripeStatus: "",
    });
  };

  const closeCancelMileStoneModal = () => {
    setCancelMilestoneModalState({ show: false });
  };

  const onConfirmDeletion = () => {
    if (!cancelMilestoneModalState.milesotne?.milestone_id) return;

    const body = {
      action: "delete_milestone",
      milestone_id: cancelMilestoneModalState.milesotne.milestone_id,
    };
    setCancelMilestoneModalState({
      ...cancelMilestoneModalState,
      canceling: true,
    });

    const promise = manageMilestone(body);
    toast.promise(promise, {
      loading: "Loading...",
      success: (res: MilestoneResponse) => {
        refetch();
        setCancelMilestoneModalState({ show: false });
        return res?.status
          ? "Your Milestone Canceled Successfully"
          : "Failed to cancel milestone";
      },
      error: (err) => {
        return err?.response?.data?.message || "error";
      },
    });
  };

  const checkStripeStatus = (milestoneId: number) => {
    /* This will check first if bank account is added or not
     * If not added, it will open the Stripe warning modal and ask to complete that first
     * If adddd, user will be able to cashout
     */
    setSelectedMilestoneId(milestoneId);
    getUser().then((res) => {
      const accounts = res?.data?.account;
      if (accounts?.length > 0) {
        setShowAttachmentSubmitModal({ show: true });
      } else {
        /* This will show that stripe warning popup */
        setSelectedMilestoneId(0);
        showStripeWarning(res?.data?.stp_account_status);
      }
    });
  };

  const closeAttachmentSubmitModal = () => {
    setShowAttachmentSubmitModal({ show: false });
    setPostedWork("");
    setSelectedMilestoneId(0);
  };

  const onConfirm = (attachments: FileAttachment[]) => {
    /* This will request for cashout directly as bank details are added */
    setShowAttachmentSubmitModal({
      ...showAttachmentSubmitModal,
      loading: true,
    });

    let url: string | null = "";
    attachments.map(({ fileName, fileUrl }) => {
      url += `,${fileUrl}#docname=${fileName}`;
    });
    url = url.slice(1);

    return updateMilestoneStatus(selectedMilestoneId, url)();
  };

  const getDateLabel = (milestoneStatus: string) => {
    let label = "";
    switch (milestoneStatus) {
      case "released":
        label = "Paid on";
        break;
      case "paid":
        label = "Payment Deposited on ";
        break;
      case "request_revision":
        label = "Requested Revision on";
        break;
    }
    return label;
  };

  const getDate = (item: MilestoneTypesWithStringAmount) => {
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

  return (
    <div className="mx-auto mt-10 w-[816px] max-w-full">
      {milestone?.length == 0 && !restrictPostingMilestone && (
        <div>
          <h4 className="text-center text-2xl font-bold">
            How To Do Project-Based Projects
          </h4>
          <b className="text-lg">What are milestones?</b>
          <p className="my-2">
            In project-based projects, freelancers submit &quot;milestones&quot;{" "}
            <b>BEFORE they do any work.</b>
          </p>
          <p className="my-2">
            Milestones are mini-project-proposals, where you propose what work
            you&apos;ll do for a certain percentage of the budget. So if you
            were going to make three flyers for $300, you could send three
            milestones, each valued at $100.
          </p>
          <p className="my-2">
            Alternatively, you don&apos;t have to break the budget up. If
            you&apos;re happy to be paid in one payment at the end of the
            project, you can send one milestone that represents the whole
            project in exchange for the whole project&apos;s budget.
          </p>
          <b className="text-lg my-2">Doing the Project</b>
          <p className="mt-2">
            When you send a milestone and the client accepts it, he will be
            charged the fee he promised to pay. ZMZ will hold that fee for you
            while you do the work.
          </p>
          <p className="my-2">
            After submitting the work here in the milestone tab, the client
            confirms he received what he asked for and clicks the &quot;Deliver
            Payment&quot; button. The fee will then be released and sent on its
            way to the freelancer&apos;s bank account.
          </p>
          <p className="my-2">
            <b>For more information</b> , check{" "}
            <Link
              href="/support/faq/working_a_project"
              className="text-yellow-500"
            >
              Working a Project FAQs
            </Link>{" "}
            section or by clicking the yellow icon in the bottom right corner.
          </p>
        </div>
      )}

      {milestone?.length > 0 &&
        milestone?.map((item: MilestoneTypesWithStringAmount, index: number) =>
          editIndex !== index ? (
            <div
              key={item?.milestone_id}
              className="flex flex-col p-7 md:p-5 shadow-[0px_4px_74px_rgba(0,0,0,0.04)] bg-white mt-6 rounded-[1.25rem]"
              data-milestone-status={item.status}
            >
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div className="flex justify-between">
                  <div>
                    <div className="heading text-xl font-normal capitalize">
                      {convertToTitleCase(item.title)}
                    </div>
                    <div className="text-[32px] leading-[40px] font-normal mt-2 md:mt-2">
                      {numberWithCommas(item.amount, "USD")}
                    </div>
                  </div>
                  {["request_revision", "pending"].includes(item?.status) ? (
                    <div className="md:hidden block">
                      <MoreButton
                        onDelete={onDelete(item)}
                        handleEdit={handleEdit(index)}
                        isEditEnabled={
                          item?.status === "request_revision" && false
                        }
                      />
                    </div>
                  ) : item?.status === "paid" ||
                    item?.status === "request_revision" ? (
                    <div className="md:hidden block">
                      <MoreButton
                        onDelete={onDelete(item)}
                        handleEdit={handleEdit(index)}
                        isEditEnabled={false}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="flex gap-3 items-center justify-between">
                    <StatusBadge
                      color={PAYMENT_STATUS[item?.status]?.color || "green"}
                    >
                      {["decline_dispute"].includes(item.status) &&
                      item?.dispute_submitted_by === "CLIENT"
                        ? "Closed by Client"
                        : ["decline_dispute"].includes(item.status) &&
                            item?.dispute_submitted_by === "FREELANCER"
                          ? "Canceled"
                          : item?.status === "payment_processing"
                            ? paymentProcessingStatusHandler(
                                item?.payment_method as
                                  | "ACH"
                                  | "OTHER"
                                  | undefined
                              )
                            : (
                                PAYMENT_STATUS as Record<
                                  string,
                                  { color: string; label: string }
                                >
                              )[item?.status || ""]?.label || ""}
                    </StatusBadge>

                    {/* This will be hidden from here in mobile */}
                    {["pending"].includes(item?.status) ? (
                      <div className="hidden md:block">
                        <MoreButton
                          onDelete={onDelete(item)}
                          handleEdit={handleEdit(index)}
                        />
                      </div>
                    ) : item?.status === "paid" ? (
                      <div className="hidden md:block">
                        <MoreButton
                          onDelete={onDelete(item)}
                          handleEdit={handleEdit(index)}
                          isEditEnabled={false}
                        />
                      </div>
                    ) : item?.status === "request_revision" ? (
                      <div className="hidden md:block">
                        <MoreButton
                          onDelete={onDelete(item)}
                          handleEdit={handleEdit(index)}
                          isEditEnabled={false}
                        />
                      </div>
                    ) : null}
                  </div>

                  {!["pending", "waiting_for_release", "cancelled"].includes(
                    item?.status
                  ) ? (
                    <div className="mt-3">
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
                      {
                        <div className="text-lg font-normal">
                          {getDateLabel(item.status)} {getDate(item)}
                        </div>
                      }
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="flex-1 my-2">
                  <StyledHtmlText
                    needToBeShorten
                    htmlString={item.description}
                    id={`mstone_${item.milestone_id}`}
                  />
                  {item.due_date && item.status !== "cancelled" && (
                    <div className="mt-2 md:mt-1">
                      Due on {formatLocalDate(item.due_date, "MMM DD, YYYY")}
                    </div>
                  )}
                  {item?.attachments && (
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
                </div>

                {["paid", "request_revision", "waiting_for_release"].includes(
                  item.status
                ) && (
                  <div className="mt-2 flex items-center justify-end gap-3">
                    <CustomButton
                      text={"Post Work"}
                      className="md:px-8 md:py-3 py-2 px-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                      onClick={() => {
                        checkStripeStatus(item?.milestone_id);
                        setPostedWork(item.attachments);
                      }}
                      disabled={item?.milestone_id == selectedMilestoneId}
                      showSpinner={
                        item?.milestone_id == selectedMilestoneId &&
                        !showMarkMilestoneAsCompleted.show
                      }
                      spinnerPosition="right"
                    />

                    <CustomButton
                      text={" Mark Milestone as 'Complete'"}
                      className="md:px-8 md:py-3 py-2 px-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                      onClick={() => {
                        setSelectedMilestoneId(item?.milestone_id);
                        setShowMarkMilestoneAsCompleted({
                          ...showMarkMilestoneAsCompleted,
                          show: true,
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Hint text to dont start working until milestone is approved */}
              {item.status === "pending" && (
                <p className="mb-0 mt-4 text-center text-xl text-yellow-500">
                  <b>NOTE:</b> This milestone is pending.
                  <br />
                  <b>Do NOT begin work</b> on it until the client has accepted.
                </p>
              )}

              {(item.status === "paid" ||
                (item.revision_date && item.status == "request_revision")) &&
                item?.status === "request_revision" && (
                  <div className="flex items-center gap-3 mt-4 rounded-lg p-2 md:p-3 bg-[#fbf5e8]">
                    <span>
                      <Info />
                    </span>
                    <span className="ml-2 text-base font-normal">
                      Client has requested revisions on this milestone.
                    </span>
                  </div>
                )}
            </div>
          ) : (
            /* Edit milestone form */
            <EditMilestoneForm
              onSubmit={onSubmit}
              cancelEdit={() => setEditIndex(-1)}
              milestoneId={item.milestone_id}
              currentData={{
                title: item.title,
                amount: item.amount,
                description: item.description,
                due_date: item.due_date || "",
              }}
              remainingBudget={remainingBudget}
            />
          )
        )}

      {/* Add milestone form */}
      <AddMilestoneForm
        show={showMilestoneForm}
        toggle={toggleMilestoneForm}
        onSubmit={refetch}
        clientUserId={clientUserId}
        jobPostId={jobPostId}
        remainingBudget={remainingBudget}
      />

      <StripeCompleteWarning
        show={stripeWarningModalState?.show}
        stripeStatus={stripeWarningModalState?.stripeStatus}
        toggle={closeStripeModal}
      />

      <AttachmentSubmitModal
        postedWork={postedWork}
        show={showAttachmentSubmitModal.show}
        toggle={closeAttachmentSubmitModal}
        onConfirm={onConfirm}
        loading={showAttachmentSubmitModal.loading || false}
      />

      <CancelMileStoneModal
        toggle={closeCancelMileStoneModal}
        onConfirm={onConfirmDeletion}
        cancelStateData={{
          show: cancelMilestoneModalState.show,
          loading: cancelMilestoneModalState.canceling,
          milestoneStatus: cancelMilestoneModalState.milesotne?.status || "",
        }}
      />

      <MarkMilestoneAsCompleted
        onConfirm={markMilestoneCompleted}
        stateData={showMarkMilestoneAsCompleted}
        toggle={() => {
          setSelectedMilestoneId(0);
          setShowMarkMilestoneAsCompleted({
            loading: false,
            show: false,
          });
        }}
      />
    </div>
  );
};

export default Milestones;
