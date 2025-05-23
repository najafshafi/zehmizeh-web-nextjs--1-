/*
 * This is the Job card of search page
 */
import React, { useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import cns from "classnames";
import Spinner from "@/components/forms/Spin/Spinner";
import Link from "next/link";
import { transition } from "@/styles/CssUtils";
import Tooltip from "@/components/ui/Tooltip";
import { toggleBookmarkPost } from "@/helpers/http/search";
import { useAuth } from "@/helpers/contexts/auth-context";
import UnSavedIcon from "@/public/icons/unsaved.svg";
import SavedIcon from "@/public/icons/saved.svg";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import LocationIcon from "@/public/icons/location-blue.svg";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import { BOOKMARK_TOOLTIPS } from "@/app/job-details/consts";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import { rangeOfNumber } from "@/helpers/utils/rangeOfNumber";
import { StatusBadge } from "@/components/styled/Badges";

const WorkItemWrapper = styled(Link)<{ isloggedin?: string }>`
  position: relative;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 52px rgba(0, 0, 0, 0.08);
  width: 870px;
  @media (max-width: 1200px) {
    width: 100%;
  }
  margin: auto;
  padding: 2rem;
  margin-bottom: 1.875rem;
  border-radius: 14px;
  ${(props) => props.isloggedin === "true" && transition()}
  .work-item__details {
    overflow: hidden;
  }
  .work-item__details__title {
    line-height: 2rem;
  }
  .work-item__details__description {
    line-height: 28.8px;
    letter-spacing: -0.02em;
    opacity: 0.6;
  }
  .work-item__other-details {
    gap: 12px;
  }
  .budget {
    background: ${(props) => props.theme.colors.body2};
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
  }
  .budget-label {
    opacity: 0.63;
    letter-spacing: 0.02em;
  }
  .posted-on {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
  }
  @media (max-width: 600px) {
    .budget {
      margin-bottom: 20px;
    }
    .posted-on {
      position: absolute;
      left: 2.5rem;
      bottom: 0.5rem;
      margin: 5px 5px;
    }
  }
`;

const JobCard = ({
  workDetails,
  index,
}: {
  workDetails?: any;
  index?: number;
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isSaved, setIsSaved] = React.useState<boolean>(
    workDetails?.is_bookmarked
  );

  const jobFilterStatus = {
    prospects: { label: "Open", color: "green" },
    closed: { label: "Closed", color: "red" },
  };

  const onBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (user && user?.is_account_approved) {
      setLoading(true);
      toggleBookmarkPost(workDetails.job_post_id).then((res) => {
        if (res.status) {
          setIsSaved(!isSaved);
        }
        setLoading(false);
      });
    }
  };

  const goToDetailsPage = (e: React.MouseEvent) => {
    if (!user?.is_account_approved) {
      e.preventDefault();
      return false;
    }
  };

  const getTooltip = () => {
    if (!user) return "Please login to save this project.";

    if (user?.is_account_approved) {
      if (isSaved) {
        return BOOKMARK_TOOLTIPS.unsave;
      } else {
        return BOOKMARK_TOOLTIPS.save;
      }
    } else {
      return "Your account is still under review. You'll be able to save projects once it's been approved.";
    }
  };

  // Get range from total proposals count
  // eg total proposal are 8 then range will be 5-10
  // for greater than 30 it'll be in range of 10s. number 34 then 30-40
  const totalProposalRange = useMemo(() => {
    const total = Number(workDetails?.total_proposals);
    if (total <= 0) return;

    if (total <= 5) {
      return total.toString();
    }
    return rangeOfNumber(total, total > 30 ? 10 : 5).join(" - ");
  }, [workDetails?.total_proposals]);

  return (
    <WorkItemWrapper
      className={cns("flex gap-3 no-hover-effect overflow-hidden", {
        "cursor-pointer": user && user?.is_account_approved,
      })}
      href={`/job-details/${workDetails.job_post_id}/gen_details`}
      onClick={goToDetailsPage}
      isloggedin={Boolean(user && user?.is_account_approved).toString()}
    >
      <div className="work-item__details w-full">
        <div className="flex flex-wrap justify-between">
          <div className="work-item__details__title text-2xl font-normal">
            {convertToTitleCase(workDetails.job_title)}
          </div>
        </div>

        <div className="work-item__details__description text-lg font-light mt-2">
          {workDetails?.job_description && (
            <StyledHtmlText
              htmlString={workDetails?.job_description}
              id={`search_${workDetails?.job_post_id}_${index}`}
              needToBeShorten={true}
            />
          )}
        </div>
        {workDetails?.attachments?.length > 0 && (
          <div
            className="flex items-center gap-4 flex-wrap mt-3"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            {workDetails.attachments?.map((item: string) => (
              <div key={item} className="flex">
                <AttachmentPreview
                  uploadedFile={item}
                  removable={false}
                  shouldShowFileNameAndExtension={false}
                />
              </div>
            ))}
          </div>
        )}

        <div className="work-item__other-details mt-3 flex items-center flex-wrap">
          <div className="flex budget gap-2">
            {workDetails?.budget?.isProposal === false ? (
              <DollarCircleIcon />
            ) : null}
            <div className="budget-value text-base font-normal">
              {workDetails?.budget?.type == "fixed" ? (
                workDetails?.budget?.isProposal === true ? (
                  <div className="budget-label text-base font-light">
                    Open to Proposals
                  </div>
                ) : (
                  showFormattedBudget(workDetails?.budget)
                )
              ) : workDetails?.budget?.isProposal === true ? (
                <div className="budget-label text-base font-light">
                  Open to Proposals
                </div>
              ) : (
                showFormattedBudget(workDetails?.budget)
              )}
            </div>

            {workDetails?.budget?.type === "fixed" && (
              <div className="budget-label text-base font-light">
                {workDetails?.budget?.isProposal === true ? null : "Budget"}
              </div>
            )}
          </div>

          {/* START ----------------------------------------- Submitted proposals */}
          {Number(workDetails?.total_proposals) > 0 && (
            <div className="budget">
              <div className="budget-label text-base font-light">
                {totalProposalRange}{" "}
                {workDetails?.total_proposals > 1 ? "Proposals" : "Proposal"}{" "}
                Submitted
              </div>
            </div>
          )}
          {/* END ------------------------------------------- Submitted proposals */}

          {Array.isArray(workDetails?.preferred_location) &&
            workDetails?.preferred_location?.length > 0 && (
              <div className="flex items-center budget gap-1">
                <LocationIcon />
                <div className="work-item__location text-base font-normal budget-label">
                  {workDetails.preferred_location.join(", ")}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="mt-2">
        <StatusBadge
          color={
            jobFilterStatus[workDetails.status as keyof typeof jobFilterStatus]
              .color
          }
        >
          {
            jobFilterStatus[workDetails.status as keyof typeof jobFilterStatus]
              .label
          }
        </StatusBadge>
      </div>
      <Tooltip
        customTrigger={
          <div
            className="flex justify-center items-center h-[43px] w-[43px] rounded-[2rem] bg-[#f5f5f5]"
            onClick={onBookmarkClick}
          >
            {loading ? <Spinner /> : isSaved ? <SavedIcon /> : <UnSavedIcon />}
          </div>
        }
        className="inline-block align-middle"
      >
        {getTooltip()}
      </Tooltip>

      <div className="posted-on budget-label">
        {moment(workDetails.date_created).format("MMM DD, YYYY")}
      </div>
    </WorkItemWrapper>
  );
};

export default JobCard;
