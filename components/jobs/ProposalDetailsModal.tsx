import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import toast from "react-hot-toast";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import Tooltip from "@/components/ui/Tooltip";
import Loader from "@/components/Loader";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
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
import classNames from "classnames";
import {
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "@/helpers/http/common";
import { useAuth } from "@/helpers/contexts/auth-context";
import ChatModal from "@/components/talkjs/chat-modal";
import PaymentTermsPopup from "@/components/PaymentTermsPopup";

type Props = {
  show: boolean;
  toggle: () => void;
  selectedProposalId: string;
  refetch: (shouldToggleModal?: boolean) => void;
  replyOnProjectPageBtn?: boolean;
  type?: "proposal" | "invite";
};

export const DetailsWrapper = styled.div<{
  isMobile: boolean;
  isShowingDeclinedHeadline?: boolean;
}>`
  margin-top: 10px;
  .declined-headline {
    position: absolute;
    top: 0px;
    left: 0px;
    overflow: hidden;
    width: 100%;
    background-color: ${(props) => props.theme.statusColors.orange.bg};
    text-align: center;
    border-radius: 0.8rem 0.8rem 0px 0px;
    padding: 6px;
  }
  .view-profile-link {
    position: ${(props) => (props.isMobile ? "relative" : "absolute")};
    font-size: 18px;
    right: ${(props) => (!props.isMobile ? "2rem" : "unset")};
    top: ${(props) =>
      !props.isMobile && props.isShowingDeclinedHeadline
        ? "3.5rem"
        : !props.isMobile
          ? "1.5rem"
          : "unset"};
    color: #f2b420;
    margin: ${(props) => (props.isMobile ? "1rem 0" : 0)};
    width: ${(props) => (props.isMobile ? "100%" : "unset")};
    display: inline-block;
  }

  .content {
    gap: 2.25rem;
  }
  .freelancer-details {
    gap: 2rem;
  }
  .freelancer-details__content {
    width: 100%;
    gap: 10px;
  }
  .proposal-attributes {
    gap: 0.875rem;
  }
  .description-text {
    opacity: 0.7;
    line-height: 1.6em;
  }
  .light-text {
    opacity: 0.5;
  }
  .proposal-details-item {
    gap: 0.875rem;
    .row-item {
      gap: 10px;
    }
  }
  .attachments {
    background-color: #f8f8f8;
    border: 1px solid #dedede;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    gap: 10px;
  }
  .divider {
    margin: 2rem 0rem;
    height: 1px;
    background: ${(props) => props.theme.colors.black};
    opacity: 0.1;
  }
  .freelancer-name-wrapper {
    width: calc(100% - 266px - 3rem);
    font-size: 1.5rem;
    font-weight: 400;
    text-transform: capitalize;
    .navigation-link {
      color: ${(props) => props.theme.colors.primary};
      text-decoration: underline;
    }
    & > div {
      display: inline-block;
      margin-left: 4px;
    }
    @media (max-width: 767px) {
      width: 100%;
    }
  }
`;

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
  // const [sendingEditInvite, setSendingEditInvite] = useState<boolean>(false);

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
    // setSendingEditInvite(true);
    editInvitation(body)
      .then((res) => {
        // setSendingEditInvite(false);
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
      .catch(() => {
        // setSendingEditInvite(false);
      });
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

  // Getting job details from react-query cache so dont need to prop drill job status from parent
  // when looking at job details and open proposal then it'll fetch status from cache because job details cache is already there
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMessageFreelancerPopupCount, selectedProposalId]);

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

      // If client wants to make another version of same project then passing
      // can_hire_more_freelancers flag which will create copy of this project and move data to new project
      if (status === "accept") {
        body.can_hire_more_freelancers =
          canHireMoreFreelancers === "ACCEPT_AND_LEAVE_OPEN";
      }

      const promise = acceptProposal(body);
      toast.promise(promise, {
        loading: `${
          status == "accept"
            ? "Accepting"
            : status == "pending"
              ? "Reopening"
              : "Declining"
        } the proposal...`,
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

  const buttonsUI = {
    acceptProposal: (
      <StyledButton
        padding="1rem 2rem"
        className={isMobile ? "w-100" : undefined}
        variant="primary"
        onClick={handleAcceptFreelancer}
        disabled={loading}
      >
        Accept Proposal
      </StyledButton>
    ),
    declineProposal: (
      <StyledButton
        padding="1rem 2rem"
        className={isMobile ? "w-100" : undefined}
        variant="outline-dark"
        onClick={onAcceptDecline("denied")}
        disabled={loading}
      >
        Decline Proposal
      </StyledButton>
    ),
    messageFreelancerOrGotoChat: (
      <StyledButton
        padding="1rem 2rem"
        className={isMobile ? "w-100" : undefined}
        variant="outline-dark"
        disabled={loading}
        onClick={() => conversationHandler()}
      >
        {/* {proposalDetails?.threadExists ? 'Go To Chat' : 'Message Freelancer'} */}
        Message Freelancer
      </StyledButton>
    ),
    seeProjectPost: (
      <StyledButton
        padding="1rem 2rem"
        className={isMobile ? "w-100" : undefined}
        variant="primary"
        onClick={() =>
          router.push(
            `/client-job-details/${proposalDetails._job_post_id}/applicants`
          )
        }
        disabled={loading}
      >
        See Project Post
      </StyledButton>
    ),
  };

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

      <StyledModal
        maxwidth={767}
        show={show}
        size="sm"
        onHide={closeModal}
        centered
      >
        <Modal.Body>
          <Button variant="transparent" className="close" onClick={closeModal}>
            &times;
          </Button>
          {fetching ? (
            <Loader />
          ) : (
            <DetailsWrapper
              isMobile={isMobile}
              isShowingDeclinedHeadline={
                proposalStatus.denied || inviteStatus.canceled
              }
            >
              {/* START ----------------------------------------- Showing notice if proposal is denied */}
              {proposalStatus.denied &&
                proposalDetails?.status_change_timestamp?.denied_date && (
                  <div className="declined-headline">
                    <span>
                      You declined this proposal -{" "}
                      {moment(
                        proposalDetails.status_change_timestamp.denied_date
                      ).format("MMM DD, YYYY")}
                    </span>
                  </div>
                )}
              {/* END ------------------------------------------- Showing notice if proposal is denied */}

              {/* START ----------------------------------------- Showing notice if invite is canceled */}
              {inviteStatus.canceled &&
                proposalDetails?.status_change_timestamp?.canceled_date && (
                  <div className="declined-headline">
                    <span>
                      You canceled this invite -{" "}
                      {moment(
                        proposalDetails.status_change_timestamp.canceled_date
                      ).format("MMM DD, YYYY")}
                    </span>
                  </div>
                )}
              {/* END ------------------------------------------- Showing notice if invite is canceled */}

              {replyOnProjectPageBtn && (
                <div className="view-profile-link">
                  {buttonsUI.seeProjectPost}
                </div>
              )}
              {!replyOnProjectPageBtn && proposalDetails?.user_id && (
                <Link
                  className="view-profile-link"
                  href={`/freelancer/${proposalDetails?.user_id}`}
                >
                  <StyledButton
                    padding="1rem 2rem"
                    className={isMobile ? "w-100" : undefined}
                    variant="primary"
                    disabled={loading}
                  >
                    See Freelancer Profile
                  </StyledButton>
                </Link>
              )}

              <div className="content flex flex-col">
                {/* Freelancer details */}

                <div className="freelancer-details flex flex-wrap">
                  <div className="freelancer-details__content flex flex-col">
                    {/* START ----------------------------------------- Freelancer name */}
                    <div className="flex items-center gap-2">
                      {/* START ----------------------------------------- Freelancer image */}
                      <BlurredImage
                        src={
                          proposalDetails?.user_image ||
                          "/images/default_avatar.png"
                        }
                        height="80px"
                        width="80px"
                      />
                      {/* END ------------------------------------------- Freelancer image */}
                      <div className="freelancer-name-wrapper">
                        <Link
                          className={classNames(
                            { "navigation-link": replyOnProjectPageBtn },
                            "mr-2"
                          )}
                          href={`/freelancer/${proposalDetails?.user_id}`}
                        >
                          {proposalDetails?.first_name}{" "}
                          {proposalDetails?.last_name}
                        </Link>
                        <div>
                          {type === "proposal" && proposalDetails?.is_agency ? (
                            <StatusBadge color="blue">Agency</StatusBadge>
                          ) : null}
                          {type === "invite" && (
                            <StatusBadge
                              className="width-fit-content"
                              color={
                                proposalDetails?.status &&
                                typeof proposalDetails.status === "string" &&
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
                    {/* END ------------------------------------------- Freelancer name */}
                    {/* START ----------------------------------------- Designation */}
                    <div className="text-lg font-normal light-text capital-first-ltr">
                      {proposalDetails?.job_title}
                    </div>
                    {proposalDetails?.invite_message && (
                      <div className="text-lg font-bold">
                        <span>Invite Message</span>
                        <div className="text-lg font-normal light-text capital-first-ltr">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: proposalDetails?.invite_message,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* END ------------------------------------------- Designation */}

                    {/* START ----------------------------------------- Location */}
                    {type === "proposal" &&
                      (proposalDetails?.location?.state ||
                        proposalDetails?.location?.country_name) && (
                        <div className="flex items-center gap-2">
                          <LocationIcon />
                          <div className="text-lg font-normal light-text">
                            {separateValuesWithComma([
                              proposalDetails?.location?.state,
                              proposalDetails?.location?.country_name,
                            ])}
                          </div>
                        </div>
                      )}
                    {/* END ------------------------------------------- Location */}
                  </div>
                </div>

                {/* START ----------------------------------------- Description */}
                <div className="proposal-details-item flex flex-col">
                  <div className="text-lg font-bold">
                    {type === "proposal" && <span>Proposal</span>}
                    {proposalDetails?.date_created && type === "proposal" && (
                      <div className="text-base font-light">
                        Submitted:{" "}
                        {moment(proposalDetails.date_created).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    )}
                    {type === "invite" && <span>Invite</span>}
                    {proposalDetails?.date_created && type === "invite" && (
                      <div className="text-base font-light">
                        Sent:{" "}
                        {moment(proposalDetails.date_created).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    )}
                  </div>
                  <div className="description-text text-lg font-normal">
                    <StyledHtmlText
                      htmlString={proposalDetails?.description || ""}
                      id={`proposal_${selectedProposalId}`}
                    />
                  </div>
                </div>
                {/* END ------------------------------------------- Description */}

                <div className="proposal-details-item flex flex-col">
                  <div className="flex gap-2 items-center">
                    {/* START ----------------------------------------- Price */}
                    {type === "proposal" && (
                      <div className="row-item flex items-center">
                        <div className="text-base font-bold">Price:</div>
                        <div className="text-base font-light">
                          {numberWithCommas(
                            proposalDetails?.proposed_budget?.amount || 0,
                            "USD"
                          )}
                          {proposalDetails?.proposed_budget?.type == "hourly"
                            ? `/hr`
                            : ``}
                        </div>
                      </div>
                    )}
                    {/* END ------------------------------------------- Price */}

                    {/* START ----------------------------------------- Price */}
                    {type === "proposal" && (
                      <Tooltip>
                        <div>Price With Fees:</div>
                        <div>
                          {numberWithCommas(
                            getValueByPercentage(
                              Number(
                                proposalDetails?.proposed_budget?.amount || 0
                              ),
                              102.9
                            ),
                            "USD"
                          )}
                          {proposalDetails?.proposed_budget?.type == "hourly"
                            ? `/hr`
                            : ``}{" "}
                          -{" "}
                          {numberWithCommas(
                            getValueByPercentage(
                              Number(
                                proposalDetails?.proposed_budget?.amount || 0
                              ),
                              104.9
                            ),
                            "USD"
                          )}
                          {proposalDetails?.proposed_budget?.type == "hourly"
                            ? `/hr`
                            : ``}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  {/* END ------------------------------------------- Price */}

                  {/* START ----------------------------------------- Time estimation */}
                  {proposalDetails?.proposed_budget?.time_estimation && (
                    <div className="row-item flex items-center">
                      <div className="text-base font-bold">
                        Time Estimation:{" "}
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
                  {/* END ------------------------------------------- Time estimation */}

                  {/* START ----------------------------------------- Terms and conditions */}
                  {proposalDetails?.terms_and_conditions && (
                    <div className="flex flex-col">
                      <div className="text-base font-bold">
                        Special Terms & Conditions:
                      </div>
                      <div className="description-text text-lg font-light">
                        <StyledHtmlText
                          id="termsAndConditions"
                          htmlString={proposalDetails.terms_and_conditions}
                          needToBeShorten={true}
                        />
                      </div>
                    </div>
                  )}
                  {/* END ------------------------------------------- Terms and conditions */}

                  {/* START ----------------------------------------- Questions */}
                  {proposalDetails?.questions && (
                    <div className="flex flex-col">
                      <div className="text-base font-bold">Questions:</div>
                      <div className="description-text text-lg font-light">
                        <StyledHtmlText
                          id="questions"
                          htmlString={proposalDetails.questions}
                          needToBeShorten={true}
                        />
                      </div>
                    </div>
                  )}
                  {/* END ------------------------------------------- Questions */}

                  {/* START ----------------------------------------- Attachments */}
                  {proposalDetails?.attachments &&
                    proposalDetails?.attachments?.length > 0 && (
                      <div className="row-item">
                        <div className="text-base font-bold">Attachments:</div>
                        <div className="flex flex-wrap mt-2">
                          {proposalDetails.attachments.map((attachment) => (
                            <div className="m-1" key={attachment}>
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
                  {/* END ------------------------------------------- Attachments */}
                </div>
              </div>
              {/* If user opened proposal modal from somewhere else except job details page then */}
              {/* showing reply on project page button to navigate to project details page */}
              {replyOnProjectPageBtn &&
                type === "proposal" &&
                proposalDetails?._job_post_id && (
                  <>
                    <div className="divider" />
                    <div className="bottom-buttons flex flex-wrap gap-3">
                      {buttonsUI.messageFreelancerOrGotoChat}
                      {buttonsUI.declineProposal}
                      {buttonsUI.acceptProposal}
                    </div>
                  </>
                )}
              {/* START ----------------------------------------- Proposal accept and decline if job and proposal is prospects */}
              {proposalStatus.pending && (
                <>
                  <div className="divider" />
                  <div className="bottom-buttons flex flex-wrap gap-3">
                    {buttonsUI.messageFreelancerOrGotoChat}
                    {buttonsUI.declineProposal}
                    {buttonsUI.acceptProposal}
                  </div>
                </>
              )}
              {/* END ------------------------------------------- Proposal accept and decline if job and proposal is prospects */}

              {/* START ----------------------------------------- Reopen Proposal if proposal is denied */}
              {proposalStatus.denied && (
                <>
                  <div className="divider" />
                  <div className="bottom-buttons flex flex-wrap gap-3">
                    <StyledButton
                      padding="1rem 2rem"
                      className={isMobile ? "w-full" : undefined}
                      variant="primary"
                      onClick={onAcceptDecline("pending")}
                      disabled={loading}
                    >
                      Reopen Proposal
                    </StyledButton>
                  </div>
                </>
              )}
              {/* END ------------------------------------------- Reopen Proposal if proposal is denied */}

              {/* showing this buttons when invite popup opens only */}
              {/* START ----------------------------------------- If invite is still pending then show edit and cancel invitation */}
              {inviteStatus.pending && (
                <>
                  <div className="divider" />
                  <div className="bottom-buttons flex flex-wrap gap-3">
                    <StyledButton
                      padding="1rem 2rem"
                      className={isMobile ? "w-full" : undefined}
                      variant="primary"
                      disabled={loading}
                      onClick={() => {
                        closeModal();
                        setShowInviteMessageModal(true);
                      }}
                    >
                      Edit Invitation
                    </StyledButton>
                    <StyledButton
                      padding="1rem 2rem"
                      className={isMobile ? "w-full" : undefined}
                      variant="outline-dark"
                      onClick={() => updateStatus("canceled")}
                      disabled={loading}
                    >
                      Cancel Invitation
                    </StyledButton>
                  </div>
                </>
              )}
              {/* END ------------------------------------------- If invite is still pending then show edit and cancel invitation */}
              {/* START ----------------------------------------- If invite is cancelled then show reopen button */}
              {inviteStatus.canceled && (
                <>
                  <div className="divider" />
                  <div className="bottom-buttons flex flex-wrap gap-3">
                    <StyledButton
                      padding="1rem 2rem"
                      className={isMobile ? "w-full" : undefined}
                      variant="primary"
                      disabled={loading}
                      onClick={() => updateStatus("pending")}
                    >
                      Reopen Invitation
                    </StyledButton>
                  </div>
                </>
              )}
              {/* END ------------------------------------------- If invite is cancelled then show reopen button */}
              {/* START ----------------------------------------- If invite status is read */}
              {inviteStatus.read && proposalDetails?.threadExists && (
                <>
                  <div className="divider" />
                  <div className="bottom-buttons flex flex-wrap gap-3">
                    <StyledButton
                      padding="1rem 2rem"
                      className={isMobile ? "w-full" : undefined}
                      variant="primary"
                      disabled={loading}
                      onClick={() => {
                        return router.push(
                          `/messages-new/invite_${proposalDetails.invite_id}`
                        );
                      }}
                    >
                      Go To Chat
                    </StyledButton>
                  </div>
                </>
              )}
              {/* END ------------------------------------------- If invite status is read */}
            </DetailsWrapper>
          )}
        </Modal.Body>
      </StyledModal>

      {/* START ----------------------------------------- Hire more freelancer after accepting proposal */}
      <HiringMoreFreelancerModal
        loading={loading}
        handleClick={(value) => {
          onAcceptDecline("accept", value)();
        }}
        show={isShowingHiringMoreFreelancerModal}
        toggle={() => setIsShowingHiringMoreFreelancerModal((prev) => !prev)}
      />
      {/* END ------------------------------------------- Hire more freelancer after accepting proposal */}

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
