/*
 * This component will lists all the applicants who have applied for the job
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import ProposalDetailsModal from "@/components/jobs/ProposalDetailsModal";
import { StatusBadge } from "@/components/styled/Badges";
import BlurredImage from "@/components/ui/BlurredImage";
import PaginationComponent from "@/components/ui/Pagination";
import NoDataFound from "@/components/ui/NoDataFound";
import useApplicants from "../../hooks/useApplicants";
import {
  numberWithCommas,
  separateValuesWithComma,
} from "@/helpers/utils/misc";
import LocationIcon from "@/public/icons/location-blue.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import { viewProposal } from "@/helpers/http/proposals";
import moment from "moment";
import { TJOB_STATUS } from "@/helpers/types/job.type";
import { JOBS_STATUS } from "@/app/jobs/consts";
import { formatDateAndTime } from "@/helpers/utils/formatter";
import Sorting from "@/components/sorting/Sorting";
import ChatModal from "@/components/talkjs/chat-modal";
import { useAuth } from "@/helpers/contexts/auth-context";
import {
  talkJsCreateNewThread,
  talkJsFetchSingleConversation,
} from "@/helpers/http/common";
import toast from "react-hot-toast";
import PaymentTermsPopup from "@/components/PaymentTermsPopup";
import CustomButton from "@/components/custombutton/CustomButton";

const RECORDS_PER_PAGE = 10;

const sortTypes = [
  {
    label: "Date Submitted - Newest",
    key: "dateSubmittedNewest",
  },
  {
    label: "Date Submitted - Oldest",
    key: "dateSubmittedOldest",
  },
  {
    label: "Price - Highest",
    key: "priceHigh",
  },
  {
    label: "Price - Lowest",
    key: "priceLow",
  },
  {
    label: "Already Read First",
    key: "readFirst",
  },
  {
    label: "Unread First",
    key: "unreadFirst",
  },
];

interface Prop {
  jobPostId: string;
  refetch: () => void;
  jobStatus?: TJOB_STATUS;
  jobTitle: string;
  selectedApplicantId?: string;
}

interface ProposalData {
  proposal_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  status: string;
  is_viewed: boolean;
  is_agency?: boolean;
  edited_at?: string;
  date_created?: string;
  user_image?: string;
  job_title?: string;
  proposed_budget: {
    amount: number;
    type: string;
  };
  location?: {
    state?: string;
    country_name?: string;
  };
  avg_rate?: number;
  feedback?: number;
}

const Applicants = ({
  jobPostId,
  refetch,
  jobStatus,
  jobTitle,
  selectedApplicantId,
}: Prop) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract proposalId and id from the URL/route
  const pathSegments = pathname ? pathname.split("/") : [];
  const id =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";
  const proposalId = searchParams ? searchParams.get("proposalId") : null;

  const [sortKey, setSorting] = useState<string>("dateSubmittedNewest");
  const [threadLoading, setThreadLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [freelancerName, setFreelancerName] = useState<string>("");
  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<ProposalData | null>(
    null
  );
  const { user } = useAuth();

  // Url to restore/add proposal id when modal open or closes

  /* START ---------------------------- If url has proposal id already */
  useEffect(() => {
    if (proposalId) {
      onViewProposalDetails(proposalId);
    } else if (selectedApplicantId) {
      onViewProposalDetails(selectedApplicantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId, selectedApplicantId]);
  /* END ------------------------------ If url has proposal id already */

  const [showProposalDetails, setShowProposalDetails] =
    useState<boolean>(false);
  const [selectedProposalId, setSelectedproposalId] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, totalResults } = useApplicants({
    job_id: jobPostId,
    page: currentPage,
    limit: RECORDS_PER_PAGE,
    sorting: sortKey,
    proposalStatus: jobStatus || "",
  });
  const baseUrl = `/client-job-details/${jobPostId}/applicants`;
  const onViewProposalDetails = (id: string) => {
    setSelectedproposalId(id);
    toggleProposalDetailsModal();
    viewProposal(id);

    // Update URL to use the new route pattern for direct applicant access
    if (!selectedApplicantId) {
      router.push(`/client-job-details/${jobPostId}/applicants/${id}`, {
        scroll: false,
      });
    }
  };

  const toggleProposalDetailsModal = () => {
    setShowProposalDetails(!showProposalDetails);
    if (showProposalDetails) {
      // removing proposal id in url (without reload)
      router.push(baseUrl, { scroll: false });
    }
  };

  const onRefetch = () => {
    toggleProposalDetailsModal();
    refetch();
  };

  const onPageChange = (page: { selected: number }) => {
    /* This will set next page as active and load new page data - Pagination is implemented locally  */
    setCurrentPage(page?.selected + 1);
  };

  const handleTalkJSConversation = async (proposal: ProposalData) => {
    setPendingProposal(proposal);
    setShowPaymentTerms(true);
  };

  const handleAcceptTerms = async () => {
    if (!pendingProposal || threadLoading) return false;

    setShowPaymentTerms(false);
    setThreadLoading(true);
    toast.loading("loading chat...");

    const chat_proposal_id = pendingProposal.proposal_id;
    const { conversation } = await talkJsFetchSingleConversation(
      `proposal_${chat_proposal_id}`
    );
    toast.remove();

    setFreelancerName(
      `${pendingProposal.first_name} ${pendingProposal.last_name}`
    );
    if (conversation?.data !== null) {
      setConversationId(`proposal_${chat_proposal_id}`);
      setThreadLoading(false);
      setOpenChatModal(true);
      setPendingProposal(null);
      return null;
    }

    const payload = {
      conversationId: `proposal_${chat_proposal_id}`,
      clientId: user.user_id,
      freelancerId: pendingProposal.user_id,
      subject: jobTitle,
      custom: {
        projectName: jobTitle,
        jobPostId,
      },
    };

    const promise = talkJsCreateNewThread(payload);

    toast.promise(promise, {
      loading: "create thread...",
      success: () => {
        setThreadLoading(false);
        setConversationId(payload.conversationId);
        setOpenChatModal(true);
        setPendingProposal(null);
        return "thread created successfully";
      },
      error: (err) => {
        setThreadLoading(false);
        setPendingProposal(null);
        return "Error: " + err.toString();
      },
    });
  };

  const closeChatModal = () => {
    setOpenChatModal(false);
    setConversationId("");
  };

  return (
    <>
      <Sorting
        sortTypes={sortTypes}
        sorting={sortKey}
        setSorting={setSorting}
      />
      <div className=" flex gap-[30px] mt-10  flex-col">
        {isLoading && <Loader />}

        {!isLoading && data?.length == 0 && (
          <NoDataFound
            className="py-5"
            title={
              jobStatus !== "active"
                ? "No one has applied yet"
                : "There are no declined proposals to view."
            }
          />
        )}

        {!isLoading &&
          data?.length > 0 &&
          data?.map((item: ProposalData) => (
            <div
              key={item?.proposal_id}
              className="flex flex-wrap justify-between p-8 bg-white rounded-[12px] shadow-[0_4px_74px_rgba(0,0,0,0.04)]  gap-8 relative overflow-hidden md:p-11"
            >
              {item?.edited_at && (
                <p className=" absolute top-0 left-0 right-0 text-center bg-[#ffedd3] text-[#ee761c] py-0.5 text-sm">
                  Updated on - {formatDateAndTime(item.edited_at)}
                </p>
              )}
              <div className=" max-w-full w-full break-words flex gap-4 flex-wrap">
                <BlurredImage
                  src={item?.user_image || "/images/default_avatar.png"}
                  height="80px"
                  width="80px"
                />
                <div className="flex gap-[10px]  flex-col flex-1">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                      <div className="fs-24 font-normal leading-[140%] capitalize ">
                        <Link href={`/freelancer/${item?.user_id}`}>
                          {item?.first_name} {item?.last_name}
                        </Link>
                      </div>
                      <StatusBadge
                        className="w-fit"
                        color={
                          item?.status &&
                          JOBS_STATUS[item.status as keyof typeof JOBS_STATUS]
                            ?.color
                            ? JOBS_STATUS[
                                item.status as keyof typeof JOBS_STATUS
                              ]?.color
                            : "gray"
                        }
                      >
                        {item?.status == "denied" ? "Declined" : item.status}
                      </StatusBadge>
                      <StatusBadge
                        className="w-fit"
                        color={item?.is_viewed ? "green" : "red"}
                      >
                        {item?.is_viewed ? "Read" : "Unread"}
                      </StatusBadge>
                      {item?.is_agency ? (
                        <StatusBadge color="blue">Agency</StatusBadge>
                      ) : null}
                    </div>

                    <div className="fs-24 fw-700">
                      {numberWithCommas(item?.proposed_budget?.amount, "USD")}
                      {item?.proposed_budget.type == "hourly" ? "/hr" : ""}
                    </div>
                  </div>

                  <div className="flex justify-between items-end flex-wrap md:flex-nowrap">
                    <div>
                      <div className="description fs-18 font-normal opacity-50 leading-[140%] capital-first-ltr mb-2">
                        {item?.job_title}
                      </div>
                      {item?.date_created && (
                        <div className="opacity-50 mb-2">
                          <span className="fw-500">Proposal Date:</span>{" "}
                          <span>
                            {moment(item.date_created).format("MMM DD, YYYY")}
                          </span>
                        </div>
                      )}
                      <div className="location-and-ratings flex items-center gap-2 flex-wrap mb-2 ">
                        {(item?.location?.state ||
                          item?.location?.country_name) && (
                          <div className=" flex w-fit items-center">
                            <LocationIcon />
                            <div className="fs-1rem font-normal mx-1 opacity-50">
                              {separateValuesWithComma(
                                [
                                  item?.location?.state,
                                  item?.location?.country_name,
                                ].filter(Boolean) as string[]
                              )}
                            </div>
                          </div>
                        )}
                        <div className="bg-[#fbf5e8] py-1.5 px-[0.875rem] rounded-[1rem] flex w-fit items-center">
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
                    <div className="flex gap-3  flex-wrap md:flex-nowrap">
                      <CustomButton
                        text="View Proposal"
                        className="px-[1rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-base"
                        onClick={() => onViewProposalDetails(item?.proposal_id)}
                      />

                      <CustomButton
                        text="Message Freelancer"
                        className="px-[1rem] py-[1rem] text-center transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full text-base border border-black hover:bg-black hover:text-white "
                        onClick={() => handleTalkJSConversation(item)}
                        disabled={threadLoading}
                      />
                    </div>
                  </div>
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

        <ProposalDetailsModal
          show={showProposalDetails}
          toggle={toggleProposalDetailsModal}
          selectedProposalId={selectedProposalId || ""}
          refetch={onRefetch}
        />

        {openChatModal && (
          <ChatModal
            theme="proposal"
            freelancerName={freelancerName}
            show={openChatModal}
            conversationId={conversationId}
            closeModal={closeChatModal}
            key={"proposal-chat-modal"}
          />
        )}

        <PaymentTermsPopup
          show={showPaymentTerms}
          onClose={() => {
            setShowPaymentTerms(false);
            setPendingProposal(null);
          }}
          onAccept={() => {
            handleAcceptTerms();
          }}
        />
      </div>
    </>
  );
};

export default Applicants;
