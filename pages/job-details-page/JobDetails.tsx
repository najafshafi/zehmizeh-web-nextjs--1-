/*
 * This is the main component of this route *
 */

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// import Spinner from "@/components/forms/Spin/Spinner";
import { useRouter, usePathname } from "next/navigation";
import SingleMessaging from "@/pages/messaging-page/SingleMessaging";
import Loader from "@/components/Loader";
import BackButton from "@/components/ui/BackButton";
import DetailsBanner from "./DetailsBanner";
import Tabs from "@/components/ui/Tabs";
// import { StyledButton } from "@/components/forms/Buttons";
import RequestEndJobModal from "./modals/RequestEndJobModal";
import GeneralDetails from "./GeneralDetails";
import ProposalDetails from "./ProposalDetails";
import Feedback from "./feedback";
import Milestones from "./milestones";
import HoursManagement from "./hours-management";
import useStartPageFromTop from "@/helpers/hooks/useStartPageFromTop";
import useResponsive from "@/helpers/hooks/useResponsive";
import useJobDetails from "./useJobDetails";
import JobClosureModal from "./modals/JobClosureModal";
import StripeCompleteWarning from "@/components/jobs/StripeCompleteWarning";
import AddHoursForm from "./hours-management/AddHoursForm";
import AddMilestoneForm from "./milestones/AddMilestoneForm";
import {
  cancelClosureRequest,
  acceptClosureRequest,
  jobClosureRequest,
  endJob,
} from "@/helpers/http/jobs";
import { getUser } from "@/helpers/http/auth";
import { useAuth } from "@/helpers/contexts/auth-context";
import { StatusBadge } from "@/components/styled/Badges";
import { changeStatusDisplayFormat } from "@/helpers/utils/misc";
import { JobClosuremodalProjectBased } from "./JobClosureModalProjectBased";
import NoDataFound from "@/components/ui/NoDataFound";
import { ChangeBudgetDeniedModal } from "@/components/changeBudget/ChangeBudgetDeniedModal";
import { ChangeBudgetRequestModal } from "@/components/changeBudget/ChangeBudgetRequestModal";
import { isProjectHiddenForFreelancer } from "@/helpers/utils/helper";
import moment from "moment";
import CustomButton from "@/components/custombutton/CustomButton";

// Add these interfaces right after the imports, before the component definition
interface Milestone {
  milestone_id: string;
  title: string;
  amount: number;
  status: string;
  description: string;
  is_final_milestone?: boolean;
  hourly_status?: string;
  date_created?: string;
  cancelled_date?: string;
}

interface Budget {
  type: string;
  amount?: number;
}

interface Proposal {
  status?: string;
  approved_budget?: Budget;
  is_viewed?: boolean;
}

interface Feedback {
  id: string;
  rating?: number;
  comment?: string;
  // Add other feedback properties as needed
}

interface UserData {
  user_id: string;
  name?: string;
  email?: string;
  // Add other user data properties as needed
}

interface JobDetails {
  job_post_id: string;
  _client_user_id: string;
  _freelancer_user_id: string;
  status: string;
  proposal?: Proposal;
  budget?: Budget;
  milestone: Milestone[];
  is_closure_request?: boolean;
  is_closure_request_accepted?: boolean;
  closure_req_submitted_by?: string;
  is_completed?: number;
  feedback?: Feedback;
  userdata?: UserData;
  is_client_feedback?: boolean;
  is_hidden?: {
    value: number;
    date: string;
  };
}

const JobDetails = () => {
  const user = useAuth();
  useStartPageFromTop();
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();

  // Extract the job ID and subtab from pathname
  const pathParts = pathname?.split("/") || [];
  const id = pathParts[2]; // Extract job ID from URL path
  const subtab = pathParts[3]; // Extract subtab from URL path

  const [showEndJobModal, setShowEndJobModal] = useState<boolean>(false);
  const [showJobClosureModal, setShowJobClosureModal] = useState<{
    show: boolean;
    loading?: boolean;
  }>({
    show: false,
    loading: false,
  });
  const [showHourForm, setShowHourForm] = useState<boolean>(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState<boolean>(false);
  const [checkingBanks, setCheckingBanks] = useState<boolean>(false);
  const [stripeWarningModalState, setStripeModalWarningState] = useState({
    show: false,
    stripeStatus: "",
  });

  const [isFinalHours, setIsFinalHours] = useState(false);

  /* This will load the job details */
  const { jobdetails, isLoading, refetch, tabItems, isRefetching } =
    useJobDetails(id) as {
      jobdetails: JobDetails | undefined;
      isLoading: boolean;
      refetch: () => void;
      tabItems: { key: string; label: string }[];
      isRefetching: boolean;
    };
  const [activeTab, setActiveTab] = useState<string>(subtab || "gen_details");

  const onTabChange = (value: string) => {
    /* This function will make the selected tab as active and change the below content */
    setActiveTab(value);
    router.push(`/job-details/${id}/${value}`);
  };

  useEffect(() => {
    if (user.user.user_type !== "freelancer") {
      router.push("/client/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    /* This will check it the job has pending proposal then this will set the active tab as "proposal details" tab by default */
    if (!isLoading && !isRefetching && jobdetails) {
      // const jobStatus = jobdetails?.status;
      // if (!['active', 'closed'].includes(jobStatus)) {
      //   if (jobdetails?.proposal?.status === 'pending') {
      //     setActiveTab('proposal_sent');
      //   }
      // }

      /** This will check if the job has been started but still user has not created any milestone,
       * then a popup explaining the next steps will be opened with a button to go to milestones tab,
       * as that will be the first step */

      if (
        jobdetails?.status === "active" &&
        jobdetails?.is_closure_request &&
        !jobdetails?.is_closure_request_accepted &&
        jobdetails?.closure_req_submitted_by === "CLIENT" &&
        jobdetails?.milestone.filter((x: Milestone) => x.is_final_milestone)
          .length === 0 &&
        !pathname?.includes("dontShowJobClosureModal")
      ) {
        setShowJobClosureModal({
          show: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isRefetching, jobdetails]);

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      if (pathParts.length >= 4) {
        const tabValue = pathParts[3];
        if (
          tabValue &&
          tabItems.some((tab: { key: string }) => tab.key === tabValue)
        ) {
          setActiveTab(tabValue);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabItems]);

  /** @function This function will toggle end job modal */
  const toggleEndJobModal = () => {
    setShowEndJobModal((prev) => !prev);
  };

  const closeJobClosureModal = () => {
    setShowJobClosureModal({
      show: false,
    });
  };

  const toggleHourForm = () => {
    setShowHourForm(!showHourForm);
  };

  const toggleMilestoneForm = () => {
    setShowMilestoneForm(!showMilestoneForm);
  };

  const onSubmitFinalMilestone = () => {
    setIsFinalHours(false);
    toggleHourForm();
    closeJobClosureModal();
    refetch();
  };

  const onConfirm = (selectedOption: string) => {
    if (selectedOption === "decide_later") {
      onCancelClosureRequest();
    } else if (selectedOption === "end_job") {
      onAcceptClosureRequest();
    } else {
      toast.dismiss();
      /* Add Final MileStone */
      setIsFinalHours(true);
      setShowHourForm(!showHourForm);
      // toggleJobClosureModal();
    }
  };

  const onConfirmProjectBasedCloseJob = (
    selectedOption: "not_yet" | "decline_closure" | "accept"
  ) => {
    switch (selectedOption) {
      case "not_yet": {
        setShowJobClosureModal({ show: false, loading: false });
        break;
      }
      case "decline_closure": {
        onCancelClosureRequest();
        break;
      }
      case "accept": {
        onConfirmEndJobRequest();
        break;
      }
      default:
        setShowJobClosureModal({ show: false, loading: false });
    }
  };

  const onAcceptClosureRequest = () => {
    if (!jobdetails) return;

    const body = {
      job_id: jobdetails.job_post_id,
    };
    setShowJobClosureModal((prev) => ({ ...prev, loading: true }));
    toast.loading("Please wait...");
    acceptClosureRequest(body)
      .then((res) => {
        toast.dismiss();
        if (res.status) {
          closeJobClosureModal();
          toast.success(res.response);
          refetch();
        } else {
          closeJobClosureModal();
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.dismiss();
        closeJobClosureModal();
        toast.error(err?.response?.data?.message);
      });
  };

  const onConfirmEndJobRequest = () => {
    if (!jobdetails) return;

    const body = {
      job_id: jobdetails.job_post_id,
      status: "in-complete",
      reason: "freelancer hasnt been paid at all",
      incomplete_description: "",
    };
    setShowJobClosureModal((prev) => ({ ...prev, loading: true }));
    toast.loading("Please wait...");
    endJob(body)
      .then((res) => {
        toast.dismiss();
        if (res.status) {
          closeJobClosureModal();
          toast.success(res.message);
          refetch();
        } else {
          closeJobClosureModal();
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.dismiss();
        closeJobClosureModal();
        toast.error(err?.response?.data?.message);
      });
  };

  const onCancelClosureRequest = () => {
    if (!jobdetails) return;

    setShowJobClosureModal((prev) => ({ ...prev, loading: true }));
    const promise = cancelClosureRequest(jobdetails.job_post_id);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        refetch();
        closeJobClosureModal();
        return res.response;
      },
      error: (err) => {
        closeJobClosureModal();
        return err?.response?.data?.message || "error";
      },
    });
  };

  const showStripeWarning = (status: string) => {
    setStripeModalWarningState({
      show: true,
      stripeStatus: status,
    });
  };

  const handleAddHours = () => {
    // On click of add hours
    setCheckingBanks(true);

    /* This will first check if the user has added bank account or not
     * If yes, then it will open add milestone popup otherwise
     * It will open the warning popup to complete stripe | add bank accounts (if not added)
     */

    getUser().then((res) => {
      const accounts = res?.data?.account;
      if (accounts?.length > 0) {
        /* This will open add hours modal */
        toggleHourForm();
      } else {
        /* This will open the warning popup */
        showStripeWarning(res?.data?.stp_account_status);
      }
      setCheckingBanks(false);
    });
  };

  const handleAddMilestone = () => {
    setCheckingBanks(true);
    getUser().then((res) => {
      const accounts = res?.data?.account;
      if (accounts?.length > 0) {
        setShowMilestoneForm(true);
      } else {
        /* This will show that stripe warning popup */
        showStripeWarning(res?.data?.stp_account_status);
      }
      setCheckingBanks(false);
    });
  };

  const closeStripeModal = () => {
    setStripeModalWarningState({
      show: false,
      stripeStatus: "",
    });
  };

  const onCloseJob = () => {
    if (!jobdetails) return;

    const promise = jobClosureRequest({ job_id: jobdetails.job_post_id });
    toast.promise(promise, {
      loading: "Loading...",
      error: (err) => {
        toggleEndJobModal();
        return err?.response?.data?.message;
      },
      success: (resp) => {
        toggleEndJobModal();
        refetch();
        return resp.response;
      },
    });
  };

  // If job not found then redirecting to 404 page
  if (!isLoading && !isRefetching && !jobdetails) {
    router.push("/404");
  }

  const status = useMemo(() => {
    if (jobdetails?.status) {
      switch (jobdetails?.status) {
        case "active": {
          if (jobdetails?.proposal?.status === "denied") {
            return { text: "Declined", color: "darkPink" };
          }
          // If client requests to close project
          if (
            jobdetails?.budget?.type === "fixed" &&
            jobdetails?.is_closure_request
          )
            return {
              text: "Client Requested to End the Project",
              color: "darkPink",
            };

          if (jobdetails?.proposal?.status === "awarded")
            return { text: "Awarded to Another Freelancer", color: "darkPink" };

          return { text: "Work in Progress", color: "blue" };
        }
        case "deleted":
          return { text: "Canceled by Client", color: "darkPink" };
        case "prospects": {
          if (jobdetails?.proposal?.status === "pending")
            return { color: "yellow", text: "Pending" };
          if (jobdetails?.proposal?.status === "denied")
            return { text: "Declined", color: "darkPink" };
          return {
            text: changeStatusDisplayFormat(jobdetails?.status),
            color: "yellow",
          };
        }
        case "closed": {
          if (jobdetails?.proposal?.status === "denied")
            return { text: "Declined", color: "darkPink" };
          return { text: "Closed", color: "green" };
        }
        default:
          return {
            text: changeStatusDisplayFormat(jobdetails?.status),
            color: "yellow",
          };
      }
    }
    return undefined;
  }, [jobdetails]);

  if (isProjectHiddenForFreelancer(jobdetails)) {
    toast.error(
      `Client has hidden this post - ${moment(
        jobdetails?.is_hidden?.date
      ).format("MMM DD, YYYY")}`
    );
    router.back();
    return <></>;
  }

  return (
    <div className="w-full px-4 lg:px-0 py-12 pb-25 max-w-[970px] mx-auto">
      {/* Back button header */}
      <BackButton
        route={user.user.user_type === "freelancer" ? "/jobs" : "/client-jobs"}
      />

      {isLoading || isRefetching ? <Loader /> : null}

      {/* Details Banner */}

      {!isLoading && !isRefetching && jobdetails && (
        <DetailsBanner data={jobdetails} refetch={refetch} />
      )}

      {!isLoading && !isRefetching && jobdetails && (
        <>
          {/* Tabs and request to end button */}
          {tabItems.length > 1 && (
            <div className="actions flex items-center justify-between flex-wrap gap-3 mt-8 md:flex md:justify-center md:items-center">
              <div className="flex items-center justify-between w-full flex-wrap gap-3">
                <div>
                  <Tabs
                    tabs={tabItems}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    fontSize="1rem"
                  />
                </div>
                <div>
                  {status && (
                    <div className="flex gap-3">
                      <StatusBadge color={status.color}>
                        {status.text}
                      </StatusBadge>
                      {jobdetails?.proposal?.status === "pending" && (
                        <StatusBadge
                          color={
                            jobdetails?.proposal?.is_viewed ? "green" : "red"
                          }
                        >
                          {jobdetails?.proposal?.is_viewed ? "Read" : "Unread"}
                        </StatusBadge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Swapping Propose New Milestone/Submit New Hours button with Request to close job */}

              <div className="flex items-center justify-between flex-1">
                {activeTab === "m_stone" &&
                jobdetails.proposal?.approved_budget?.type == "hourly" &&
                jobdetails.status !== "closed" &&
                !(
                  jobdetails?.is_closure_request &&
                  jobdetails?.closure_req_submitted_by
                ) ? (
                  <div className="flex justify-center items-center">
                    <CustomButton
                      text={"Submit Hours"}
                      disabled={
                        checkingBanks ||
                        jobdetails?.milestone.filter(
                          (x: Milestone) => x.is_final_milestone
                        ).length > 0
                      }
                      className={`px-[2rem] py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5 ${
                        isMobile
                          ? "add-button"
                          : "submit-hours-button add-button"
                      }`}
                      onClick={() => {
                        setIsFinalHours(false);
                        handleAddHours();
                      }}
                      showSpinner={checkingBanks}
                      spinnerPosition="right"
                    />
                  </div>
                ) : null}
                {activeTab === "m_stone" &&
                jobdetails?.status === "active" &&
                !jobdetails?.is_closure_request &&
                jobdetails?.budget?.type == "hourly" ? (
                  <div
                    className={`flex justify-end items-center ${
                      isMobile || isTablet ? "" : "w-full"
                    }`}
                  >
                    <CustomButton
                      text={" Request to Close Project"}
                      disabled={
                        checkingBanks ||
                        jobdetails?.milestone.filter(
                          (x: Milestone) => x.is_final_milestone
                        ).length > 0
                      }
                      className={`px-[2rem] py-4 w-full min-w-[21rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5 ${
                        isMobile || isTablet ? "" : "w-full"
                      }`}
                      onClick={toggleEndJobModal}
                    />
                  </div>
                ) : null}
              </div>

              {jobdetails.proposal?.approved_budget?.type == "fixed" &&
                jobdetails.status !== "closed" &&
                activeTab === "m_stone" &&
                !(
                  jobdetails?.is_closure_request &&
                  jobdetails?.closure_req_submitted_by
                ) && (
                  <div className="flex justify-center items-center">
                    <CustomButton
                      text={"Propose New Milestone"}
                      showSpinner={checkingBanks}
                      spinnerPosition="right"
                      className="px-[2rem] py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
                      onClick={handleAddMilestone}
                      disabled={checkingBanks}
                    />
                  </div>
                )}

              {jobdetails?.status === "active" ? (
                <>
                  {jobdetails?.is_closure_request ? (
                    <>
                      {jobdetails?.budget?.type === "hourly" && (
                        <>
                          <div className="opacity-50 flex md:justify-end justify-center flex-1">
                            {jobdetails?.closure_req_submitted_by ===
                            "FREELANCER"
                              ? "Request to close project submitted."
                              : jobdetails?.milestone.filter(
                                  (x: Milestone) => x.is_final_milestone
                                ).length > 0 &&
                                (jobdetails?.milestone[0]?.hourly_status ===
                                  "paid" ||
                                  jobdetails?.milestone[0]?.hourly_status ===
                                    "released")
                              ? "Waiting for client to end the project"
                              : jobdetails?.milestone.filter(
                                  (x: Milestone) => x.is_final_milestone
                                ).length > 0
                              ? "Final Hours Submitted"
                              : jobdetails?.is_closure_request_accepted
                              ? "Accepted client closure request"
                              : "Client has requested to End the Project"}
                          </div>
                        </>
                      )}
                      {jobdetails?.budget?.type === "fixed" && (
                        <div className="w-full text-center">
                          <CustomButton
                            text={" Open the Client&apos;s Closure Request"}
                            className="px-[2rem] py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] mt-5"
                            onClick={() => {
                              setShowJobClosureModal({
                                show: true,
                                loading: false,
                              });
                            }}
                            disabled={showJobClosureModal.loading}
                          />
                        </div>
                      )}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          )}

          {/* The following will render the content of the selected tab */}

          {activeTab == "proposal_sent" && (
            <ProposalDetails
              isDeleted={jobdetails.status === "deleted"}
              data={jobdetails?.proposal}
              jobDetails={jobdetails}
              refetch={refetch}
            />
          )}
          {activeTab == "gen_details" && <GeneralDetails data={jobdetails} />}
          {activeTab == "messages" && id && <SingleMessaging id={id} />}
          {activeTab == "feedback" && jobdetails?.is_completed === 0 && (
            <NoDataFound
              className="py-5"
              title="You can't submit review to client."
            />
          )}
          {activeTab == "feedback" && jobdetails?.is_completed === 1 && (
            <Feedback
              feedbackData={jobdetails?.feedback}
              clientDetails={jobdetails?.userdata}
              jobPostId={jobdetails?.job_post_id}
              clientUserId={jobdetails?._client_user_id}
              freelancerUserId={jobdetails?._freelancer_user_id}
              isClientFeedback={jobdetails?.is_client_feedback}
              onSubmitFeedback={refetch}
            />
          )}
          {activeTab === "m_stone" && (
            <>
              {jobdetails.proposal?.approved_budget?.type == "fixed" && (
                <Milestones
                  milestone={jobdetails?.milestone}
                  jobStatus={jobdetails.status}
                  refetch={refetch}
                  clientUserId={jobdetails?._client_user_id}
                  jobPostId={jobdetails?.job_post_id}
                  restrictPostingMilestone={jobdetails?.is_closure_request}
                  remainingBudget={
                    jobdetails?.milestone?.filter(
                      (y: Milestone) =>
                        !["cancelled", "decline_dispute", "decline"].includes(
                          y.status
                        )
                    )?.length > 0
                      ? jobdetails.proposal?.approved_budget?.amount -
                        jobdetails?.milestone
                          ?.filter(
                            (y: Milestone) =>
                              ![
                                "cancelled",
                                "decline_dispute",
                                "decline",
                              ].includes(y.status)
                          )
                          .map((x: Milestone) => x.amount)
                          .reduce((a: number, b: number) => a + b)
                      : jobdetails.proposal?.approved_budget?.amount
                  }
                />
              )}
              {jobdetails.proposal?.approved_budget?.type == "hourly" && (
                <HoursManagement
                  milestone={jobdetails?.milestone}
                  refetch={refetch}
                  jobPostId={jobdetails?.job_post_id}
                  hourlyRate={jobdetails?.proposal?.approved_budget?.amount}
                />
              )}
            </>
          )}
        </>
      )}

      {/* START ----------------------------------------- Project based project closure modal */}
      {!!jobdetails?.is_closure_request &&
        jobdetails?.budget?.type === "fixed" &&
        showJobClosureModal.show && (
          <JobClosuremodalProjectBased
            show={showJobClosureModal.show}
            loading={showJobClosureModal.loading || false}
            onConfirm={onConfirmProjectBasedCloseJob}
          />
        )}
      {/* END ------------------------------------------- Project based project closure modal */}

      {/* START ----------------------------------------- Hourly based project closure modal */}
      {!!jobdetails?.is_closure_request &&
        jobdetails?.budget?.type !== "fixed" && (
          <JobClosureModal
            show={showJobClosureModal.show}
            loading={showJobClosureModal.loading || false}
            onConfirm={onConfirm}
          />
        )}
      {/* END ------------------------------------------- Hourly based project closure modal */}

      <AddHoursForm
        show={showHourForm}
        toggle={toggleHourForm}
        onSubmit={onSubmitFinalMilestone}
        jobPostId={jobdetails?.job_post_id}
        selectedMilestone={null}
        hourlyRate={jobdetails?.proposal?.approved_budget?.amount}
        isFinalHours={isFinalHours}
      />
      <AddMilestoneForm
        show={showMilestoneForm}
        toggle={toggleMilestoneForm}
        onSubmit={refetch}
        clientUserId={jobdetails?._client_user_id}
        jobPostId={jobdetails?.job_post_id}
        remainingBudget={
          jobdetails?.milestone?.filter(
            (y: Milestone) =>
              !["cancelled", "decline_dispute", "decline"].includes(y.status)
          )?.length > 0
            ? jobdetails?.proposal?.approved_budget?.amount -
              jobdetails?.milestone
                ?.filter(
                  (y: Milestone) =>
                    !["cancelled", "decline_dispute", "decline"].includes(
                      y.status
                    )
                )
                .map((x: Milestone) => x.amount)
                .reduce((a: number, b: number) => a + b)
            : jobdetails?.proposal?.approved_budget?.amount
        }
      />
      {/* <NextStepModal show={showNextStepModal} toggle={closeNextStepModal} /> */}
      <RequestEndJobModal
        show={showEndJobModal}
        toggle={toggleEndJobModal}
        onConfirm={() => onCloseJob()}
      />

      {/* Stripe | bank details popup */}
      <StripeCompleteWarning
        show={stripeWarningModalState?.show}
        stripeStatus={stripeWarningModalState?.stripeStatus}
        toggle={closeStripeModal}
      />
      {jobdetails?.proposal?.approved_budget && (
        <>
          <ChangeBudgetRequestModal
            jobDetails={jobdetails}
            userType="freelancer"
          />
          <ChangeBudgetDeniedModal
            jobDetails={jobdetails}
            refetch={refetch}
            userType="freelancer"
          />
        </>
      )}
    </div>
  );
};

export default JobDetails;
