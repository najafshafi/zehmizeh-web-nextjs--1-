/*
 * This component is a banner of freelncer profile on client side
 */

import { useState } from "react";
import styled from "styled-components";
import Spinner from "@/components/forms/Spin/Spinner";
import toast from "react-hot-toast";
import cns from "classnames";
import { StyledButton } from "@/components/forms/Buttons";
import { StatusBadge } from "@/components/styled/Badges";
import SelectJobModal from "@/components/invite-flow-modals/SelectJobModal";
import InviteFreelancerMessageModal from "@/components/invite-flow-modals/InviteFreelancerMessageModal";
import Tooltip from "@/components/ui/Tooltip";
import BlurredImage from "@/components/ui/BlurredImage";
import { toggleBookmarkUser } from "@/helpers/http/search";
import { inviteFreelancer } from "@/helpers/http/jobs";
import {
  numberWithCommas,
  separateValuesWithComma,
} from "@/helpers/utils/misc";
import UnSavedIcon from "@/public/icons/unsaved.svg";
import SavedIcon from "@/public/icons/saved.svg";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import LocationIcon from "@/public/icons/location-blue.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import JobsDoneIcon from "@/public/icons/jobs-done.svg";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import { useAuth } from "@/helpers/contexts/auth-context";
import { BsStar } from "react-icons/bs";
import ProposalExistsModal from "@/components/invite-flow-modals/ProposalExistsModa";
import { BOOKMARK_TOOLTIPS } from "@/helpers/const/constants";
import classNames from "classnames";
import CustomButton from "@/components/custombutton/CustomButton";

const StyledprofileCard = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 0.875rem;
  background: ${(props) => props.theme.colors.white};
  .content {
    max-width: 80%;
    @media ${breakpoints.mobile} {
      max-width: 100%;
    }
  }
  .talent__details {
    max-width: 80%;
    @media ${breakpoints.mobile} {
      max-width: 100%;
    }
  }
  .talent__details__post {
    /* line-height: 1rem; */
    opacity: 0.6;
  }
  .profile-name {
    word-wrap: break-word;
    max-width: 100%;
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
  .light-text {
    opacity: 0.63;
  }
  .blur {
    filter: blur(5px);
  }
`;

export const BookmarkIcon = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
`;

const FreelancerProfileBanner = ({ data }: any) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [isSaved, setISaved] = useState<boolean>(data?.is_bookmarked);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] =
    useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const isFreelancerLookingAtOtherFreelancers =
    user?.user_type === "freelancer";

  const onBookmarkClick = () => {
    // This will call bookmark / unbookmark freelancer api
    if (user) {
      setLoading(true);
      toggleBookmarkUser(data.user_id).then((res) => {
        if (res.status) {
          setISaved(!isSaved);
        }
        setLoading(false);
      });
    }
  };

  const handleRatingClick = () => {
    if (data?.feedback_count) {
      const element = document.getElementById("profile-ratings");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  /* Toggles select job modal, so that client can select job and invite this freelancer */
  const toggleJobsModal = () => {
    setShowJobsModal(!showJobsModal);
  };

  /* Toggles the message modal, that allows the client to type a message and send with invite */
  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const onSelectJobAndContinue = (jobId: string, proposalExists: boolean) => {
    // Once job is selected, this will open invite message modal
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    // Invite api call

    const body: any = {
      job_post_id: selectedJobId,
      freelancer_user_id: [data?.user_id],
    };
    setSendingInvite(true);
    if (msg !== "") {
      body.message = msg;
    }
    inviteFreelancer(body)
      .then((res) => {
        setSendingInvite(false);
        if (res.message === "PROPOSAL_EXIST") {
          toggleInviteMessageModal();
          setProposalExistModal(true);
          setSelectedJobId(body.job_post_id);
          return;
        }
        if (res.status) {
          toast.success(
            `Invitation to ${
              data?.first_name + " " + data?.last_name
            } sent successfully!`
          );
          toggleInviteMessageModal();
        } else {
          toast.error(
            res?.message ? res?.message : "Invitation not sent successfully!"
          );
        }
      })
      .catch(() => {
        setSendingInvite(false);
      });
  };

  const bookmarkUI = () => {
    // Because freelancer can't add another freelancer as favourite 🤫
    if (isFreelancerLookingAtOtherFreelancers) return <></>;

    return (
      <Tooltip
        customTrigger={
          <BookmarkIcon
            className="flex justify-center items-center cursor-pointer"
            onClick={onBookmarkClick}
          >
            {loading ? (
              <Spinner />
            ) : isSaved ? (
              <SavedIcon />
            ) : (
              <UnSavedIcon className={user ? "" : "blurred-2px"} />
            )}
          </BookmarkIcon>
        }
      >
        {user
          ? !isSaved
            ? BOOKMARK_TOOLTIPS.save
            : BOOKMARK_TOOLTIPS.unsave
          : BOOKMARK_TOOLTIPS.not_logged_in}
      </Tooltip>
    );
  };

  const inviteButtonUI = () => {
    // Because freelancer can't invite freelancer 😃
    if (isFreelancerLookingAtOtherFreelancers) return <></>;

    return (
      <div className="flex justify-between items-center">
        {user ? (
          <CustomButton
            text=" Invite"
            className="py-[0.75rem] w-full min-w-[100px] text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-black hover:bg-black hover:text-white hover:border-none"
            onClick={toggleJobsModal}
          />
        ) : (
          <Tooltip
            customTrigger={
              <CustomButton
                text=" Invite"
                className="py-[0.75rem] w-full min-w-[100px] text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-black hover:bg-black hover:text-white hover:border-none"
                onClick={() => {}}
                disabled={true}
              />
            }
          >
            Please login to invite this freelancer.
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <StyledprofileCard className="flex gap-4 flex-wrap justify-between ">
      {/* Image and other details */}
      <div className="content flex gap-4 flex-wrap flex-col">
        {/* Profile image with overlay */}
        <BlurredImage
          src={data?.user_image || "/images/default_avatar.png"}
          height="7.25rem"
          width="7.25rem"
          allowToUnblur={!!user}
        />

        <div className="talent__details ">
          {/* Name and designation */}
          <div>
            <div
              className={cns(
                "talent-details--content flex align-center flex-wrap gap-3",
                {
                  blur: !user || isFreelancerLookingAtOtherFreelancers,
                }
              )}
            >
              <div className="profile-name fs-28 fw-400 capitalize">
                {!user || isFreelancerLookingAtOtherFreelancers
                  ? "John Doe"
                  : `${data.first_name} ${data.last_name}`}
              </div>
              {data?.is_agency ? (
                <StatusBadge color="blue">Agency</StatusBadge>
              ) : null}
            </div>
            {data?.agency_name && (
              <div className="talent__details__post fs-18 fw-400 mt-2 capital-first-ltr">
                {data.agency_name}
              </div>
            )}
            <div className="talent__details__post fs-18 fw-400 mt-3 capital-first-ltr line-break">
              {data.job_title}
            </div>
          </div>

          {/* Freelancer hourly rate, location, ratings and invite button */}
          <div className="talent__other-details mt-3 flex align-center flex-wrap gap-2">
            {/* Houlry rate */}

            <div className="flex budget w-fit align-center">
              <DollarCircleIcon />
              <div className="fs-1rem fw-400 flex mx-1">
                {data?.hourly_rate ? (
                  <>
                    {numberWithCommas(data?.hourly_rate, "USD")}
                    <div className="budget-label fs-1rem fw-300">/hr</div>
                  </>
                ) : (
                  <div className="budget-label fs-1rem fw-300 ms-1">n/a</div>
                )}
              </div>
            </div>

            {/* Location */}

            {(data?.location?.state || data?.location?.country_name) && (
              <div className="flex budget align-center w-fit">
                <LocationIcon />
                &nbsp;
                <div className="flex fs-1rem fw-400 light-text">
                  {separateValuesWithComma([
                    data?.location?.state,
                    data?.location?.country_name,
                  ])}
                </div>
              </div>
            )}

            {/* Ratings */}
            <div
              className={classNames("flex budget align-center w-fit", {
                pointer: data?.feedback_count,
              })}
              onClick={handleRatingClick}
            >
              {data?.feedback_count ? <StarIcon /> : <BsStar color="#f2b420" />}
              <div className="flex mx-1 align-center fs-1rem fw-400">
                {data?.avg_rating?.toFixed(1) ?? 0}
                <div className="mx-1 budget-label fs-sm fw-300">
                  Ratings ({numberWithCommas(data?.feedback_count) || 0})
                </div>
              </div>
            </div>

            {/* Total jobs done */}
            <div className="flex budget align-center w-fit">
              <JobsDoneIcon />
              <div className="flex mx-1 align-center fs-1rem fw-400">
                {numberWithCommas(data.completedJobCount)}
                <div className="mx-1 budget-label fs-sm fw-300">
                  Projects done
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boomark and invite button */}
      <div className="flex flex-col justify-between md:items-end gap-4">
        {bookmarkUI()}
        {inviteButtonUI()}
      </div>

      {/* Select job modal for inviting freeancer */}

      {showJobsModal && (
        <SelectJobModal
          show={showJobsModal}
          toggle={toggleJobsModal}
          onNext={onSelectJobAndContinue}
          freelancerName={data?.first_name + " " + data?.last_name}
          freelancerId={data?.user_id}
        />
      )}

      {/* Invite mesage modal - to send a message with invite*/}

      <InviteFreelancerMessageModal
        show={showInviteMessageModal}
        toggle={toggleInviteMessageModal}
        freelancerName={data?.first_name + " " + data?.last_name}
        onInvite={onInvite}
        loading={sendingInvite}
      />

      {/* Proposal Exists Modal */}
      <ProposalExistsModal
        job_post_id={selectedJobId}
        show={proposalExistModal}
        toggle={() => {
          setSelectedJobId("");
          setProposalExistModal((prev) => !prev);
        }}
      />
    </StyledprofileCard>
  );
};

export default FreelancerProfileBanner;
