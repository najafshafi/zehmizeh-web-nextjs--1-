/*
 * This component will lists all the applicants who have applied for the job
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
import { StatusBadge } from "@/components/styled/Badges";
import BlurredImage from "@/components/ui/BlurredImage";
import PaginationComponent from "@/components/ui/Pagination";
import NoDataFound from "@/components/ui/NoDataFound";
import useInvitees from "../../hooks/useInvitees";
import { separateValuesWithComma } from "@/helpers/utils/misc";
import LocationIcon from "@/public/icons/location-blue.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import moment from "moment";
import { TJOB_STATUS } from "@/helpers/types/job.type";
import { formatDateAndTime } from "@/helpers/utils/formatter";
import { JOBS_STATUS } from "@/app/jobs/consts";
import toast from "react-hot-toast";
import {
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "@/helpers/http/common";
import { useAuth } from "@/helpers/contexts/auth-context";
import CustomButton from "@/components/custombutton/CustomButton";
import { editInvitation } from "@/helpers/http/jobs";
import { getInviteeDetails } from "@/helpers/http/proposals";

// Dynamically import components that might use browser APIs
const ProposalDetailsModal = dynamic(
  () => import("@/components/jobs/ProposalDetailsModal"),
  { ssr: false }
);
const ChatModal = dynamic(() => import("@/components/talkjs/chat-modal"), {
  ssr: false,
});
const InviteFreelancerMessageModal = dynamic(
  () => import("@/components/invite-flow-modals/InviteFreelancerMessageModal"),
  { ssr: false }
);

const RECORDS_PER_PAGE = 10;

interface InviteeData {
  invite_id: string;
  user_id: string;
  _freelancer_user_id: string;
  _job_post_id: string;
  first_name: string;
  last_name: string;
  status: string;
  job_title: string;
  date_created?: string;
  edited_at?: string;
  user_image?: string;
  location?: {
    state?: string;
    country_name?: string;
  };
  avg_rate?: number;
  feedback?: number;
}

export const Invitees = ({
  jobPostId,
  refetch,
  jobStatus,
  selectedInviteId,
}: {
  jobPostId: string;
  refetch: () => void;
  jobStatus?: TJOB_STATUS;
  selectedInviteId?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract params from URL
  const pathSegments = pathname ? pathname.split("/") : [];
  const id =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";
  const invitedId = searchParams ? searchParams.get("invitedId") : null;

  // Base URL for navigation
  const baseUrl = `/client-job-details/${id}/invitees`;

  /* START ---------------------------- If url has invite id already */
  useEffect(() => {
    if (invitedId) {
      onViewInviteesDetails(invitedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitedId]);

  // Handle the selectedInviteId prop
  useEffect(() => {
    if (selectedInviteId) {
      onViewInviteesDetails(selectedInviteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInviteId]);

  // Handle the editInvite query parameter
  useEffect(() => {
    const editInviteId = searchParams?.get("editInvite");
    if (editInviteId) {
      fetchInviteeDetailsForEdit(editInviteId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [showInviteeDetails, setShowInviteeDetails] = useState<boolean>(false);
  const [selectedInviteeId, setSelectedInviteeId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [threadLoading, setThreadLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [freelancerName, setFreelancerName] = useState<string>("");
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const { user } = useAuth();

  // State for edit invitation modal
  const [showEditInvitationModal, setShowEditInvitationModal] =
    useState<boolean>(false);
  const [editInvitationLoading, setEditInvitationLoading] =
    useState<boolean>(false);
  const [selectedInviteeData, setSelectedInviteeData] = useState<any>(null);

  const { data, isLoading, totalResults } = useInvitees({
    job_id: jobPostId,
    page: currentPage,
    limit: RECORDS_PER_PAGE,
  });

  const onViewInviteesDetails = (id: string) => {
    setSelectedInviteeId(id);
    toggleInviteeDetailsModal();

    // Updating URL to the new route pattern
    router.push(`/client-job-details/${jobPostId}/invitees/${id}`, {
      scroll: false,
    });
  };

  const toggleInviteeDetailsModal = () => {
    setShowInviteeDetails(!showInviteeDetails);
    if (showInviteeDetails) {
      // When closing the modal, navigate back to the invitees list
      router.push(`/client-job-details/${jobPostId}/invitees`, {
        scroll: false,
      });
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

  const fetchInviteeDetailsForEdit = async (inviteId: string) => {
    try {
      setEditInvitationLoading(true);
      const response = await getInviteeDetails(inviteId);
      if (response.data) {
        setSelectedInviteeData(response.data);
        setShowEditInvitationModal(true);
      }
    } catch (error) {
      toast.error("Failed to fetch invitation details");
    } finally {
      setEditInvitationLoading(false);
    }
  };

  const toggleEditInvitationModal = () => {
    setShowEditInvitationModal(!showEditInvitationModal);
    if (showEditInvitationModal) {
      // Remove the query parameter when closing the modal
      router.push(`/client-job-details/${jobPostId}/invitees`, {
        scroll: false,
      });
    }
  };

  const handleEditInvitation = async (message: string) => {
    if (!selectedInviteeData?.invite_id) return;

    try {
      setEditInvitationLoading(true);
      const response = await editInvitation({
        invite_id: selectedInviteeData.invite_id,
        invite_message: message,
      });

      if (response.status) {
        toast.success(response.message || "Invitation updated successfully");
        toggleEditInvitationModal();
        refetch();
      } else {
        toast.error(response.message || "Failed to update invitation");
      }
    } catch (error) {
      toast.error("An error occurred while updating the invitation");
    } finally {
      setEditInvitationLoading(false);
    }
  };

  const noDataFoundJSX = (
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
          <p className="mb-1">You haven&apos;t invited anyone yet!</p>
          <p>
            To invite freelancers, visit the{" "}
            <Link
              href="/search?type=freelancers&page=1"
              className="text-decoration-underline text-black underline hover:text-blue-600"
            >
              Find Freelancers
            </Link>{" "}
            page.
          </p>
        </>
      )}
    </>
  );

  const handleTalkJSConversation = async (invite: InviteeData) => {
    // Skip chat functionality during server-side rendering
    if (typeof window === "undefined") return;

    if (threadLoading) return false;

    setThreadLoading(true);
    toast.loading("loading chat...");
    const invite_convo_id = `invite_${invite.invite_id}`;
    const { conversation } =
      await talkJsFetchSingleConversation(invite_convo_id);
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

  // Return empty div during SSR to prevent 'self is not defined' error
  if (typeof window === "undefined") {
    return <div className="invitees-loading">Loading invitees...</div>;
  }

  return (
    <div className="flex flex-col gap-[30px] mt-10">
      {isLoading && <Loader />}

      {!isLoading && data?.length == 0 && (
        <NoDataFound className="py-5" title={noDataFoundJSX} />
      )}

      {!isLoading &&
        data?.length > 0 &&
        data?.map((item: InviteeData) => (
          <div
            key={item?.invite_id}
            className="flex flex-wrap justify-between p-11 shadow-[0px_4px_74px_rgba(0,0,0,0.04)] bg-white rounded-xl gap-8 relative overflow-hidden"
          >
            {item?.edited_at && (
              <p className="absolute top-0 left-0 right-0 text-center bg-[#FFEDD3] text-[#EE761C] py-[2px]">
                Updated on - {formatDateAndTime(item.edited_at)}
              </p>
            )}
            <div className="flex gap-4 flex-wrap max-w-[75%] break-words">
              <BlurredImage
                src={item?.user_image || "/images/default_avatar.png"}
                height="80px"
                width="80px"
              />
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-2">
                  <div className="fs-24 font-normal leading-[140%] capitalize">
                    <Link href={`/freelancer/${item?.user_id}`}>
                      {item?.first_name} {item?.last_name}
                    </Link>
                  </div>
                  <StatusBadge
                    className="width-fit-content"
                    color={
                      item?.status &&
                      JOBS_STATUS[item.status as keyof typeof JOBS_STATUS]
                        ?.color
                        ? JOBS_STATUS[item.status as keyof typeof JOBS_STATUS]
                            ?.color
                        : "gray"
                    }
                  >
                    {item?.status == "pending" ? "Unread" : item?.status}
                  </StatusBadge>
                </div>
                <div className="fs-18 font-normal opacity-50 leading-[140%] capital-first-ltr">
                  {item?.job_title}
                </div>
                {item?.date_created && (
                  <div className="opacity-50">
                    <span className="fw-500">Proposal Date:</span>{" "}
                    <span>
                      {moment(item.date_created).format("MMM DD, YYYY")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {(item?.location?.state || item?.location?.country_name) && (
                    <div className="flex items-center bg-[#FBF5E8] py-1.5 px-3.5 rounded-2xl width-fit-content">
                      <LocationIcon />
                      <div className="fs-1rem font-normal mx-1 opacity-50">
                        {separateValuesWithComma([
                          item?.location?.state || "",
                          item?.location?.country_name || "",
                        ])}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center bg-[#FBF5E8] py-1.5 px-3.5 rounded-2xl width-fit-content">
                    <StarIcon />
                    <div className="fs-1rem font-normal mx-1">
                      {item?.avg_rate ? item?.avg_rate?.toFixed(1) : 0}
                    </div>
                    <div className="fs-1rem font-normal mx-1 opacity-50">
                      Ratings ({item?.feedback})
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-start lg:items-end md:gap-0 gap-5">
              <div className="fs-24 fw-700">
                {/* {numberWithCommas(item?.proposed_budget?.amount, 'USD')} */}
                {/* {item?.proposed_budget.type == 'hourly' ? '/hr' : ''} */}
              </div>
              <div className="flex gap-2 items-center">
                {jobStatus === "prospects" && (
                  <CustomButton
                    text={"View Invite"}
                    className="px-[1.5rem] py-[1rem] text-base font-normal border-2 border-primary text-black rounded-full transition-transform duration-200 hover:scale-105 bg-primary"
                    onClick={() => onViewInviteesDetails(item?.invite_id)}
                  />
                )}

                <CustomButton
                  text={"Message Freelancer"}
                  className="px-[1.5rem] py-[1rem] text-base font-normal border-2 border-gray-800 text-black rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white"
                  onClick={() => handleTalkJSConversation(item)}
                />
              </div>
            </div>
          </div>
        ))}

      {/* Pagination */}
      {!isLoading && data?.length > 0 && (
        <div className="flex justify-center mt-3">
          <PaginationComponent
            total={Math.ceil(totalResults / RECORDS_PER_PAGE)}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        </div>
      )}

      {showInviteeDetails && (
        <ProposalDetailsModal
          show={showInviteeDetails}
          toggle={toggleInviteeDetailsModal}
          selectedProposalId={selectedInviteeId}
          refetch={onRefetch}
          type="invite"
        />
      )}

      {openChatModal && (
        <ChatModal
          freelancerName={freelancerName}
          show={openChatModal}
          conversationId={conversationId}
          closeModal={closeChatModal}
          key={"invities-chat-modal"}
          theme="invite"
        />
      )}

      {/* Edit Invitation Modal */}
      {showEditInvitationModal && selectedInviteeData && (
        <InviteFreelancerMessageModal
          show={showEditInvitationModal}
          toggle={toggleEditInvitationModal}
          freelancerName={`${selectedInviteeData.first_name} ${selectedInviteeData.last_name}`}
          inviteMessage={selectedInviteeData.invite_message || ""}
          onInvite={handleEditInvitation}
          isEditFlag={true}
          loading={editInvitationLoading}
        />
      )}
    </div>
  );
};
