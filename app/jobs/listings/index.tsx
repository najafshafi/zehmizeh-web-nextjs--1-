/*
 * This component do the listings of the jobs and renders the listings components *
 */

"use client";
import { useMemo, useState } from "react";
import ListingFooter from "./ListingFooter";
import StatusAndDateSection from "./StatusAndDateSection";
import { toggleBookmarkPost } from "@/helpers/http/search";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { convertToTitleCase } from "@/helpers/utils/misc";
import classNames from "classnames";
import moment from "moment";
import { isProjectHiddenForFreelancer } from "@/helpers/utils/helper";
import Link from "next/link";

// Define the job item structure
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
  job_post_id: string;
  job_title: string;
  job_description: string;
  status?: string;
  proposal?: JobProposal;
  is_hidden?:
    | {
        value: number;
        date: string;
      }
    | 0
    | 1;
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

interface Props {
  data: JobItem[];
  listingType: string;
  refetch: () => void;
  sortFilter?: (status: string) => void;
  toggleReset?: string;
}

type StatusKey = "Pending" | "Declined" | "All" | "Canceled_by_client";

const JobProposalStatuses: Record<StatusKey, string> = {
  Pending: "pending",
  Declined: "denied",
  All: "all",
  Canceled_by_client: "canceled_by_client",
};

const Listings = ({
  data = [],
  listingType,
  refetch,
  sortFilter,
  toggleReset = "",
}: Props) => {
  const [toggleName, setToggleName] = useState("Filter by");
  const [disableLink, setDisableLink] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onBookmarkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkPost(id).then(() => {
      refetch();
    });
  };

  const filterJobProposals = (status: StatusKey) => () => {
    sortFilter?.(JobProposalStatuses[status]);
    setToggleName(JobProposalStatuses[status]);
    setIsDropdownOpen(false);
  };

  const toggleResetValue = useMemo(() => {
    switch (toggleReset) {
      case "pending":
        return "Pending";
      case "denied":
        return "Declined";
      case "canceled_by_client":
        return "Canceled by Client";
      default:
        return toggleReset;
    }
  }, [toggleReset]);

  return (
    <div>
      {listingType === "applied_job" && (
        <>
          <div className="relative inline-block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 text-gray-700"
              type="button"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {toggleResetValue || toggleName}
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <div
                  onClick={filterJobProposals("All")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                >
                  All
                </div>
                <div
                  onClick={filterJobProposals("Pending")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                >
                  Pending
                </div>
                <div
                  onClick={filterJobProposals("Declined")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                >
                  Declined
                </div>
                <div
                  onClick={filterJobProposals("Canceled_by_client")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                >
                  Canceled by Client
                </div>
              </div>
            )}
          </div>
          <br />
        </>
      )}

      {data?.map((item) => {
        const linkHref =
          item?.proposal?.status === "pending"
            ? `/job-details/${item.job_post_id}/proposal_sent`
            : item?.status === "prospects"
              ? `/job-details/${item.job_post_id}/gen_details`
              : `/job-details/${item.job_post_id}`;

        const isHidden = isProjectHiddenForFreelancer(item as any);

        return (
          <Link
            href={linkHref}
            key={item.job_post_id}
            onClick={(e) => {
              if (disableLink) e.preventDefault();
            }}
            className={classNames({
              "pointer-events-none": isHidden,
            })}
          >
            <div
              className={classNames(
                "relative bg-white p-8 rounded-[14px] mb-[30px] shadow-[0px_4px_74px_rgba(0,0,0,0.04)] transition-all duration-200 ease-in hover:shadow-[0px_8px_36px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 cursor-pointer flex flex-col md:flex-row justify-between gap-3 no-hover-effect",
                {
                  "pe-none": isHidden,
                  "pe-auto": !isHidden,
                }
              )}
            >
              {isHidden && (
                <span className="absolute top-0 left-0 right-0 text-center bg-[#FFEAEA] text-[#FF0505] py-1 text-sm rounded-t-[0.9rem]">
                  Client has hidden this post -{" "}
                  {typeof item?.is_hidden === "object" && item?.is_hidden?.date
                    ? moment(item.is_hidden.date).format("MMM DD, YYYY")
                    : ""}
                </span>
              )}
              {/* Left section */}
              <div className="content flex-1">
                <header className="leading-8 break-words fs-24 font-normal">
                  {convertToTitleCase(item.job_title)}
                </header>

                {item?.status !== "active" && item?.status !== "closed" ? (
                  <div className="mt-[9px] opacity-60 fs-18 font-normal">
                    <StyledHtmlText
                      htmlString={item.job_description}
                      id={`jobs_${item.job_post_id}`}
                      needToBeShorten={true}
                      minlines={3}
                    />
                  </div>
                ) : null}

                <ListingFooter item={item} />
              </div>

              {/* Right side section */}
              <StatusAndDateSection
                setDisableLink={setDisableLink}
                item={item}
                listingType={listingType}
                onBookmarkClick={(e: React.MouseEvent) =>
                  onBookmarkClick(item.job_post_id, e)
                }
                refetch={refetch}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Listings;
