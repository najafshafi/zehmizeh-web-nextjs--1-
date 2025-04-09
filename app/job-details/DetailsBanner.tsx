/*
 * This component displays the Banner (Summary) of the job details *
 */

import { useState } from "react";
import Spinner from "@/components/forms/Spin/Spinner";
import moment from "moment";
import { PengingProposalWrapper, NoPropsalWrapper } from "./job-details.styled";
import Tooltip from "@/components/ui/Tooltip";
import { StatusBadge } from "@/components/styled/Badges";
import SubmitProposalModal from "@/components/jobs/SubmitProposalModal";
import BlurredImage from "@/components/ui/BlurredImage";
import { useAuth } from "@/helpers/contexts/auth-context";
import {
  numberWithCommas,
  changeStatusDisplayFormat,
  convertToTitleCase,
} from "@/helpers/utils/misc";
import { toggleBookmarkPost } from "@/helpers/http/search";
import LocationIcon from "@/public/icons/location-blue.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import UnSavedIcon from "@/public/icons/unsaved.svg";
import SavedIcon from "@/public/icons/saved.svg";
import ShareIcon from "@/public/icons/share.svg";
import { JOBS_STATUS } from "@/app/jobs/consts";
import { BOOKMARK_TOOLTIPS } from "./consts";
import { useRouter, usePathname } from "next/navigation";
import ChangeBudgetModal from "../../components/changeBudget/ChangeBudgetModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ChangeBudgetDeleteRequest } from "@/components/changeBudget/ChangeBudgetDeleteRequest";
import MilestoneStats from "@/app/client-job-details/partials/MilestoneStats";
import CustomButton from "@/components/custombutton/CustomButton";

// Types
interface JobMilestone {
  status: string;
  amount: number;
}

interface JobData {
  job_post_id: string;
  job_title: string;
  status: keyof typeof JOBS_STATUS;
  date_created: string;
  due_date?: string;
  job_start_date?: string;
  job_end_date?: string;
  preferred_location?: string[];
  is_bookmarked?: boolean;
  userdata?: {
    user_image?: string;
    first_name?: string;
    last_name?: string;
    location?: {
      country_name: string;
    };
  };
  avg_rating?: number;
  count_rating?: number;
  budget?: {
    type: string;
  };
  total_hours?: number;
  total_earnings?: number;
  milestone: JobMilestone[];
  proposal?: {
    status?: string;
    approved_budget?: {
      amount: number;
      type: string;
    };
    budget_change?: {
      status: string;
      amount: number;
      requested_by: string;
    };
  };
  _client_user_id?: string;
  _freelancer_user_id?: string;
  job_description?: string;
  attachments?: any[];
  skills?: any[];
  languages?: any[];
  time_scope?: string;
  expected_delivery_date?: string;
  is_job_deleted?: number;
  proposed_budget?: {
    amount: number;
    type: string;
  };
  // ... other required properties from TJobDetails
}

interface DetailsBannerProps {
  data: JobData;
  refetch: () => void;
}

const DetailsBanner = ({ data, refetch }: DetailsBannerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split("/")[2]; // Extract job ID from URL
  const { user } = useAuth();

  const [showSubmitProposalModal, setShowSubmitProposalModal] =
    useState<boolean>(false);
  const [changeBudgetModal, setChangeBudgetModal] = useState(false);
  const [changeBudgetDeleteModal, setChangeBudgetDeleteModal] = useState(false);
  const [isProposalSubmitted, setIsProposalSubmitted] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setISaved] = useState<boolean>(data?.is_bookmarked || false);

  const toggleProposalModal = () => {
    setShowSubmitProposalModal(!showSubmitProposalModal);
  };

  const onSubmitProposal = () => {
    setIsProposalSubmitted(true);
    toggleProposalModal();
    refetch();
    if (id) router.push(`/job-details/${id}/proposal_sent`);
  };

  const onBookmarkClick = () => {
    if (!user) return;
    setLoading(true);
    toggleBookmarkPost(data.job_post_id.toString()).then((res) => {
      if (res.status) {
        setISaved(!isSaved);
      }
      setLoading(false);
    });
  };

  const totalMilestoneAmount = data?.milestone
    ?.filter((milestone) => milestone.status !== "cancelled")
    .reduce((acc, milestone) => acc + milestone.amount, 0);

  return data?.proposal?.status ? (
    ["pending", "declined", "denied"].includes(data?.proposal?.status) ? (
      <PengingProposalWrapper>
        <div className="text-2xl font-normal">
          {convertToTitleCase(data.job_title)}
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center flex-wrap">
            <span className="text-xl font-normal opacity-50">Posted:</span>
            <span className="text-xl font-normal leading-7">
              {data?.date_created &&
                moment(data.date_created).format("MMM DD, YYYY")}
            </span>
          </div>
          <Divider />
          <div className="flex items-center gap-2">
            <span className="text-xl font-normal">Due Date:</span>
            <span className="text-xl font-normal">
              {data?.due_date
                ? moment(data?.due_date).format("MMM DD, YYYY")
                : "-"}
            </span>
          </div>

          {Array.isArray(data?.preferred_location) &&
            data?.preferred_location?.length > 0 && (
              <div className="flex items-center">
                <LocationIcon /> &nbsp;
                <span className="text-base font-normal opacity-50">
                  {data.preferred_location.join(", ")}
                </span>
              </div>
            )}
        </div>
        <div className="flex items-center mt-3 gap-3">
          <BlurredImage
            src={data.userdata?.user_image || "/images/default_avatar.png"}
            height="2.2625rem"
            width="2.2625rem"
            allowToUnblur={false}
            type="small"
          />
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
            <span className="text-xl font-normal leading-7 capitalize">
              {data.userdata?.first_name} {data.userdata?.last_name}
            </span>
          </div>
        </div>
      </PengingProposalWrapper>
    ) : (
      <>
        {data.milestone.length > 0 && (
          <MilestoneStats
            milestones={data.milestone}
            isHourly={data.budget?.type === "hourly"}
            isFreelancer={true}
          />
        )}
        <div className="bg-white shadow-[0px_4px_60px_rgba(0,0,0,0.05)] mt-6 rounded-xl border border-[#FFD700]">
          <div className="p-9 flex flex-col md:flex-row justify-between items-start gap-3">
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-normal">
                {convertToTitleCase(data.job_title)}
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex items-center flex-wrap">
                  <span className="text-xl font-normal opacity-50 mr-2">
                    Started:
                  </span>
                  <span className="text-xl font-normal leading-7">
                    {data.job_start_date &&
                      moment(data.job_start_date).format("MMM DD, YYYY")}
                  </span>
                </div>
                {data.status === "active" && (
                  <div className="flex items-center gap-3">
                    <Divider />
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-normal opacity-50">
                        Due Date:{" "}
                      </span>
                      <span className="text-xl font-normal">
                        {data?.due_date
                          ? moment(data?.due_date).format("MMM DD, YYYY")
                          : "-"}
                      </span>
                    </div>
                  </div>
                )}
                {data.status === "closed" && (
                  <div className="flex items-center gap-3">
                    <Divider />
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-normal opacity-50">
                        Ended:{" "}
                      </span>
                      <span className="text-xl font-normal">
                        {data?.job_end_date
                          ? moment(data?.job_end_date).format("MMM DD, YYYY")
                          : "-"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <StatusBadge
                className="w-fit"
                color={JOBS_STATUS[data?.status]?.color || "yellow"}
              >
                {data.status === "active"
                  ? "Work In Progress"
                  : changeStatusDisplayFormat(data?.status)}
              </StatusBadge>
            </div>
            <div>
              <BlurredImage
                src={data.userdata?.user_image || "/images/default_avatar.png"}
                height="5.25rem"
                width="5.25rem"
                className="mr-0 flex justify-center"
              />
              <div className="flex flex-wrap mt-4 items-end w-max max-w-[20rem] md:w-auto">
                <div className="text-xl font-normal leading-7 capitalize">
                  {data.userdata?.first_name} {data.userdata?.last_name}
                  <span className="text-lg font-normal opacity-50 ps-2">
                    Client
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#FFD700] p-9 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <label className="text-base font-normal opacity-50">
                Total Budget
              </label>
              <div className="text-xl font-normal mt-1">
                {data?.proposal?.approved_budget?.amount &&
                  `${numberWithCommas(
                    data?.proposal?.approved_budget?.amount,
                    "USD"
                  )}${
                    data?.proposal?.approved_budget?.type === "hourly"
                      ? "/hr"
                      : ""
                  }`}
                {data?.status === "active" &&
                  (data?.proposal?.budget_change?.status !== "pending" ||
                    data?.proposal?.budget_change?.requested_by !==
                      "freelancer") && (
                    <button
                      className="ml-2 px-3.5 py-1.5 text-sm rounded-full bg-primary transition-colors cursor-pointer"
                      onClick={() => setChangeBudgetModal(true)}
                    >
                      Change Budget
                    </button>
                  )}
              </div>
            </div>

            {data?.status === "active" &&
              data?.proposal?.budget_change?.status === "pending" &&
              data?.proposal?.budget_change?.amount && (
                <div className="flex-1">
                  <label className="text-base font-normal opacity-50">
                    Requested{" "}
                    {data?.proposal?.approved_budget?.type === "hourly"
                      ? "rate"
                      : "budget"}{" "}
                    <FaEdit
                      className="inline-block cursor-pointer text-dark align-text-top"
                      onClick={() => setChangeBudgetModal(true)}
                    />
                    <MdDelete
                      className="inline-block cursor-pointer text-dark align-text-top ml-1"
                      onClick={() => setChangeBudgetDeleteModal(true)}
                    />
                  </label>
                  <div className="text-xl font-normal mt-1 ml-4">
                    {data?.proposal?.budget_change?.amount &&
                      `${numberWithCommas(
                        data?.proposal?.budget_change?.amount,
                        "USD"
                      )}${
                        data?.proposal?.approved_budget?.type === "hourly"
                          ? "/hr"
                          : ""
                      }`}
                  </div>
                </div>
              )}

            <div className="flex-1">
              <div className="text-base font-normal opacity-50">
                {data?.budget?.type === "hourly"
                  ? "Total Hours Worked"
                  : "Total in Milestones"}
              </div>
              <div className="mt-1 text-xl font-normal">
                {data?.budget?.type === "hourly"
                  ? `${numberWithCommas(data?.total_hours?.toString() || "0")} Hours`
                  : numberWithCommas(
                      totalMilestoneAmount?.toString() || "0",
                      "USD"
                    )}
              </div>
            </div>
            <div className="hidden md:block w-px h-[58px] bg-black"></div>
            <div className="flex-1">
              <label className="text-base font-normal opacity-50">
                Sent to Freelancer
              </label>
              <div className="text-xl font-normal mt-1">
                {data.total_earnings
                  ? numberWithCommas(data?.total_earnings, "USD")
                  : "$0"}
              </div>
            </div>
          </div>
          {data?.proposal?.approved_budget && (
            <ChangeBudgetModal
              show={changeBudgetModal}
              toggle={() => setChangeBudgetModal((prev) => !prev)}
              jobDetails={data as any}
              userType="freelancer"
            />
          )}

          <ChangeBudgetDeleteRequest
            show={changeBudgetDeleteModal}
            setShow={setChangeBudgetDeleteModal}
            jobPostId={data.job_post_id.toString()}
            refetch={refetch}
          />
        </div>
      </>
    )
  ) : (
    <NoPropsalWrapper className="header flex flex-col md:flex-row justify-between md:items-start gap-3">
      <div className="content flex flex-col flex-wrap flex-1">
        <div className="flex flex-row justify-between">
          <span className="text-2xl font-normal">
            {convertToTitleCase(data.job_title)}
          </span>
          <div className="flex">
            <Tooltip
              customTrigger={
                <div
                  className="h-[43px] w-[43px] rounded-full flex justify-center items-center cursor-pointer"
                  onClick={onBookmarkClick}
                >
                  {loading ? (
                    <Spinner />
                  ) : isSaved ? (
                    <SavedIcon />
                  ) : (
                    <UnSavedIcon className={user ? "" : "blurred-2px"} />
                  )}
                </div>
              }
            >
              {user
                ? !isSaved
                  ? BOOKMARK_TOOLTIPS.save
                  : BOOKMARK_TOOLTIPS.unsave
                : BOOKMARK_TOOLTIPS.not_logged_in}
            </Tooltip>
            <Tooltip
              customTrigger={
                <div
                  className="h-[43px] w-[43px] rounded-full flex justify-center items-center cursor-pointer ml-2.5"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    if (navigator.share) {
                      navigator.share({
                        title: "Share this job",
                        text: "Check out this job",
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <ShareIcon />
                </div>
              }
            >
              Share
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <div className={!user?.is_account_approved ? "blurred-9px" : ""}>
            <BlurredImage
              src={data.userdata?.user_image || "/images/default_avatar.png"}
              height="2.625rem"
              width="2.625rem"
              className="mr-4"
              allowToUnblur={false}
            />
            <span className="text-xl font-normal leading-7 capitalize">
              {data.userdata?.first_name} {data.userdata?.last_name}
            </span>
          </div>
          <Divider />
          <div className="flex items-center flex-wrap gap-3">
            {data.userdata?.location && (
              <div className="flex items-center">
                <LocationIcon />
                <div className="text-base font-normal opacity-50 ml-2">
                  {data.userdata.location.country_name}
                </div>
              </div>
            )}
            <div className="flex items-center">
              <StarIcon />
              <div className="text-base font-normal ml-2">
                {data.avg_rating?.toFixed(1)}
              </div>
              <div className="text-sm font-light opacity-50 ml-1">
                Ratings (
                {numberWithCommas(data?.count_rating?.toString() || "0")})
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div className="flex items-center flex-wrap gap-3">
            <div className="text-xl font-normal leading-7 opacity-50">
              Posted:
            </div>
            <div className="text-xl font-normal leading-7">
              {data?.date_created &&
                moment(data.date_created).format("MMM DD, YYYY")}
            </div>
            <Divider />
            <div className="flex items-center gap-2">
              <span className="text-xl font-normal opacity-50">Due date: </span>
              <span className="text-xl font-normal">
                {data?.due_date
                  ? moment(data?.due_date).format("MMM DD, YYYY")
                  : "-"}
              </span>
            </div>
          </div>
          <div className="flex">
            {data?.status === "prospects" && !isProposalSubmitted && (
              <div className="flex-2">
                {user?.is_account_approved ? (
                  user.stp_account_id &&
                  user?.stp_account_status === "verified" ? (
                    <CustomButton
                      className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                      onClick={() => setShowSubmitProposalModal(true)}
                      text="Submit Proposal"
                    />
                  ) : (
                    <Tooltip
                      customTrigger={
                        <CustomButton
                          disabled
                          className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] disabled:opacity-50"
                          text="Submit Proposal"
                          onClick={() => {}}
                        />
                      }
                      className="inline-block align-middle"
                    >
                      Please {!user.stp_account_id ? "create" : "activate"} your
                      stripe account to submit proposals
                    </Tooltip>
                  )
                ) : (
                  <Tooltip
                    customTrigger={
                      <CustomButton
                        disabled
                        className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px] disabled:opacity-50"
                        text="Submit Proposal"
                        onClick={() => {}}
                      />
                    }
                    className="inline-block align-middle"
                  >
                    Your account is still under review. You&apos;ll be able to
                    apply to projects once it&apos;s been approved.
                  </Tooltip>
                )}
              </div>
            )}
            {data?.status === "prospects" && isProposalSubmitted && (
              <div>
                <StatusBadge className="w-fit" color="yellow">
                  Pending
                </StatusBadge>
              </div>
            )}
          </div>
        </div>
      </div>

      <SubmitProposalModal
        show={showSubmitProposalModal}
        toggle={toggleProposalModal}
        data={data as any}
        onSubmitProposal={onSubmitProposal}
      />
    </NoPropsalWrapper>
  );
};

export default DetailsBanner;

const Divider = () => {
  return <div className="hidden lg:block opacity-50">|</div>;
};
