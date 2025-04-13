"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VscClose } from "react-icons/vsc";
import toast from "react-hot-toast";
import moment from "moment";
import Tooltip from "@/components/ui/Tooltip";
import Loader from "@/components/Loader";
import { StatusBadge } from "@/components/styled/Badges";
import {
  getProposalDetails,
  acceptProposal,
  getInviteeDetails,
} from "@/helpers/http/proposals";
import useResponsive from "@/helpers/hooks/useResponsive";
import {
  numberWithCommas,
  separateValuesWithComma,
} from "@/helpers/utils/misc";
import LocationIcon from "@/public/icons/location-blue.svg";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import BlurredImage from "@/components/ui/BlurredImage";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import ProposalMessageModal from "./ProposalMessageModal";
import { WarningFreelancerMessageModal } from "./WarningFreelancerMessageModal";
import { useQueryClient } from "react-query";
import {
  getTimeEstimation,
  getValueByPercentage,
} from "@/helpers/utils/helper";
import { TProposalDetails } from "@/helpers/types/proposal.type";
import { JOBS_STATUS } from "@/app/jobs/consts";
import InviteFreelancerMessageModal from "@/components/invite-flow-modals/InviteFreelancerMessageModal";
import { updateInvitationStatus, editInvitation } from "@/helpers/http/jobs";
import { TInviteSentDetails } from "@/helpers/types/invite.type";
import { HiringMoreFreelancerModal } from "./HiringMoreFreelancerModal";
import {
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "@/helpers/http/common";
import { useAuth } from "@/helpers/contexts/auth-context";
import ChatModal from "@/components/talkjs/chat-modal";
import PaymentTermsPopup from "@/components/PaymentTermsPopup";

interface Props {
  show: boolean;
  toggle: () => void;
  selectedProposalId: string;
  refetch: (shouldToggleModal?: boolean) => void;
  replyOnProjectPageBtn?: boolean;
  type?: "proposal" | "invite";
}

const ProposalDetailsModal = ({
  show,
  toggle,
  selectedProposalId,
  refetch,
  replyOnProjectPageBtn = false,
  type = "proposal",
}: Props) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const [showPaymentTerms, setShowPaymentTerms] = useState<boolean>(false);
  const [pendingChatAction, setPendingChatAction] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] =
    useState<boolean>(false);
  const [proposalDetails, setProposalDetails] = useState<
    Partial<TProposalDetails & TInviteSentDetails>
  >({});
  const [proMessModal, setProMessModal] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [
    isShowingHiringMoreFreelancerModal,
    setIsShowingHiringMoreFreelancerModal,
  ] = useState(false);
  const [warningPopupCount, setWarningPopupCount] = useState(0);
  const [threadLoading, setThreadLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>();
  const [freelancerName, setFreelancerName] = useState<string>();
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const closeChatModal = () => {
    setOpenChatModal(false);
    setConversationId("");
  };

  const conversationHandler = async () => {
    if (threadLoading) return false;
    setShowPaymentTerms(true);
    setPendingChatAction(true);
  };

  const handlePaymentTermsAccept = () => {
    setShowPaymentTerms(false);
    setPendingChatAction(false);

    setThreadLoading(true);
    toast.loading("loading chat...");
    const chatProposalId = `proposal_${proposalDetails.proposal_id}`;

    const initializeChat = async () => {
      const { conversation } =
        await talkJsFetchSingleConversation(chatProposalId);
      toast.remove();

      setFreelancerName(
        `${proposalDetails.first_name} ${proposalDetails.last_name}`
      );
      if (conversation?.data !== null) {
        setConversationId(chatProposalId);
        setThreadLoading(false);
        setOpenChatModal(true);
        return null;
      }

      const payload = {
        conversationId: chatProposalId,
        clientId: user.user_id,
        freelancerId: proposalDetails.user_id,
        subject: proposalDetails.job_title,
        custom: {
          projectName: proposalDetails.job_title,
          jobPostId: proposalDetails._job_post_id,
        },
      };

      const promise = talkJsCreateNewThread(payload);

      toast.promise(promise, {
        loading: "create thread...",
        success: () => {
          setThreadLoading(false);
          setConversationId(payload.conversationId);
          setOpenChatModal(true);
          return "thread created successfully";
        },
        error: (err) => {
          setThreadLoading(false);
          return "Error: " + err.toString();
        },
      });
    };

    initializeChat();
  };

  const handlePaymentTermsClose = () => {
    setShowPaymentTerms(false);
    setPendingChatAction(false);
  };

  const closeModal = () => {
    setLoading(false);
    toggle();
    queryClient.refetchQueries({ queryKey: ["get-job-applicant"] });
  };

  const getMessageFreelancerPopupCount = useCallback(
    (jobId: string) => {
      const proposals: any = queryClient.getQueryData([
        "get-received-proposals",
      ]);
      const dashboardJobDetails = proposals?.data?.find(
        (proposal: any) => proposal?.job_post_id === jobId
      );

      const clientJobDetails: any = queryClient.getQueryData([
        "jobdetails",
        jobId,
      ]);
      return (
        dashboardJobDetails?.message_freelancer_popup_count ||
        clientJobDetails?.data?.message_freelancer_popup_count ||
        0
      );
    },
    [queryClient]
  );

  const onEditInvitation = (msg: string) => {
    const body: any = {
      invite_id: proposalDetails?.invite_id,
      invite_message: msg,
    };
    editInvitation(body)
      .then((res) => {
        if (res.status) {
          toast.success(res.message);
          toggleInviteMessageModal();
          setLoading(false);
          refetch();
        } else {
          setLoading(false);
          toast.error(
            res?.message ? res?.message : "Invitation not edit successfully!"
          );
        }
      })
      .catch(() => {});
  };

  const updateStatus = (
    status: Parameters<typeof updateInvitationStatus>["1"]
  ) => {
    setLoading(true);
    const promise = updateInvitationStatus(proposalDetails?.invite_id, status);
    toast.promise(promise, {
      loading: "please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        return res.message;
      },
      error: (err) => {
        const resp = err?.response?.data ?? {};
        setLoading(false);
        return resp?.message ?? (err?.message || "error");
      },
    });
  };

  const jobDetails = useMemo(() => {
    if (!proposalDetails?._job_post_id) return;
    const proposals: any = queryClient.getQueryData(["get-received-proposals"]);
    const dashboardJobDetails = proposals?.data?.find(
      (proposal: any) => proposal?.job_post_id === proposalDetails._job_post_id
    );

    const clientJobDetails: any = queryClient.getQueryData([
      "jobdetails",
      proposalDetails._job_post_id,
    ]);
    return dashboardJobDetails?.data || clientJobDetails?.data;
  }, [proposalDetails, queryClient]);

  useEffect(() => {
    if (
      selectedProposalId !== null &&
      selectedProposalId !== "" &&
      type === "proposal"
    ) {
      setFetching(true);
      getProposalDetails(selectedProposalId).then((res) => {
        setProposalDetails(res.data);
        setFetching(false);
        setWarningPopupCount(
          getMessageFreelancerPopupCount(res.data._job_post_id)
        );
      });
    } else if (
      selectedProposalId !== null &&
      selectedProposalId !== "" &&
      type === "invite"
    ) {
      setFetching(true);
      getInviteeDetails(selectedProposalId).then((res) => {
        setProposalDetails(res.data);
        setFetching(false);
        setWarningPopupCount(
          getMessageFreelancerPopupCount(res.data._job_post_id)
        );
      });
    }
  }, [getMessageFreelancerPopupCount, selectedProposalId, type]);

  const onAcceptDecline =
    (
      status: "denied" | "pending" | "accept",
      canHireMoreFreelancers?:
        | "ACCEPT_AND_DECLINE_REST"
        | "ACCEPT_AND_LEAVE_OPEN"
    ) =>
    () => {
      setLoading(true);
      const body = {
        status,
        proposal_id: selectedProposalId,
        approved_budget: {
          start_date: moment(new Date()).format("DD-MM-YYYY"),
        },
        can_hire_more_freelancers: false,
      };

      if (status === "accept") {
        body.can_hire_more_freelancers =
          canHireMoreFreelancers === "ACCEPT_AND_LEAVE_OPEN";
      }

      const promise = acceptProposal(body);
      toast.promise(promise, {
        loading: `${status == "accept" ? "Accepting" : status == "pending" ? "Reopening" : "Declining"} the proposal...`,
        success: (res) => {
          setLoading(false);
          refetch(status === "accept" ? false : true);
          if (proposalDetails?._job_post_id)
            router.push(`/client-job-details/${proposalDetails._job_post_id}`);
          return res.message;
        },
        error: (err) => {
          const resp = err?.response?.data ?? {};
          setLoading(false);
          return resp?.message ?? (err?.message || "error");
        },
      });
    };

  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const handleAcceptFreelancer = () => {
    toggle();
    setIsShowingHiringMoreFreelancerModal(true);
  };

  const proposalStatus = {
    denied:
      jobDetails?.status === "prospects" &&
      type === "proposal" &&
      !replyOnProjectPageBtn &&
      proposalDetails?.status === "denied",
    pending:
      jobDetails?.status === "prospects" &&
      type === "proposal" &&
      !replyOnProjectPageBtn &&
      proposalDetails?.status === "pending",
  };

  const inviteStatus = {
    pending:
      jobDetails?.status === "prospects" &&
      proposalDetails?.status === "pending" &&
      type === "invite",
    canceled:
      jobDetails?.status === "prospects" &&
      proposalDetails?.status === "canceled" &&
      type === "invite",
    read:
      jobDetails?.status === "prospects" &&
      proposalDetails?.status === "read" &&
      type === "invite",
  };

  if (!show) return null;

  return (
    <>
      {proMessModal && proposalDetails && !proposalDetails?.threadExists && (
        <ProposalMessageModal
          show
          setShow={setProMessModal}
          freelancerName={`${proposalDetails?.first_name || ""} ${proposalDetails?.last_name || ""}`}
          proposal={proposalDetails as any}
          jobId={proposalDetails?._job_post_id || ""}
          messagePopupCount={warningPopupCount}
        />
      )}
      {isWarningModalOpen && (
        <WarningFreelancerMessageModal
          show
          setShow={setIsWarningModalOpen}
          onContinue={() => {
            setProMessModal(true);
          }}
        />
      )}

      {showInviteMessageModal === true && (
        <InviteFreelancerMessageModal
          show={showInviteMessageModal}
          toggle={toggleInviteMessageModal}
          freelancerName={`${proposalDetails?.first_name} ${proposalDetails?.last_name}`}
          inviteMessage={`${proposalDetails.invite_message}`}
          onInvite={onEditInvitation}
          isEditFlag={true}
          loading={loading}
        />
      )}

      <PaymentTermsPopup
        show={showPaymentTerms}
        onClose={handlePaymentTermsClose}
        onAccept={handlePaymentTermsAccept}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={closeModal}
        />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-[767px] transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <VscClose className="h-6 w-6" />
              </button>

              {fetching ? (
                <Loader />
              ) : (
                <div className={`mt-10 ${isMobile ? "relative" : ""}`}>
                  {/* Declined Headline */}
                  {(proposalStatus.denied || inviteStatus.canceled) && (
                    <div className="absolute top-0 left-0 w-full overflow-hidden bg-orange-100 text-center rounded-t-xl py-1.5">
                      <span className="text-sm">
                        {proposalStatus.denied
                          ? `You declined this proposal - ${moment(
                              proposalDetails.status_change_timestamp
                                ?.denied_date
                            ).format("MMM DD, YYYY")}`
                          : `You canceled this invite - ${moment(
                              proposalDetails.status_change_timestamp
                                ?.canceled_date
                            ).format("MMM DD, YYYY")}`}
                      </span>
                    </div>
                  )}

                  {/* View Profile Link */}
                  {replyOnProjectPageBtn ? (
                    <div
                      className={`${isMobile ? "relative" : "absolute right-8 top-4"}`}
                    >
                      <button
                        onClick={() =>
                          router.push(
                            `/client-job-details/${proposalDetails._job_post_id}/applicants`
                          )
                        }
                        className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                        disabled={loading}
                      >
                        See Project Post
                      </button>
                    </div>
                  ) : proposalDetails?.user_id ? (
                    <Link
                      href={`/freelancer/${proposalDetails?.user_id}`}
                      className={`${isMobile ? "relative" : "absolute right-8 top-4"}`}
                    >
                      <button
                        className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                        disabled={loading}
                      >
                        See Freelancer Profile
                      </button>
                    </Link>
                  ) : null}

                  <div className="space-y-9">
                    {/* Freelancer Details */}
                    <div className="flex flex-wrap gap-8">
                      <div className="w-full space-y-2.5">
                        <div className="flex items-center gap-2">
                          <BlurredImage
                            src={
                              proposalDetails?.user_image ||
                              "/images/default_avatar.png"
                            }
                            height="80px"
                            width="80px"
                          />
                          <div
                            className={`${isMobile ? "w-full" : "w-[calc(100%-266px-3rem)]"}`}
                          >
                            <Link
                              href={`/freelancer/${proposalDetails?.user_id}`}
                              className={`text-xl font-normal capitalize mr-2 ${
                                replyOnProjectPageBtn
                                  ? "text-amber-500 underline"
                                  : ""
                              }`}
                            >
                              {proposalDetails?.first_name}{" "}
                              {proposalDetails?.last_name}
                            </Link>
                            <div className="inline-block">
                              {type === "proposal" &&
                              proposalDetails?.is_agency ? (
                                <StatusBadge color="blue">Agency</StatusBadge>
                              ) : null}
                              {type === "invite" && (
                                <StatusBadge
                                  className="w-fit"
                                  color={
                                    proposalDetails?.status &&
                                    typeof proposalDetails.status ===
                                      "string" &&
                                    proposalDetails.status in JOBS_STATUS
                                      ? JOBS_STATUS[
                                          proposalDetails.status as keyof typeof JOBS_STATUS
                                        ]?.color
                                      : "gray"
                                  }
                                >
                                  {proposalDetails?.status == "pending"
                                    ? "Unread"
                                    : proposalDetails?.status}
                                </StatusBadge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-normal text-gray-500 capitalize">
                          {proposalDetails?.job_title}
                        </div>
                        {proposalDetails?.invite_message && (
                          <div className="space-y-2">
                            <span className="text-lg font-bold">
                              Invite Message
                            </span>
                            <div className="text-lg font-normal text-gray-500">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: proposalDetails?.invite_message,
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {type === "proposal" &&
                          (proposalDetails?.location?.state ||
                            proposalDetails?.location?.country_name) && (
                            <div className="flex items-center gap-2">
                              <LocationIcon />
                              <div className="text-lg font-normal text-gray-500">
                                {separateValuesWithComma([
                                  proposalDetails?.location?.state,
                                  proposalDetails?.location?.country_name,
                                ])}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-lg font-bold">
                          {type === "proposal" ? "Proposal" : "Invite"}
                        </div>
                        {proposalDetails?.date_created && (
                          <div className="text-base font-light">
                            {type === "proposal" ? "Submitted" : "Sent"}:{" "}
                            {moment(proposalDetails.date_created).format(
                              "MMM DD, YYYY"
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-lg font-normal text-gray-500 leading-relaxed">
                        <StyledHtmlText
                          htmlString={proposalDetails?.description || ""}
                          id={`proposal_${selectedProposalId}`}
                        />
                      </div>
                    </div>

                    {/* Price and Time Estimation */}
                    <div className="space-y-4">
                      {type === "proposal" && (
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <div className="text-base font-bold">Price:</div>
                            <div className="text-base font-light">
                              {numberWithCommas(
                                proposalDetails?.proposed_budget?.amount || 0,
                                "USD"
                              )}
                              {proposalDetails?.proposed_budget?.type ==
                              "hourly"
                                ? `/hr`
                                : ``}
                            </div>
                          </div>
                          <Tooltip>
                            <div>Price With Fees:</div>
                            <div>
                              {numberWithCommas(
                                getValueByPercentage(
                                  Number(
                                    proposalDetails?.proposed_budget?.amount ||
                                      0
                                  ),
                                  102.9
                                ),
                                "USD"
                              )}
                              {proposalDetails?.proposed_budget?.type ==
                              "hourly"
                                ? `/hr`
                                : ``}{" "}
                              -{" "}
                              {numberWithCommas(
                                getValueByPercentage(
                                  Number(
                                    proposalDetails?.proposed_budget?.amount ||
                                      0
                                  ),
                                  104.9
                                ),
                                "USD"
                              )}
                              {proposalDetails?.proposed_budget?.type ==
                              "hourly"
                                ? `/hr`
                                : ``}
                            </div>
                          </Tooltip>
                        </div>
                      )}

                      {proposalDetails?.proposed_budget?.time_estimation && (
                        <div className="flex items-center gap-2">
                          <div className="text-base font-bold">
                            Time Estimation:
                          </div>
                          <div className="text-base font-light">
                            {getTimeEstimation(
                              proposalDetails?.proposed_budget?.time_estimation,
                              proposalDetails?.proposed_budget?.type == "hourly"
                                ? "hours"
                                : "weeks"
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    {proposalDetails?.terms_and_conditions && (
                      <div className="space-y-2">
                        <div className="text-base font-bold">
                          Special Terms & Conditions:
                        </div>
                        <div className="text-lg font-light text-gray-500">
                          <StyledHtmlText
                            id="termsAndConditions"
                            htmlString={proposalDetails.terms_and_conditions}
                            needToBeShorten={true}
                          />
                        </div>
                      </div>
                    )}

                    {/* Questions */}
                    {proposalDetails?.questions && (
                      <div className="space-y-2">
                        <div className="text-base font-bold">Questions:</div>
                        <div className="text-lg font-light text-gray-500">
                          <StyledHtmlText
                            id="questions"
                            htmlString={proposalDetails.questions}
                            needToBeShorten={true}
                          />
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {proposalDetails?.attachments &&
                      proposalDetails?.attachments?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-base font-bold">
                            Attachments:
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {proposalDetails.attachments.map((attachment) => (
                              <div key={attachment}>
                                <AttachmentPreview
                                  uploadedFile={attachment}
                                  removable={false}
                                  shouldShowFileNameAndExtension={false}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-4">
                    <div className="h-px bg-black/10" />
                    <div className="flex flex-wrap gap-3">
                      {replyOnProjectPageBtn &&
                        type === "proposal" &&
                        proposalDetails?._job_post_id && (
                          <>
                            <button
                              onClick={() => conversationHandler()}
                              className="w-full md:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                              disabled={loading}
                            >
                              Message Freelancer
                            </button>
                            <button
                              onClick={onAcceptDecline("denied")}
                              className="w-full md:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                              disabled={loading}
                            >
                              Decline Proposal
                            </button>
                            <button
                              onClick={handleAcceptFreelancer}
                              className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                              disabled={loading}
                            >
                              Accept Proposal
                            </button>
                          </>
                        )}

                      {proposalStatus.pending && (
                        <>
                          <button
                            onClick={() => conversationHandler()}
                            className="w-full md:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            disabled={loading}
                          >
                            Message Freelancer
                          </button>
                          <button
                            onClick={onAcceptDecline("denied")}
                            className="w-full md:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            disabled={loading}
                          >
                            Decline Proposal
                          </button>
                          <button
                            onClick={handleAcceptFreelancer}
                            className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                            disabled={loading}
                          >
                            Accept Proposal
                          </button>
                        </>
                      )}

                      {proposalStatus.denied && (
                        <button
                          onClick={onAcceptDecline("pending")}
                          className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                          disabled={loading}
                        >
                          Reopen Proposal
                        </button>
                      )}

                      {inviteStatus.pending && (
                        <>
                          <button
                            onClick={() => {
                              closeModal();
                              setShowInviteMessageModal(true);
                            }}
                            className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                            disabled={loading}
                          >
                            Edit Invitation
                          </button>
                          <button
                            onClick={() => updateStatus("canceled")}
                            className="w-full md:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            disabled={loading}
                          >
                            Cancel Invitation
                          </button>
                        </>
                      )}

                      {inviteStatus.canceled && (
                        <button
                          onClick={() => updateStatus("pending")}
                          className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                          disabled={loading}
                        >
                          Reopen Invitation
                        </button>
                      )}

                      {inviteStatus.read && proposalDetails?.threadExists && (
                        <button
                          onClick={() =>
                            router.push(
                              `/messages-new/invite_${proposalDetails.invite_id}`
                            )
                          }
                          className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                          disabled={loading}
                        >
                          Go To Chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <HiringMoreFreelancerModal
        loading={loading}
        handleClick={(value) => {
          onAcceptDecline("accept", value)();
        }}
        show={isShowingHiringMoreFreelancerModal}
        toggle={() => setIsShowingHiringMoreFreelancerModal((prev) => !prev)}
      />

      <ChatModal
        theme="proposal"
        freelancerName={freelancerName || ""}
        show={openChatModal}
        conversationId={conversationId || ""}
        closeModal={closeChatModal}
        key={"proposal-chat-modal"}
      />
    </>
  );
};

export default ProposalDetailsModal;
