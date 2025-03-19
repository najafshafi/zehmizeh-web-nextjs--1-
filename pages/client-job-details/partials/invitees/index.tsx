/*
 * This component will lists all the applicants whi have applied for the job
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "components/Loader";
import { StyledButton } from "components/forms/Buttons";
import ProposalDetailsModal from "components/jobs/ProposalDetailsModal";
import { StatusBadge } from "components/styled/Badges";
import BlurredImage from "components/ui/BlurredImage";
import PaginationComponent from "components/ui/Pagination";
import NoDataFound from "components/ui/NoDataFound";
import { InviteesWrapper, InviteesListItem } from "./invitees.styled";
import useInvitees from "../../hooks/useInvitees";
import { separateValuesWithComma } from "helpers/utils/misc";
import { ReactComponent as LocationIcon } from "assets/icons/location-blue.svg";
import { ReactComponent as StarIcon } from "assets/icons/star-yellow.svg";
import moment from "moment";
import { TJOB_STATUS } from "helpers/types/job.type";
import { formatDateAndTime } from "helpers/utils/formatter";
import { JOBS_STATUS } from "pages/jobs/consts";
import toast from "react-hot-toast";
import {
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "helpers/http/common";
import { useAuth } from "helpers/contexts/auth-context";
import ChatModal from "components/talkjs/chat-modal";

const RECORDS_PER_PAGE = 10;

export const Invitees = ({
  jobPostId,
  refetch,
  jobStatus,
}: {
  jobPostId: string;
  refetch: () => void;
  jobStatus?: TJOB_STATUS;
}) => {
  const { id, invitedId } = useParams<{ invitedId?: string; id?: string }>();
  // Url to restore/add proposal id when modal open or closes
  const url = `${window.location.origin}/client-job-details/${id}/invitees`;

  /* START ---------------------------- If url has proposal id already */
  useEffect(() => {
    if (invitedId) {
      onViewInviteesDetails(invitedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitedId]);
  /* END ------------------------------ If url has proposal id already */

  const [showInviteeDetails, setShowInviteeDetails] = useState<boolean>(false);
  const [selectedInviteeId, setSelectedInviteeId] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [threadLoading, setThreadLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>();
  const [freelancerName, setFreelancerName] = useState<string>();
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const { user } = useAuth();

  const { data, isLoading, totalResults } = useInvitees({
    job_id: jobPostId,
    page: currentPage,
    limit: RECORDS_PER_PAGE,
  });

  const onViewInviteesDetails = (id: string) => {
    setSelectedInviteeId(id);
    toggleInviteeDetailsModal();
    // viewProposal(id);

    // Updating url with proposal id (without reload)
    const newUrl = url + `/${id}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  const toggleInviteeDetailsModal = () => {
    setShowInviteeDetails(!showInviteeDetails);
    if (showInviteeDetails) {
      // setSelectedproposalId(null);
      // removing proposal id in url (without reload)
      window.history.replaceState({ path: url }, "", url);
    }
  };

  const onRefetch = () => {
    toggleInviteeDetailsModal();
    refetch();
  };

  const closeChatModal = () => {
    setOpenChatModal(false);
    setConversationId("");
  };

  const onPageChange = (page: { selected: number }) => {
    /* This will set next page as active and load new page data - Pagination is implemented locally  */
    setCurrentPage(page?.selected + 1);
  };

  const noDataFoundJSX: JSX.Element = (
    <>
      {jobStatus === "active" && (
        <>
          <p className="mb-1">
            You did not invite any freelancers to submit proposals to this
            project.
          </p>
        </>
      )}

      {jobStatus === "prospects" && (
        <>
          <p className="mb-1">You haven’t invited anyone yet!</p>
          <p>
            To invite freelancers, visit the{" "}
            <Link
              to="/search?type=freelancers&page=1"
              className="text-decoration-underline"
            >
              Find Freelancers
            </Link>{" "}
            page.
          </p>
        </>
      )}
    </>
  );

  const handleTalkJSConversation = async (invite) => {
    if (threadLoading) return false;

    setThreadLoading(true);
    toast.loading("loading chat...");
    const invite_convo_id = `invite_${invite.invite_id}`;
    const { conversation } = await talkJsFetchSingleConversation(
      invite_convo_id
    );
    toast.remove();

    setFreelancerName(`${invite.first_name} ${invite.last_name}`);
    if (conversation?.data !== null) {
      setConversationId(invite_convo_id);
      setThreadLoading(false);
      setOpenChatModal(true);
      return null;
    }

    const payload = {
      conversationId: invite_convo_id,
      // doesn't matter if the ID's flip over, we just need both id's
      clientId: user.user_id,
      freelancerId: invite._freelancer_user_id,
      subject: invite.job_title,
      custom: {
        projectName: invite.job_title,
        jobPostId: invite._job_post_id,
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

  return (
    <InviteesWrapper className="d-flex flex-column">
      {isLoading && <Loader />}

      {!isLoading && data?.length == 0 && (
        <NoDataFound className="py-5" title={noDataFoundJSX} />
      )}

      {!isLoading &&
        data?.length > 0 &&
        data?.map((item: any) => (
          <InviteesListItem
            key={item?.invite_id}
            className="d-flex flex-wrap justify-content-between"
          >
            {item?.edited_at && (
              <p className="updated-on">
                Updated on - {formatDateAndTime(item.edited_at)}
              </p>
            )}
            <div className="applicant-details d-flex gap-4 flex-wrap">
              <BlurredImage
                src={item?.user_image || "/images/default_avatar.png"}
                height="80px"
                width="80px"
              />
              <div className="main-details d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <div className="fs-24 font-normal line-height-140 capitalize">
                    <Link to={`/freelancer/${item?.user_id}`}>
                      {item?.first_name} {item?.last_name}
                    </Link>
                  </div>
                  <StatusBadge
                    className="width-fit-content"
                    color={
                      JOBS_STATUS[item?.status]?.color
                        ? JOBS_STATUS[item?.status]?.color
                        : "gray"
                    }
                  >
                    {item?.status == "pending" ? "Unread" : item?.status}
                  </StatusBadge>
                </div>
                <div className="description fs-18 font-normal light-text line-height-140 capital-first-ltr">
                  {item?.job_title}
                </div>
                {item?.date_created && (
                  <div className="light-text">
                    <span className="fw-500">Proposal Date:</span>{" "}
                    <span>
                      {moment(item.date_created).format("MMM DD, YYYY")}
                    </span>
                  </div>
                )}
                <div className="location-and-ratings d-flex align-items-center gap-2 flex-wrap">
                  {(item?.location?.state || item?.location?.country_name) && (
                    <div className="rounded-chip d-flex width-fit-content align-items-center">
                      <LocationIcon />
                      <div className="fs-1rem font-normal mx-1 light-text">
                        {separateValuesWithComma([
                          item?.location?.state,
                          item?.location?.country_name,
                        ])}
                      </div>
                    </div>
                  )}
                  <div className="rounded-chip d-flex width-fit-content align-items-center">
                    <StarIcon />
                    <div className="fs-1rem font-normal mx-1">
                      {item?.avg_rate ? item?.avg_rate?.toFixed(1) : 0}
                    </div>
                    <div className="fs-1rem font-normal mx-1 light-text">
                      Ratings ({item?.feedback})
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-section d-flex flex-column justify-content-between align-items-start align-items-lg-end">
              <div className="fs-24 fw-700">
                {/* {numberWithCommas(item?.proposed_budget?.amount, 'USD')} */}
                {/* {item?.proposed_budget.type == 'hourly' ? '/hr' : ''} */}
              </div>
              <div className="d-flex gap-2 align-items-center">
                {jobStatus === "prospects" && (
                  <StyledButton
                    padding="1rem 1.5rem"
                    fontSize="1rem"
                    variant="primary"
                    // disabled={selectedProposalId == item?.proposal_id}
                    onClick={() => onViewInviteesDetails(item?.invite_id)}
                  >
                    View Invite
                  </StyledButton>
                )}

                <StyledButton
                  padding="1rem 1.5rem"
                  fontSize="1rem"
                  variant="outline-dark"
                  // disabled={selectedProposalId == item?.proposal_id}
                  onClick={() => handleTalkJSConversation(item)}
                >
                  Message Freelancer
                </StyledButton>
              </div>
            </div>
          </InviteesListItem>
        ))}

      {/* Pagination */}
      {!isLoading && data?.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <PaginationComponent
            total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        </div>
      )}

      <ProposalDetailsModal
        show={showInviteeDetails}
        toggle={toggleInviteeDetailsModal}
        selectedProposalId={selectedInviteeId}
        refetch={onRefetch}
        type="invite"
      />

      <ChatModal
        freelancerName={freelancerName}
        show={openChatModal}
        conversationId={conversationId}
        closeModal={closeChatModal}
        key={"invities-chat-modal"}
        theme="invite"
      />
    </InviteesWrapper>
  );
};
