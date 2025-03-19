/*
 * This is the Talent card component
 */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import cns from 'classnames';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Spinner } from 'react-bootstrap';
import { transition } from '@/styles/transitions';
import { StyledButton } from '@/components/forms/Buttons';
import SelectJobModal from '@/components/invite-flow-modals/SelectJobModal';
import InviteFreelancerMessageModal from '@/components/invite-flow-modals/InviteFreelancerMessageModal';
import Tooltip from '@/components/ui/Tooltip';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import BlurredImage from '@/components/ui/BlurredImage';
import { useAuth } from '@/helpers/contexts/auth-context';
import { BookmarkIcon } from './Search.styled';
import { toggleBookmarkUser } from '@/helpers/http/search';
import { inviteFreelancer } from '@/helpers/http/jobs';
import { numberWithCommas, separateValuesWithComma } from '@/helpers/utils/misc';
import { BOOKMARK_TOOLTIPS } from './consts';
import UnSavedIcon from '@/public/icons/unsaved.svg';
import SavedIcon from '@/public/icons/saved.svg';
import DollarCircleIcon from '@/public/icons/dollar-circle.svg';
import LocationIcon from '@/public/icons/location-blue.svg';
import StarIcon from '@/public/icons/star-yellow.svg';
import { BsStar } from 'react-icons/bs';
import ProposalExistsModal from '@/components/invite-flow-modals/ProposalExistsModa';
import { hasClientAddedPaymentDetails } from '@/helpers/utils/helper';
import JobsDoneIcon from '@/public/icons/jobs-done.svg';
import { StatusBadge } from '@/components/styled/Badges';

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

const TalentCard = ({ data }: { data?: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);
  const [isSaved, setISaved] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState<boolean>(false);
  const [proposalExistModal, setProposalExistModal] = useState<boolean>(false);
  const [showInviteMessageModal, setShowInviteMessageModal] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  const { user } = useAuth();

  const isFreelancerLookingAtOtherFreelancers = user?.user_type === 'freelancer';

  useEffect(() => {
    setISaved(!!data?.is_bookmarked);
  }, [data?.is_bookmarked]);

  const onBookmarkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
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

  const goToFreelncerProfile = (e) => {
    if (!user || !hasClientAddedPaymentDetails(user)) {
      e.preventDefault();
      return false;
    }
  };

  const toggleJobsModal = (e?: any) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowJobsModal(!showJobsModal);
  };

  const toggleInviteMessageModal = () => {
    setShowInviteMessageModal(!showInviteMessageModal);
  };

  const onSelectJobAndContinue = (jobId, proposalExists: boolean) => {
    toggleJobsModal();
    setSelectedJobId(jobId);
    if (!proposalExists) toggleInviteMessageModal();
    else setProposalExistModal(true);
  };

  const onInvite = (msg: string) => {
    const body: any = {
      job_post_id: selectedJobId,
      freelancer_user_id: [data?.user_id],
    };
    if (msg !== '') {
      body.message = msg;
    }
    setSendingInvite(true);
    inviteFreelancer(body)
      .then((res) => {
        setSendingInvite(false);
        if (res.message === 'PROPOSAL_EXIST') {
          toggleInviteMessageModal();
          setProposalExistModal(true);
          setSelectedJobId(body.job_post_id);
          return;
        }

        if (res.status) {
          toast.success(`Invitation to ${data?.first_name + ' ' + data?.last_name} sent successfully!`);
          toggleInviteMessageModal();
        } else {
          toast.error(res?.message ? res?.message : 'Invitation not sent successfully!');
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
            <StyledButton padding="0.875rem 2rem" variant="outline-dark" onClick={toggleJobsModal} disabled>
              Invite
            </StyledButton>
          }
          className="d-inline-block align-middle"
        >
          Please add payment details to invite this freelancer.
        </Tooltip>
      );
    }

    if (user)
      return (
        <StyledButton padding="0.875rem 2rem" variant="outline-dark" onClick={toggleJobsModal}>
          Invite
        </StyledButton>
      );

    return (
      <Tooltip
        customTrigger={
          <StyledButton padding="0.875rem 2rem" variant="outline-dark" onClick={toggleJobsModal} disabled>
            Invite
          </StyledButton>
        }
        className="d-inline-block align-middle"
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
          <BookmarkIcon className="d-flex justify-content-center align-items-center" onClick={onBookmarkClick}>
            {loading ? <Spinner animation="border" /> : isSaved ? <SavedIcon /> : <UnSavedIcon />}
          </BookmarkIcon>
        }
        className="d-inline-block align-middle"
      >
        {user ? (!isSaved ? BOOKMARK_TOOLTIPS.save : BOOKMARK_TOOLTIPS.unsave) : BOOKMARK_TOOLTIPS.not_logged_in}
      </Tooltip>
    );
  };

  return (
    <>
      <TalentComponentWrapper
        to={`/freelancer/${data?.user_id}`}
        className={cns('d-flex flex-wrap gap-4 justify-content-between no-hover-effect overflow-hidden', {
          'cursor-auto': !user || !hasClientAddedPaymentDetails(user),
        })}
        onClick={goToFreelncerProfile}
        isloggedin={(!!user).toString()}
      >
        <div className="talent-card--content d-flex flex-wrap flex-lg-nowrap gap-4">
          {/* Freelancer profile */}
          <BlurredImage
            src={data?.user_image || '/images/default_avatar.png'}
            height="5.75rem"
            width="5.75rem"
            allowToUnblur={!!user && hasClientAddedPaymentDetails(user)}
          />

          {/* Freelancer name and designation */}
          <div className="hide-overflow">
            <div>
              <div
                className={cns('talent__details__title fs-24 fw-400 text-capitalize', {
                  blur: !user || !hasClientAddedPaymentDetails(user) || isFreelancerLookingAtOtherFreelancers,
                })}
              >
                <span>
                  {!user || !hasClientAddedPaymentDetails(user) || isFreelancerLookingAtOtherFreelancers
                    ? 'John Doe'
                    : `${data.first_name} ${data.last_name}`}
                </span>
                {Number(data?.is_agency) === 1 && (
                  <StatusBadge color="blue" className="ms-2">
                    Agency
                  </StatusBadge>
                )}
              </div>
              {data.job_title !== null && (
                <div className="talent__details__post fs-18 fw-400 capital-first-ltr line-break">{data.job_title}</div>
              )}
            </div>
            <OtherDetails data={data} />
            {data.about_me && (
              <StyledHtmlText
                htmlString={data.about_me}
                id={`talent_${data?.user_id}`}
                className="mt-3 talent__details__description fs-18 fw-300"
                needToBeShorten={true}
              />
            )}
            <div className="skills-details d-flex align-items-center flex-wrap justify-content-between">
              {/* Skills */}
              <div className="skills d-flex align-items-center flex-wrap">
                {data?.skills?.map((skill: any) => {
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
        <div className="d-flex flex-lg-column justify-content-between gap-3 align-items-center">
          {bookmarkUI()}
          {InviteButtonUI()}
        </div>
      </TalentComponentWrapper>
      {showJobsModal && (
        <SelectJobModal
          show={showJobsModal}
          toggle={toggleJobsModal}
          onNext={onSelectJobAndContinue}
          freelancerName={data?.first_name + ' ' + data?.last_name}
          freelancerId={data?.user_id}
        />
      )}
      <InviteFreelancerMessageModal
        show={showInviteMessageModal}
        toggle={toggleInviteMessageModal}
        freelancerName={data?.first_name + ' ' + data?.last_name}
        onInvite={onInvite}
        loading={sendingInvite}
      />

      {/* Proposal Exists Modal */}
      <ProposalExistsModal
        job_post_id={selectedJobId}
        show={proposalExistModal}
        toggle={() => {
          setSelectedJobId('');
          setProposalExistModal((prev) => !prev);
        }}
      />
    </>
  );
};

export default TalentCard;

const OtherDetails = ({ data }: any) => {
  return (
    <div className="talent__other-details d-flex align-items-center flex-wrap">
      <div className="d-flex budget width-fit-content align-items-center">
        <DollarCircleIcon />
        <div className="fs-1rem fw-400 d-flex mx-1">
          {data.hourly_rate || data.hourly_rate === 0 ? (
            <>
              {numberWithCommas(data.hourly_rate, 'USD')}
              <span className="budget-label fs-1rem ms-1 fw-300">/Hour</span>
            </>
          ) : (
            <div className="budget-label fs-1rem ms-1 fw-300">n/a</div>
          )}
        </div>
      </div>

      {(data?.location?.state || data?.location?.country_name) && (
        <div className="d-flex budget align-items-center">
          <LocationIcon />
          <div className="d-flex fs-1rem fw-400 mx-1">
            {separateValuesWithComma([data?.location?.state, data?.location?.country_name])}
          </div>
        </div>
      )}

      <Link to={`/freelancer/${data?.user_id}/#profile-ratings`} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex budget align-items-center">
          {!data?.avg_rate ? <BsStar color="#f2b420" /> : <StarIcon />}
          <div className="badget-text d-flex align-items-center fs-1rem fw-400">
            {!data?.avg_rate ? 0 : parseFloat(data?.avg_rate).toFixed(1) || 0}
            <div className="badget-text budget-label fs-sm fw-300">Ratings ({Math.floor(data?.rating) || 0})</div>
          </div>
        </div>
      </Link>

      {/* START ----------------------------------------- Total Jobs Done */}
      <div className="d-flex budget align-items-center">
        <JobsDoneIcon />
        <div className="badget-text d-flex align-items-center fs-1rem fw-400">
          {numberWithCommas(data?.completedJobCount) || 0}&nbsp;
          <span>Projects done</span>
        </div>
      </div>
      {/* END ------------------------------------------- Total Jobs Done */}
    </div>
  );
};
