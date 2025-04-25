/*
 * This component displays the right side of the Job card: Job Status badge / Save icon and Date *
 */

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import moment from "moment";
import { StatusBadge } from "@/components/styled/Badges";
import BookmarkIcon from "@/public/icons/saved.svg";
import { JOBS_STATUS } from "../consts";
import { StyledButton } from "@/components/forms/Buttons";
import toast from "react-hot-toast";
import { reopenProposal } from "@/helpers/http/proposals";

interface JobProposal {
  proposal_id?: number;
  proposed_budget?: { amount?: number };
  status?: string;
  is_proposal_deleted?: number;
  is_job_deleted?: number;
  is_viewed?: boolean;
  date_created?: string | Date;
  approved_budget?: { amount?: number };
}

interface JobItem {
  status?: string;
  proposal?: JobProposal;
  budget?: { type?: string; amount?: number; max_amount?: number };
  preferred_location?: string[];
  due_date?: string | Date;
  first_name?: string;
  last_name?: string;
  user_image?: string;
  job_start_date?: string | Date;
  job_end_date?: string | Date;
  date_created?: string | Date;
}

type Props = {
  item: JobItem;
  listingType: string;
  onBookmarkClick: (e: React.MouseEvent) => void;
  setDisableLink?: Dispatch<
    SetStateAction<boolean>
  > /* To disable the link on the list item */;
  refetch: () => void;
};

const StatusAndDateSection = ({
  item,
  listingType,
  onBookmarkClick,
  setDisableLink,
  refetch,
}: Props) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSaving(true);
    onBookmarkClick(e);
  };

  const handleReOpenProposal = (proposal: JobProposal) => {
    if (!proposal || !proposal?.proposal_id)
      return toast.error("Invalid request.");

    const response = reopenProposal({ proposal_id: proposal?.proposal_id });
    setLoading(true);

    toast.promise(response, {
      loading: "Re-opening proposal...",
      success: (data) => {
        setLoading(false);
        refetch();
        return data.message;
      },
      error: (error) => {
        setLoading(false);
        return error.response.data.message;
      },
    });
  };

  const status = useMemo(() => {
    if (item?.proposal?.is_proposal_deleted === 1)
      return "Deleted by Freelancer";
    if (item?.proposal?.status === "denied") return "Declined";
    if (item?.status === "active" && item?.proposal?.status === "awarded")
      return "Awarded to Another Freelancer";
    if (item?.status === "active") return "Work In Progress";
    if (item?.status === "closed") return "Closed";
    if (item?.status === "deleted") return "Canceled by Client";
    if (item?.status === "prospects") {
      if (item?.proposal?.status === "pending") return "Pending";
      else return "Declined";
    }
    return "";
  }, [item?.proposal?.status, item.status]);

  const handleProposalStatus = (jobItem: JobItem) => {
    if (
      jobItem?.proposal?.is_job_deleted === 1 ||
      jobItem?.proposal?.is_proposal_deleted === 1
    )
      return "darkPink";
    if (
      jobItem?.proposal?.status &&
      ["denied", "awarded"].includes(jobItem.proposal.status)
    ) {
      return (
        JOBS_STATUS[jobItem.proposal.status as keyof typeof JOBS_STATUS]
          ?.color || "green"
      );
    }

    return jobItem?.status
      ? JOBS_STATUS[jobItem.status as keyof typeof JOBS_STATUS]?.color ||
          "green"
      : "green";
  };

  return (
    <div className="flex flex-col justify-between flex-2 gap-3 md:items-end ">
      {listingType == "saved" && (
        <div
          className=" h-[43px] w-[43px] rounded-[2rem] bg-[#F2B420] text-white flex justify-center items-center cursor-pointer"
          onClick={onBookmark}
        >
          {saving ? (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <BookmarkIcon />
          )}
        </div>
      )}

      <div>
        {item?.proposal?.proposed_budget?.amount && listingType !== "saved" && (
          <StatusBadge color={handleProposalStatus(item)} className="w-fit">
            {status}
          </StatusBadge>
        )}
        {/* START ----------------------------------------- Showing read and unread status when project is prospect and proposal status is pending */}
        {item?.status === "prospects" &&
          item?.proposal?.status === "pending" && (
            <StatusBadge
              color={item?.proposal?.is_viewed ? "green" : "red"}
              className="ml-3"
            >
              {item?.proposal?.is_viewed ? "Read" : "Unread"}
            </StatusBadge>
          )}
        {/* END ------------------------------------------- Showing read and unread status when project is prospect and proposal status is pending */}
      </div>

      {item?.proposal && item?.proposal?.is_proposal_deleted === 1 && (
        <div
          onMouseEnter={() => setDisableLink?.(true)}
          onMouseLeave={() => setDisableLink?.(false)}
        >
          <StyledButton
            disabled={loading}
            variant="outline-dark"
            type="submit"
            className="flex items-center gap-3"
            onClick={() => handleReOpenProposal(item?.proposal as JobProposal)}
          >
            {loading && (
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            )}{" "}
            Re-open
          </StyledButton>
        </div>
      )}

      {/* Date applied on or Started to end date */}

      {listingType !== "saved" && (
        <div className="listing__applied-date text-base font-normal text-gray-500">
          {item?.status &&
            ["active", "closed"].includes(item.status) &&
            `Proposal Sent: ${moment(item?.proposal?.date_created).format(
              "MMM DD, YYYY"
            )}`}

          {/* {item?.status == 'closed' &&
            moment(item?.job_start_date)?.format('MMM DD, YYYY') +
              ' - ' +
              moment(item?.job_end_date).format('MMM DD, YYYY')} */}

          {item?.proposal?.status == "pending" &&
            "Applied on " +
              moment(item?.proposal?.date_created)?.format("MMM DD, YYYY")}
        </div>
      )}
      {listingType == "saved" && (
        <div className="listing__applied-date text-[1rem] font-normal text-gray-500">
          {moment(item?.date_created)?.format("MMM DD, YYYY")}
        </div>
      )}
    </div>
  );
};

export default StatusAndDateSection;
