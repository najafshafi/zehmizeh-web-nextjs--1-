/*
 * This is the Talent card component
 */
import { useEffect, useState } from "react";
import styled from "styled-components";
import cns from "classnames";
import Link from "next/link";
import toast from "react-hot-toast";
import Spinner from "@/components/forms/Spin/Spinner";
import { transition } from "@/styles/transitions";
import { StyledButton } from "@/components/forms/Buttons";
import SelectJobModal from "@/components/invite-flow-modals/SelectJobModal";
import InviteFreelancerMessageModal from "@/components/invite-flow-modals/InviteFreelancerMessageModal";
import Tooltip from "@/components/ui/Tooltip";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import BlurredImage from "@/components/ui/BlurredImage";
import { useAuth } from "@/helpers/contexts/auth-context";
import { BookmarkIcon } from "./Search.styled";
import { toggleBookmarkUser } from "@/helpers/http/search";
import { inviteFreelancer } from "@/helpers/http/jobs";
import {
  numberWithCommas,
  separateValuesWithComma,
} from "@/helpers/utils/misc";
import { BOOKMARK_TOOLTIPS } from "./consts";
import UnSavedIcon from "@/public/icons/unsaved.svg";
import SavedIcon from "@/public/icons/saved.svg";
import DollarCircleIcon from "@/public/icons/dollar-circle.svg";
import LocationIcon from "@/public/icons/location-blue.svg";
import StarIcon from "@/public/icons/star-yellow.svg";
import { BsStar } from "react-icons/bs";
import ProposalExistsModal from "@/components/invite-flow-modals/ProposalExistsModa";
import { hasClientAddedPaymentDetails } from "@/helpers/utils/helper";
import JobsDoneIcon from "@/public/icons/jobs-done.svg";
import { StatusBadge } from "@/components/styled/Badges";
import CustomButton from "@/components/custombutton/CustomButton";

const TalentComponentWrapper = styled(Link)<{ isloggedin?: string }>`
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 52px rgba(0, 0, 0, 0.08);
  width: 870px;
  @media (max-width: 1200px) {
    width: 100%;
  }
  margin: auto;
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
  margin-bottom: 1.875rem;
  border-radius: 14px;
  ${(props) => props.isloggedin && transition()}
  .talent-card--content {
    max-width: 80%;
  }
  .talent__details {
    max-width: 60%;
    border: 1px solid red;
  }
  .talent__details__title {
    display: flex;
    align-items: center;
    line-height: 2rem;
  }
  .talent__details__post {
    margin-top: 9px;
    opacity: 0.6;
  }
  .talent__details__description {
    margin-top: 1rem;
    line-height: 160%;
    letter-spacing: -0.02em;
    opacity: 0.6;
  }
  .light-text {
    opacity: 0.6;
  }
  .talent__other-details {
    margin-top: 1.25rem;
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
  .badget-text {
    margin-left: 5px;
  }
  .skills-details {
    margin-top: 0.75rem;
    gap: 1rem;
  }
  .skills {
    gap: 10px;
  }
  .bookmark-icon {
    height: fit-content;
  }
  .blur {
    filter: blur(5px);
  }
  @media (max-width: 768px) {
    .hide-overflow {
      overflow: hidden;
    }
  }
`;

const SkillItem = styled.div`
  padding: 0.625rem 0.75rem;
  background: #f6f6f6;
  border-radius: 0.5rem;
  text-transform: capitalize;
`;

interface TalentData {
  user_id: string;
  is_bookmarked?: boolean;
  first_name: string;
  last_name: string;
  job_title: string | null;
  about_me?: string;
  is_agency?: number;
  user_image?: string;
  skills?: Array<{
    id: string;
    name?: string;
    label?: string;
  }>;
  hourly_rate?: number;
  location?: {
    state?: string;
    country_name?: string;
  };
  avg_rate?: number;
  rating?: number;
  completedJobCount?: number;
}

interface MouseEvent extends React.MouseEvent<HTMLElement> {
  stopPropagation(): void;
  preventDefault(): void;
}

const TalentCard = ({ data }: { data?: TalentData }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [isSaved, setISaved] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] =
    useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const { user } = useAuth();

  const isFreelancerLookingAtOtherFreelancers =
    user?.user_type === "freelancer";

  useEffect(() => {
    setISaved(!!data?.is_bookmarked);
  }, [data?.is_bookmarked]);

  const onBookmarkClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      setLoading(true);
      toggleBookmarkUser(data?.user_id || "").then((res) => {
        if (res.status) {
          setISaved(!isSaved);
        }
        setLoading(false);
      });
    }
  };

  const goToFreelncerProfile = (e: MouseEvent) => {
    if (!user || !hasClientAddedPaymentDetails(user)) {
      e.preventDefault();
      return false;
    }
  };

  const toggleJobsModal = (e?: MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowJobsModal(!showJobsModal);
  };

  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const onSelectJobAndContinue = (jobId: string, proposalExists: boolean) => {
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    const body = {
      job_post_id: selectedJobId,
      freelancer_user_id: [data?.user_id],
      message: msg !== "" ? msg : undefined,
    };

    setSendingInvite(true);
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

  const InviteButtonUI = () => {
    // Because freelancer can't invite freelancer 😃
    if (isFreelancerLookingAtOtherFreelancers) {
      return <></>;
    }

    if (user && !hasClientAddedPaymentDetails(user)) {
      return (
        <Tooltip
          customTrigger={
            <StyledButton
              padding="0.875rem 2rem"
              variant="outline-dark"
              onClick={toggleJobsModal}
              disabled
            >
              Invite
            </StyledButton>
          }
          className="inline-block align-middle"
        >
          Please add payment details to invite this freelancer.
        </Tooltip>
      );
    }

    if (user)
      return (
        <CustomButton
          text="Invite"
          className="py-[0.75rem] w-full min-w-[100px] text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-black hover:bg-black hover:text-white hover:border-none"
          onClick={toggleJobsModal}
        />
      );

    return (
      <Tooltip
        customTrigger={
          <CustomButton
            text="Invite"
            className="py-[0.75rem] w-full min-w-[100px] text-center  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full  text-[18px] border border-black hover:bg-black hover:text-white hover:border-none"
            onClick={toggleJobsModal}
            disabled={true}
          />
        }
        className="inline-block align-middle"
      >
        Please login to invite this freelancer.
      </Tooltip>
    );
  };

  const bookmarkUI = () => {
    // Because freelancer can't add another freelancer as favourite 🤫
    if (isFreelancerLookingAtOtherFreelancers) return <></>;

    return (
      <Tooltip
        customTrigger={
          <BookmarkIcon
            className="flex justify-center items-center"
            onClick={onBookmarkClick}
          >
            {loading ? <Spinner /> : isSaved ? <SavedIcon /> : <UnSavedIcon />}
          </BookmarkIcon>
        }
        className="inline-block align-middle"
      >
        {user
          ? !isSaved
            ? BOOKMARK_TOOLTIPS.save
            : BOOKMARK_TOOLTIPS.unsave
          : BOOKMARK_TOOLTIPS.not_logged_in}
      </Tooltip>
    );
  };

  return (
    <>
      <TalentComponentWrapper
        href={`/freelancer/${data?.user_id}`}
        className={cns(
          "flex flex-wrap gap-4 justify-between no-hover-effect overflow-hidden ",
          {
            "cursor-auto": !user || !hasClientAddedPaymentDetails(user),
          }
        )}
        onClick={goToFreelncerProfile}
        isloggedin={(!!user).toString()}
      >
        <div className="talent-card--content flex flex-wrap lg:flex-nowrap gap-4">
          {/* Freelancer profile */}
          <BlurredImage
            src={data?.user_image || "/images/default_avatar.png"}
            height="5.75rem"
            width="5.75rem"
            allowToUnblur={!!user && hasClientAddedPaymentDetails(user)}
          />

          {/* Freelancer name and designation */}
          <div className="hide-overflow">
            <div>
              <div
                className={cns(
                  "talent__details__title text-2xl font-normal capitalize",
                  {
                    blur:
                      !user ||
                      !hasClientAddedPaymentDetails(user) ||
                      isFreelancerLookingAtOtherFreelancers,
                  }
                )}
              >
                <span>
                  {!user ||
                  !hasClientAddedPaymentDetails(user) ||
                  isFreelancerLookingAtOtherFreelancers
                    ? "John Doe"
                    : `${data?.first_name} ${data?.last_name}`}
                </span>
                {Number(data?.is_agency) === 1 && (
                  <StatusBadge color="blue" className="ml-2">
                    Agency
                  </StatusBadge>
                )}
              </div>
              {data?.job_title !== null && (
                <div className="talent__details__post text-lg font-normal capital-first-ltr line-break">
                  {data?.job_title}
                </div>
              )}
            </div>
            <OtherDetails data={data} />
            {data?.about_me && (
              <StyledHtmlText
                htmlString={data.about_me}
                id={`talent_${data?.user_id}`}
                className="mt-3 talent__details__description text-lg font-light"
                needToBeShorten={true}
                minlines={3}
              />
            )}
            <div className="skills-details flex items-center flex-wrap justify-between">
              {/* Skills */}
              <div className="skills flex items-center flex-wrap">
                {data?.skills?.map((skill) => {
                  return (
                    skill?.label && (
                      <SkillItem key={skill.id}>
                        <div>{skill.name || skill?.label}</div>
                      </SkillItem>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex lg:flex-col justify-between lg:items-end gap-3 items-center">
          {bookmarkUI()}
          {InviteButtonUI()}
        </div>
      </TalentComponentWrapper>
      {showJobsModal && (
        <SelectJobModal
          show={showJobsModal}
          toggle={toggleJobsModal}
          onNext={onSelectJobAndContinue}
          freelancerName={data?.first_name + " " + data?.last_name}
          freelancerId={data?.user_id}
        />
      )}
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
    </>
  );
};

export default TalentCard;

interface OtherDetailsProps {
  data?: TalentData;
}

const OtherDetails = ({ data }: OtherDetailsProps) => {
  return (
    <div className="talent__other-details flex items-center flex-wrap">
      <div className="flex budget w-fit items-center">
        <DollarCircleIcon />
        <div className="text-base font-normal flex mx-1">
          {data?.hourly_rate || data?.hourly_rate === 0 ? (
            <>
              {numberWithCommas(data.hourly_rate, "USD")}
              <span className="budget-label text-base ml-1 font-light">
                /Hour
              </span>
            </>
          ) : (
            <div className="budget-label text-base ml-1 font-light">n/a</div>
          )}
        </div>
      </div>

      {(data?.location?.state || data?.location?.country_name) && (
        <div className="flex budget items-center">
          <LocationIcon />
          <div className="flex text-base font-normal mx-1">
            {separateValuesWithComma([
              data?.location?.state || "",
              data?.location?.country_name || "",
            ])}
          </div>
        </div>
      )}

      <Link
        href={`/freelancer/${data?.user_id}/#profile-ratings`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex budget items-center">
          {!data?.avg_rate ? <BsStar color="#f2b420" /> : <StarIcon />}
          <div className="badget-text flex items-center text-base font-normal">
            {!data?.avg_rate
              ? 0
              : parseFloat(data?.avg_rate.toString()).toFixed(1) || 0}
            <div className="badget-text budget-label text-sm font-light">
              Ratings ({Math.floor(data?.rating || 0) || 0})
            </div>
          </div>
        </div>
      </Link>

      {/* START ----------------------------------------- Total Jobs Done */}
      <div className="flex budget items-center">
        <JobsDoneIcon />
        <div className="badget-text flex items-center text-base font-normal">
          {numberWithCommas(data?.completedJobCount || 0) || 0}&nbsp;
          <span>Projects done</span>
        </div>
      </div>
      {/* END ------------------------------------------- Total Jobs Done */}
    </div>
  );
};
