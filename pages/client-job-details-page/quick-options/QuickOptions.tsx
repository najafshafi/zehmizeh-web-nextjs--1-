"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SelectJobModal from "@/components/invite-flow-modals/SelectJobModal";
import InviteFreelancerMessageModal from "@/components/invite-flow-modals/InviteFreelancerMessageModal";
import InviteFreelancer from "./InviteFreelancer";
import JobEndedSuccessModal from "./JobEndedSuccessModal";
import EndJobErrorModal from "@/components/jobs/EndJobErrorModal";
import FreelancerClosureRequestModal from "./FreelancerClosureRequestModal";
import EndModal from "./end-job-modals/EndModal";
import DeletePropmpt from "@/components/ui/DeletePropmpt";
import { deleteJob } from "@/helpers/http/client";
import {
  inviteFreelancer,
  jobClosureRequest,
  manageHours,
  manageMilestoneNew,
} from "@/helpers/http/jobs";
import useResponsive from "@/helpers/hooks/useResponsive";
import PaymentModal from "../partials/payment/PaymentModal";
import { usePayments } from "../controllers/usePayments";
import { MilestoneListModal } from "../partials/milestones/milestoneListModal";
import ConfirmPaymentModal from "../partials/payment/ConfirmPaymentModal";
import { isNotAllowedToSubmitReview } from "@/helpers/utils/helper";
import ProposalExistsModal from "@/components/invite-flow-modals/ProposalExistsModa";
import { TcomponentConnectorRef } from "../ClientJobDetails";
import { AcceptAndPaynowModal } from "../partials/payment/AcceptAndPaynowModal";
import CustomButton from "@/components/custombutton/CustomButton";

// Define interfaces for strongly typed objects
interface FreelancerData {
  first_name: string;
  last_name: string;
}

interface MilestoneItem {
  hourly_id?: string;
  milestone_id?: string;
  is_final_milestone: number;
  hourly_status?: string;
  status?: string;
  total_amount?: number;
  amount?: number;
}

interface Props {
  jobData: {
    status: string;
    jobPostId: string;
    jobType: string;
    freelancerUserId: string;
    freelancerData: FreelancerData;
    isClosureRequest: number;
    closureReqBy: string;
    isFinalMilestonePosted: boolean;
    openEndJobStatusModal: boolean;
    enableEndJobButton: boolean;
    milestones: MilestoneItem[];
    endJobStatus?: string;
    activeTab?: string;
    is_client_feedback?: boolean;
    job_reason?: string;
    is_completed?: 0 | 1;
  };
  refetch: (tab?: string) => () => void;
  goToMilestonesTab: () => void;
  onEndJobModal: (status: string) => void;
  payAllBtn?: boolean;
  componentConnectorRef?: TcomponentConnectorRef;
}

const QuickOptions = ({
  jobData,
  refetch,
  goToMilestonesTab,
  onEndJobModal,
  componentConnectorRef,
}: Props) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] =
    useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [endJobStatusModal, setEndJobStatusModal] = useState<{
    show: boolean;
    endJobSelectedStatus?: string;
  }>({
    show: false,
  });

  const [endJobSuccessModal, setEndJobSuccessModal] = useState<boolean>(false);
  const [freelancersModal, setFreelancersModal] = useState<boolean>(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<string[] | null>(
    null
  );

  const [freelancerClosureRequestModal, setFreelancerClosureRequestModal] =
    useState<boolean>(false);

  const [showEndJobErrorModalState, setShowEndJobErrorModalState] = useState<{
    show: boolean;
    error?: string;
  }>({
    show: false,
    error: "",
  });
  const [showDeleteJobModal, setShowDeleteJobModal] = useState<boolean>(false);

  const {
    setAmount,
    setJobType,
    selectedPaymentMethod,
    payDirectlyToFreelancer,
  } = usePayments();
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [unPaidMilestones, setUnpaidMilestones] = useState<MilestoneItem[]>([]);
  const [isOpenMilestoneListModal, setIsOpenMilestoneListModal] =
    useState(false);
  const [selectedMilestones, setSelectedMilestones] = useState<MilestoneItem[]>(
    []
  );
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showPayNowModal, setShowPayNowModal] = useState<boolean>(false);
  const [disputeMilestone, setDisputeMileStone] = useState<string | undefined>(
    undefined
  );
  const [isPayNow, setIsPayNow] = useState(false);

  // If job was closed by cron in 3 weeks duration
  // and freelancer was paid then client has to submit feedback
  // 1. job type is hourly = because only in hourly project it'll require for feedback
  // 2. status is closed = project is already closed by cron job or manually
  // 3. job is incomplete = job should be incomplete because on cron it'll be marked incomplete and won't have job reason
  // 4. has job reason for closure
  //             if closed by cron it won't have reason and client required to submit feedback when he/she opens it
  //             if closed manually then it'll have job reason and modal won't show again
  // 5. If there aren't any milestone then job should be incomplete because no work has been done.
  //    it'll show different popup notifying that it'll be marked as incomplete and can't submit feedback
  //    here job reason will be "freelancer hasnt been paid at all"
  const requireFeedbackHourlyClosedJob =
    jobData?.jobType === "hourly" &&
    jobData?.status === "closed" &&
    Number(jobData?.is_completed) === 0 &&
    !jobData?.job_reason &&
    !isNotAllowedToSubmitReview({ milestone: jobData.milestones });

  useEffect(() => {
    if (jobData) {
      if (jobData?.status === "active" && jobData?.openEndJobStatusModal) {
        setEndJobStatusModal({
          show: true,
          endJobSelectedStatus: jobData?.endJobStatus,
        });
      }
    }
  }, [jobData]);

  const toggleDeleteJobModal = () => {
    setShowDeleteJobModal(!showDeleteJobModal);
  };

  const onDelete = () => {
    setLoading(true);
    const promise = deleteJob(jobData?.jobPostId);

    toast.promise(promise, {
      loading: "Deleting the project...",
      success: (res) => {
        router.push("/client-jobs");
        setLoading(false);
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response || "error";
      },
    });
  };

  const toggleJobsModal = () => {
    setShowJobsModal(!showJobsModal);
  };

  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const toggleEndJobSuccessModal = () => {
    setEndJobSuccessModal(!endJobSuccessModal);
    if (endJobSuccessModal) {
      refetch("feedback")();
    }
    // else {
    //   setEndJobModal(false);
    // }
    onEndJobModal("success");
  };

  const onSelectJobAndContinue = (jobId: string, proposalExists: boolean) => {
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    const body = {
      job_post_id: selectedJobId,
      freelancer_user_id: selectedFreelancer
        ? selectedFreelancer
        : [jobData?.freelancerUserId],
      message: msg !== "" ? msg : undefined,
    };
    setSendingInvite(true);

    inviteFreelancer(body)
      .then((res) => {
        setSendingInvite(false);

        if (res.message === "PROPOSAL_EXIST") {
          toggleInviteMessageModal();
          setProposalExistModal(true);
          setSelectedJobId(body.job_post_id);
          return;
        }

        if (res.status) {
          toast.success(`Invitation sent successfully!`);
          toggleInviteMessageModal();
          setSelectedJobId("");
          setSelectedFreelancer([]);
        } else {
          setSelectedFreelancer([]);
          toast.error(
            res?.message ? res?.message : "Invitation not sent successfully!"
          );
        }
      })
      .catch(() => {
        setSelectedFreelancer([]);
        setSendingInvite(false);
      });
  };

  const openEndJobModal = () => {
    setEndJobStatusModal({
      show: true,
    });
  };

  const openEndJobErrorModal = () => {
    setShowEndJobErrorModalState({
      show: true,
    });
  };

  const closeEndJobModal = () => {
    const final_milestone = jobData?.milestones?.filter(
      (jb) => jb.is_final_milestone
    );
    const status_arr = ["paid", "released", "payment_processing"];
    if (
      final_milestone.length > 0 &&
      status_arr.includes(final_milestone[0]?.hourly_status || "") &&
      jobData?.status === "active" &&
      !jobData?.milestones?.some(
        (data) => !status_arr.includes(data?.hourly_status || "")
      )
    ) {
      onEndJobModal("open");
      setEndJobStatusModal({
        show: true,
      });
    } else {
      onEndJobModal("close");
      setEndJobStatusModal({
        show: false,
      });
    }
  };
  const toggleFreelancerClosureRequest = () => {
    setFreelancerClosureRequestModal(!freelancerClosureRequestModal);
  };

  const onConfirm = () => {
    setLoading(true);
    const body = {
      job_id: jobData?.jobPostId,
    };

    toast.loading("Please wait...");

    jobClosureRequest(body)
      .then((res) => {
        toast.dismiss();
        setLoading(false);
        if (res.status) {
          toggleFreelancerClosureRequest();
          toast.success(res.response);
          refetch("m_stone")();
        } else {
          toggleFreelancerClosureRequest();
          setShowEndJobErrorModalState({ show: true, error: res.message });
        }
      })
      .catch((err) => {
        toast.dismiss();
        setLoading(false);
        toggleFreelancerClosureRequest();
        setShowEndJobErrorModalState({
          show: true,
          error: err?.response?.data?.message,
        });
      });
  };

  const toggleEndJobModal = () => {
    onEndJobModal("show");
  };

  const toggleFreelancersModal = () => {
    setFreelancersModal(!freelancersModal);
  };

  // Fix for line 344-345 - Type mismatch in InviteFreelancer component
  const openInviteMessageModal = (selected: string) => {
    toggleFreelancersModal();
    setSelectedFreelancer(selected ? [selected] : null);
    toggleInviteMessageModal();
  };

  const onEndJobError = (msg: string) => {
    toggleEndJobModal();
    setShowEndJobErrorModalState({ show: true, error: msg });
  };

  const goToMilestones = () => {
    closeEndJobErrorModal();
    goToMilestonesTab();
  };

  const closeEndJobErrorModal = () => {
    setShowEndJobErrorModalState({
      show: false,
      error: "",
    });
    onEndJobModal("error");
  };

  const checkAnyOpenMilestone = (cb: () => void) => () => {
    const jobType = jobData?.jobType;
    let allowedStatus: string[] = [];
    if (jobType === "hourly") {
      allowedStatus = [
        "paid",
        "decline",
        "released",
        "under_dispute",
        "cancelled",
        "decline_dispute",
      ];
    } else {
      allowedStatus = [
        "pending",
        "released",
        "decline",
        "under_dispute",
        "cancelled",
        "decline_dispute",
      ];
    }
    const notPaidMilestone = jobData.milestones?.findIndex(
      (item) =>
        !allowedStatus.includes(
          jobType === "hourly" ? item.hourly_status || "" : item.status || ""
        )
    );

    const jobTypeFlag = jobType === "hourly" ? "hourly_status" : "status";
    let isAnyDisputePresent = false;

    jobData?.milestones?.forEach((dt) => {
      const statusValue = dt[jobTypeFlag as keyof typeof dt] as
        | string
        | undefined;
      if (!isAnyDisputePresent && statusValue) {
        isAnyDisputePresent = ["under_dispute"].includes(statusValue);
      }
    });

    if (notPaidMilestone !== -1 || isAnyDisputePresent) {
      setShowEndJobErrorModalState({
        show: true,
        error:
          jobType === "hourly"
            ? "You cannot close the project while there are unpaid hour submissions or while payments for hours are still processing."
            : "You cannot close the project while there are unpaid milestones or while payments for milestones are still processing.",
      });
    } else {
      cb();
    }
  };

  const handlePayAllHourlySubmissions = async (tokenId: string) => {
    setPaymentProcessing(true);

    // Filter hourly submissions that are not final milestone
    const hourlySubmissions = unPaidMilestones?.filter(
      ({ is_final_milestone, hourly_id }) =>
        is_final_milestone === 0 && !!hourly_id
    );

    // Extract hourly_id values and ensure they exist
    const hourly_id_arr = hourlySubmissions
      .map((item) => item.hourly_id)
      .filter(Boolean) as string[];

    if (!hourly_id_arr?.length) {
      setPaymentProcessing(false);
      return;
    }

    const promise = Promise.all(
      hourly_id_arr.map(async (milestone) => {
        const payload = {
          action: "edit_hours",
          status: "paid",
          hourly_id: milestone,
          ...(hourly_id_arr.length > 1 ? { hourly_id_arr } : {}),
          token: tokenId,
          payment_method: selectedPaymentMethod,
        };

        const { status, response } = await manageHours(payload);
        return { status, response };
      })
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        setIsOpenMilestoneListModal(false);
        refetch("m_stone")();
        return res[0]?.response;
      },
      error: (err) => {
        console.log("Error: ", err.toString());
        return err.toString();
      },
    });
  };

  const handlePayAllMilestonesSubmissions = async (token: string) => {
    setPaymentProcessing(true);

    if (!unPaidMilestones?.length) {
      setPaymentProcessing(false);
      return;
    }

    const milestone_id_arr = unPaidMilestones
      .map(({ milestone_id }) => milestone_id)
      .filter(Boolean) as string[];

    const promise = Promise.all(
      unPaidMilestones.map(async ({ milestone_id }) => {
        if (!milestone_id)
          return { response: "No milestone id", status: false };

        const body = {
          action: "edit_milestone",
          status: "paid",
          milestone_id,
          token,
          milestone_id_arr,
          payment_method: selectedPaymentMethod,
        };

        const promise = isPayNow
          ? payDirectlyToFreelancer(milestone_id, token, milestone_id_arr)
          : manageMilestoneNew(body);
        const { data } = await promise;
        return { ...data };
      })
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setShowPaymentModal(false);
        setPaymentProcessing(false);
        setIsOpenMilestoneListModal(false);
        refetch("m_stone")();
        return res[0]?.response;
      },
      error: (err) => {
        console.log("Error: ", err.toString());
        return err.toString();
      },
    });
  };

  const calculateTotalAmount = () => {
    const job_amount = jobData.jobType === "hourly" ? "total_amount" : "amount";

    setUnpaidMilestones(selectedMilestones);

    const totalUnpaidMilestoneAmt: number = selectedMilestones
      .map((submission) => {
        if (submission?.is_final_milestone === 1) return 0;

        // Handle potential undefined values
        const amount =
          job_amount === "total_amount"
            ? submission.total_amount
            : submission.amount;

        return amount ? +amount : 0;
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Use Payments
    setAmount(totalUnpaidMilestoneAmt);
    setJobType(jobData.jobType);
  };

  const onPayAllSubmissions = (type?: "PAY_NOW" | "") => {
    if (type === "PAY_NOW") {
      setIsPayNow(true);
    }
    calculateTotalAmount();
    setShowConfirmationModal(false);
    setShowPayNowModal(false);

    // Payment Modal
    setShowPaymentModal(true);
  };

  const isAnyPaymentPending = () => {
    const job_status =
      jobData.jobType === "hourly" ? "hourly_status" : "status";
    const unpaidMilestones = jobData.milestones.filter(
      (job) => job[job_status as keyof typeof job] === "pending"
    );
    return unpaidMilestones.length > 0;
  };

  // First this will ask for confirmation... Are you sure?
  const askForConfirmation = (type: "PAY_NOW" | "DEPOSIT") => () => {
    calculateTotalAmount();
    // Payment Modal
    setIsOpenMilestoneListModal(false);
    if (type === "PAY_NOW") {
      setShowPayNowModal(true);
      return;
    }
    setShowConfirmationModal(true);
  };

  const isFinalHourSubmitted = (jobdetails: typeof jobData) => {
    if (!jobdetails) return false;
    if (jobdetails?.jobType !== "hourly") return false;
    if (!Array.isArray(jobdetails?.milestones)) return false;

    let final_milestone = false;
    jobdetails?.milestones?.forEach(({ is_final_milestone }) => {
      if (!final_milestone) final_milestone = !!is_final_milestone;
    });

    return final_milestone;
  };

  useEffect(() => {
    if (jobData?.milestones && jobData?.milestones?.length > 0) {
      // Update disputeMileStone based on the first milestone with status
      const milestone = jobData?.milestones?.find((item) => item.status);
      if (milestone) {
        setDisputeMileStone(milestone.status);
      }
    }
  }, [jobData?.milestones]);

  // Attaching function to ref so it can be used by other components
  useEffect(() => {
    if (componentConnectorRef?.current?.openMilestoneListModal)
      componentConnectorRef.current.openMilestoneListModal = () => {
        setIsOpenMilestoneListModal(true);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !isOpenMilestoneListModal &&
      !showConfirmationModal &&
      !showPayNowModal
    ) {
      setSelectedMilestones([]);
    }
  }, [isOpenMilestoneListModal, showConfirmationModal, showPayNowModal]);

  return (
    <>
      {isOpenMilestoneListModal && (
        <MilestoneListModal
          jobdetails={jobData}
          setShow={setIsOpenMilestoneListModal}
          show={isOpenMilestoneListModal}
          setSelectedMilestones={setSelectedMilestones}
          selectedMilestones={selectedMilestones}
          milestones={jobData?.milestones}
          askForConfirmation={askForConfirmation}
        />
      )}
      <div className="flex items-center flex-wrap justify-center gap-3">
        {jobData?.status === "closed" && (
          <button
            type="button"
            className={`px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full hover:bg-black hover:text-white hover:scale-105 transition-transform duration-200 ${
              isMobile ? "mt-4 w-full" : ""
            }`}
            onClick={toggleJobsModal}
          >
            Invite to another project
          </button>
        )}

        {jobData?.activeTab === "m_stone" &&
        jobData?.status === "active" &&
        jobData?.closureReqBy !== "CLIENT" ? (
          <>
            {jobData && isFinalHourSubmitted(jobData) === false && (
              <CustomButton
                text={
                  jobData?.jobType === "hourly"
                    ? "Pay for Hours"
                    : "Accept Milestones"
                }
                className={`px-8 py-4 text-base font-normal bg-[#F2B420] text-[#212529] rounded-full transition-transform duration-200 hover:scale-105 ${
                  isMobile ? "mt-4 w-full" : ""
                }`}
                onClick={() => {
                  if (!isAnyPaymentPending()) {
                    toast.error(
                      jobData?.jobType === "hourly"
                        ? "The freelancer hasn't submitted any hours yet!"
                        : "No milestones to pay!"
                    );
                    return;
                  }
                  setIsOpenMilestoneListModal(true);
                }}
                disabled={!isAnyPaymentPending()}
              />
            )}

            {!jobData?.isClosureRequest ? (
              <CustomButton
                text="Close Project"
                className={`px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white ${
                  isMobile ? "mt-4 w-full" : ""
                }`}
                onClick={checkAnyOpenMilestone(
                  jobData?.jobType === "hourly"
                    ? toggleFreelancerClosureRequest
                    : disputeMilestone === "under_dispute"
                    ? openEndJobErrorModal
                    : openEndJobModal
                )}
              />
            ) : null}

            {jobData?.activeTab === "m_stone" &&
            jobData?.isClosureRequest &&
            jobData?.closureReqBy === "CLIENT" ? (
              <>
                {jobData?.jobType === "hourly" &&
                jobData?.isFinalMilestonePosted &&
                jobData?.enableEndJobButton ? (
                  <button
                    type="button"
                    className="mt-4 w-full px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={checkAnyOpenMilestone(openEndJobModal)}
                  >
                    Close Project
                  </button>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </div>

      <SelectJobModal
        show={showJobsModal}
        toggle={toggleJobsModal}
        onNext={onSelectJobAndContinue}
        freelancerName={
          jobData?.freelancerData?.first_name +
          " " +
          jobData?.freelancerData?.last_name
        }
        freelancerId={jobData?.freelancerUserId}
      />
      <InviteFreelancerMessageModal
        show={showInviteMessageModal}
        toggle={toggleInviteMessageModal}
        freelancerName={
          selectedFreelancer == null
            ? jobData?.freelancerData?.first_name +
                " " +
                jobData?.freelancerData?.last_name || ""
            : ""
        }
        onInvite={onInvite}
        loading={sendingInvite}
      />

      <EndModal
        show={endJobStatusModal.show || requireFeedbackHourlyClosedJob}
        endJobSelectedStatus={endJobStatusModal?.endJobSelectedStatus}
        toggle={closeEndJobModal}
        jobPostId={jobData?.jobPostId}
        onEndJob={toggleEndJobSuccessModal}
        onError={onEndJobError}
        freelancerName={
          jobData?.freelancerData?.first_name +
          " " +
          jobData?.freelancerData?.last_name
        }
        required={requireFeedbackHourlyClosedJob}
      />
      <JobEndedSuccessModal
        show={endJobSuccessModal}
        toggle={toggleEndJobSuccessModal}
      />
      <EndJobErrorModal
        show={showEndJobErrorModalState.show}
        toggle={closeEndJobErrorModal}
        goToMilestones={goToMilestones}
        error={showEndJobErrorModalState.error}
      />
      <InviteFreelancer
        show={freelancersModal}
        toggle={toggleFreelancersModal}
        onNext={openInviteMessageModal}
        jobPostId={jobData?.jobPostId}
      />
      <DeletePropmpt
        show={showDeleteJobModal}
        toggle={toggleDeleteJobModal}
        onDelete={onDelete}
        loading={loading}
        text={
          jobData?.status === "draft"
            ? "Are you sure you want to delete this draft? This cannot be undone."
            : "Are you sure you want to delete this project posting? This cannot be undone."
        }
      />

      <FreelancerClosureRequestModal
        show={freelancerClosureRequestModal}
        toggle={toggleFreelancerClosureRequest}
        onConfirm={onConfirm}
        loading={loading}
      />

      {showPaymentModal && (
        <PaymentModal
          show={showPaymentModal}
          onCancel={() => setShowPaymentModal(!showPaymentModal)}
          onPay={
            jobData.jobType === "hourly"
              ? handlePayAllHourlySubmissions
              : handlePayAllMilestonesSubmissions
          }
          processingPayment={paymentProcessing}
        />
      )}
      {showConfirmationModal && (
        <ConfirmPaymentModal
          show={showConfirmationModal}
          isReleasePrompt={false}
          toggle={() => setShowConfirmationModal(!showConfirmationModal)}
          onConfirm={() => onPayAllSubmissions()}
          loading={loading}
          buttonText={jobData.jobType === "hourly" ? "Pay" : "Accept & Deposit"}
        />
      )}

      {showPayNowModal && (
        <AcceptAndPaynowModal
          show={showPayNowModal}
          toggle={() => setShowPayNowModal((prev) => !prev)}
          handlePayment={() => onPayAllSubmissions("PAY_NOW")}
        />
      )}

      {/* Proposal Exists Modal */}
      <ProposalExistsModal
        job_post_id={selectedJobId}
        show={proposalExistModal}
        toggle={() => {
          setSelectedJobId("");
          setProposalExistModal((prev) => !prev);
        }}
      />
    </>
  );
};

export default QuickOptions;
