/*
 * This component displays the Banner (Summary) of the job details *
 */

import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';
import { PengingProposalWrapper, NoPropsalWrapper } from './job-details.styled';
import Tooltip from '@/components/ui/Tooltip';
import { StatusBadge } from '@/components/styled/Badges';
import { StyledButton } from '@/components/forms/Buttons';
import SubmitProposalModal from '@/components/jobs/SubmitProposalModal';
import BlurredImage from '@/components/ui/BlurredImage';
import { useAuth } from '@/helpers/contexts/auth-context';
import { numberWithCommas, changeStatusDisplayFormat, convertToTitleCase } from '@/helpers/utils/misc';
import { toggleBookmarkPost } from '@/helpers/http/search';
import  LocationIcon  from '@/public/icons/location-blue.svg';
import  StarIcon  from '@/public/icons/star-yellow.svg';
import  UnSavedIcon  from '@/public/icons/unsaved.svg';
import  SavedIcon  from '@/public/icons/saved.svg';
import  ShareIcon  from '@/public/icons/share.svg';
import { JOBS_STATUS } from '@/pages/jobs-page/consts';
import { BOOKMARK_TOOLTIPS } from './consts';
import { useNavigate, useParams } from 'react-router-dom';
import ChangeBudgetModal from '../../components/changeBudget/ChangeBudgetModal';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { ChangeBudgetDeleteRequest } from '@/components/changeBudget/ChangeBudgetDeleteRequest';
import { breakpoints } from '@/helpers/hooks/useResponsive';
import MilestoneStats from '@/pages/client-job-details/partials/MilestoneStats';

const InProgressClosedJobWrapper = styled.div`
  box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.colors.white};
  margin: 1.4rem 0rem 0rem 0rem;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.colors.yellow}`};
  .header {
    padding: 2.25rem;
  }
  .banner-title {
    line-height: 2.1rem;
    word-wrap: break-word;
  }
  .job-basic-details {
    gap: 1.25rem;
  }
  .attribute-gray-label {
    opacity: 0.5;
  }
  .line-height-28 {
    line-height: 1.75rem;
  }
  .postedon-location {
    gap: 2rem;
  }
  .posted-by-avatar {
    margin-right: 1rem;
  }
  .budget-and-earnings {
    border-top: ${(props) => `1px solid ${props.theme.colors.yellow}`};
    padding: 2.25rem;
    gap: 2rem;
  }
  .divider {
    width: 1px;
    height: 58px;
    background-color: #000;
  }
  .light-text {
    opacity: 0.5;
  }
  .budget-change-button {
    font-size: 14px;
    border-radius: 4rem;
    padding: 6px 14px;
    cursor: pointer;
    margin-left: 8px;
    background-color: ${(props) => props.theme.colors.yellow};
  }
  .client-name {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    align-items: flex-end;
    width: max-content;
    max-width: 20rem;
    @media ${breakpoints.mobile} {
      width: auto;
    }
  }
`;

export const BookmarkIcon = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
`;

const DetailsBanner = ({ data, refetch }: any) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();

  const [showSubmitProposalModal, setShowSubmitProposalModal] = useState<boolean>(false);
  const [changeBudgetModal, setChangeBudgetModal] = useState(false);
  const [changeBudgetDeleteModal, setChangeBudgetDeleteModal] = useState(false);

  const toggleProposalModal = () => {
    setShowSubmitProposalModal(!showSubmitProposalModal);
  };
  const [isProposalSubmitted, setIsProposalSubmitted] = useState<boolean>(false);

  const onSubmitProposal = () => {
    setIsProposalSubmitted(true);
    toggleProposalModal();
    refetch();
    if (id) navigate(`/job-details/${id}/proposal_sent`);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setISaved] = useState<boolean>(data?.is_bookmarked);

  const onBookmarkClick = () => {
    // This will call bookmark / unbookmark job api
    if (user) {
      setLoading(true);
      toggleBookmarkPost(data.job_post_id).then((res) => {
        if (res.status) {
          setISaved(!isSaved);
        }
        setLoading(false);
      });
    }
  };

  return data?.proposal?.status ? (
    ['pending', 'declined', 'denied'].includes(data?.proposal?.status) ? (
      <PengingProposalWrapper>
        <div className="banner-title fs-24 fw-400">{convertToTitleCase(data.job_title)}</div>
        <div className="job-dates d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div className="posted-date d-flex align-items-center flex-wrap">
            <span className="light-text fs-20 fw-400">Posted:</span>
            <span className="attribute-value line-height-28 fs-20 fw-400">
              {data?.date_created && moment(data.date_created).format('MMM DD, YYYY')}
            </span>
          </div>
          <Divider />
          <div className="d-flex align-items-center gap-2">
            <span className="fs-20 fw-400">Due Date:</span>
            <span className="budget-amount fs-20 fw-400">
              {data?.due_date ? moment(data?.due_date).format('MMM DD, YYYY') : '-'}
            </span>
          </div>

          {Array.isArray(data?.preferred_location) && data?.preferred_location?.length > 0 && (
            <div className="location d-flex align-items-center width-fit-content">
              <LocationIcon /> &nbsp;
              <span className="attribute-gray-label fs-1rem fw-400">{data.preferred_location.join(', ')}</span>
            </div>
          )}
        </div>
        <div className="posted-by d-flex align-items-center mt-3 gap-3">
          <BlurredImage
            src={data.userdata?.user_image || '/images/default_avatar.png'}
            height="2.2625rem"
            width="2.2625rem"
            allowToUnblur={false}
            type="small"
          />
          <div className="d-flex d-flex flex-column flex-md-row align-items-md-center gap-md-3">
            <span className="fs-20 fw-400 line-height-28 text-capitalize">
              {data.userdata?.first_name} {data.userdata?.last_name}
            </span>
            {/* <Divider />
            <span className="attribute-gray-label fs-18 fw-400">Employer</span> */}
          </div>
        </div>
      </PengingProposalWrapper>
    ) : (
      <>
        {data.milestone.length > 0 && (
          <MilestoneStats milestones={data.milestone} isHourly={data.budget?.type === 'hourly'} isFreelancer={true} />
        )}
        <InProgressClosedJobWrapper>
          <div className="header d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
            <div className="job-basic-details d-flex flex-column">
              <div className="banner-title fs-24 fw-400">{convertToTitleCase(data.job_title)}</div>
              <div className="d-flex flex-column flex-lg-row align-lg-items-center gap-3">
                <div className="posted-date d-flex align-items-center flex-wrap">
                  <span className="light-text fs-20 fw-400 me-2">Started:</span>
                  <span className="attribute-value line-height-28 fs-20 fw-400">
                    {data.job_start_date && moment(data.job_start_date).format('MMM DD, YYYY')}
                  </span>
                </div>
                {data.status === 'active' && (
                  <div className="d-flex align-items-center gap-3">
                    <Divider />
                    <div className="d-flex align-items-center gap-2">
                      <span className="light-text fs-20 fw-400">Due Date: </span>
                      <span className="budget-amount fs-20 fw-400">
                        {data?.due_date ? moment(data?.due_date).format('MMM DD, YYYY') : '-'}
                      </span>
                    </div>
                  </div>
                )}
                {data.status === 'closed' && (
                  <div className="d-flex align-items-center gap-3">
                    <Divider />
                    <div className="d-flex align-items-center gap-2">
                      <span className="light-text fs-20 fw-400">Ended: </span>
                      <span className="budget-amount fs-20 fw-400">
                        {data?.job_end_date ? moment(data?.job_end_date).format('MMM DD, YYYY') : '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <StatusBadge className="width-fit-content" color={JOBS_STATUS[data?.status]?.color}>
                {data.status == 'active' ? 'Work In Progress' : changeStatusDisplayFormat(data?.status)}
              </StatusBadge>
            </div>
            <div>
              <BlurredImage
                src={data.userdata?.user_image || '/images/default_avatar.png'}
                height="5.25rem"
                width="5.25rem"
                className="mr-0 d-flex justify-content-center"
              />
              <div className="client-name">
                <div className="fs-20 fw-400 line-height-28 text-capitalize">
                  {data.userdata?.first_name} {data.userdata?.last_name}
                  <span className="attribute-gray-label fs-18 fw-400 ps-2">Client</span>
                </div>
              </div>
            </div>
          </div>
          <div className="budget-and-earnings gap-md-4 gap-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <div className="budget-and-earnings__block gap-2 flex-1">
              <label className="light-text fs-1rem fw-400">Total Budget</label>
              <div className="fs-20 fw-400 mt-1">
                {data?.proposal?.approved_budget?.amount &&
                  `${numberWithCommas(data?.proposal?.approved_budget?.amount, 'USD')}${
                    data?.proposal?.approved_budget?.type == 'hourly' ? '/hr' : ''
                  }`}

                {/* START ----------------------------------------- Increase project budget request */}
                {/* project should be in progress */}
                {/* increase budget request status not pending */}
                {/* amount should have some value */}
                {data?.status == 'active' &&
                  (data?.proposal?.budget_change?.status !== 'pending' ||
                    data?.proposal?.budget_change?.requested_by !== 'freelancer') && (
                    <span
                      className="budget-change-button d-inline-block"
                      onClick={() => {
                        setChangeBudgetModal(true);
                      }}
                    >
                      Change Budget
                    </span>
                  )}
                {/* END ------------------------------------------- Increase project budget request */}
              </div>
            </div>

            {/* START ----------------------------------------- Requested increase budget amount */}
            {/* 
          1. project should be in progress
          2. budget change request status should be pending
          3. amount should be there in budget change
          */}
            {data?.status == 'active' &&
              data?.proposal?.budget_change?.status === 'pending' &&
              data?.proposal?.budget_change?.amount && (
                <div className="budget-and-earnings__block gap-2 flex-1">
                  <label className="light-text fs-1rem fw-400">
                    Requested {data?.proposal?.approved_budget?.type == 'hourly' ? 'rate' : 'budget'}{' '}
                    <FaEdit className="pointer text-dark align-text-top" onClick={() => setChangeBudgetModal(true)} />
                    <MdDelete
                      className="pointer text-dark align-text-top ms-1"
                      onClick={() => setChangeBudgetDeleteModal(true)}
                    />
                  </label>
                  <div className="fs-20 fw-400 mt-1 ms-4">
                    {data?.proposal?.budget_change?.amount &&
                      `${numberWithCommas(data?.proposal?.budget_change?.amount, 'USD')}${
                        data?.proposal?.approved_budget?.type == 'hourly' ? '/hr' : ''
                      }`}
                  </div>
                </div>
              )}
            {/* END ------------------------------------------- Requested increase budget amount */}

            <div className="flex-1">
              <div className="light-text fs-1rem fw-400">
                {data?.budget?.type == 'hourly' ? 'Total Hours Worked' : 'Total in Milestones'}
              </div>
              <div className="mt-1 fs-20 fw-400">
                {data?.budget?.type == 'hourly'
                  ? `${numberWithCommas(data?.total_hours)} Hours`
                  : numberWithCommas(
                      data?.milestone
                        ?.filter((milestone) => milestone.status !== 'cancelled')
                        .reduce((acc, milestone) => acc + milestone.amount, 0),
                      'USD'
                    )}
              </div>
            </div>
            <div className="divider d-none d-md-block" />
            <div className="budget-and-earnings__block flex-1">
              <label className="light-text fs-1rem fw-400">Sent to Freelancer</label>
              <div className="fs-20 fw-400 mt-1">
                {data.total_earnings ? numberWithCommas(data?.total_earnings, 'USD') : '$0'}
              </div>
            </div>
          </div>
          {data?.proposal?.approved_budget && (
            <ChangeBudgetModal
              show={changeBudgetModal}
              toggle={() => setChangeBudgetModal((prev) => !prev)}
              jobDetails={data}
              userType="freelancer"
            />
          )}

          <ChangeBudgetDeleteRequest
            show={changeBudgetDeleteModal}
            setShow={(value) => setChangeBudgetDeleteModal(value)}
            jobPostId={data.job_post_id}
            refetch={refetch}
          />
        </InProgressClosedJobWrapper>
      </>
    )
  ) : (
    <NoPropsalWrapper className="header d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
      <div className="content d-flex flex-column flex-wrap flex-1">
        <div className="d-flex flex-row justify-content-between">
          <span className="banner-title fs-24 fw-400">{convertToTitleCase(data.job_title)}</span>
          <div className="d-flex">
            <Tooltip
              customTrigger={
                <BookmarkIcon
                  className="d-flex justify-content-center align-items-center pointer"
                  onClick={onBookmarkClick}
                >
                  {loading ? (
                    <Spinner animation="border" />
                  ) : isSaved ? (
                    <SavedIcon />
                  ) : (
                    <UnSavedIcon className={user ? '' : 'blurred-2px'} />
                  )}
                </BookmarkIcon>
              }
            >
              {user ? (!isSaved ? BOOKMARK_TOOLTIPS.save : BOOKMARK_TOOLTIPS.unsave) : BOOKMARK_TOOLTIPS.not_logged_in}
            </Tooltip>
            <Tooltip
              customTrigger={
                <BookmarkIcon
                  className="d-flex justify-content-center align-items-center pointer"
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    if (navigator.share) {
                      navigator.share({
                        title: 'Share this job',
                        text: 'Check out this job',
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <ShareIcon />
                </BookmarkIcon>
              }
            >
              Share
            </Tooltip>
          </div>
        </div>
        <div className="posted-by d-flex align-items-center flex-wrap gap-3">
          <div className={`d-flex align-items-center ${!user?.is_account_approved ? 'blurred-9px' : ''}`}>
            <BlurredImage
              src={data.userdata?.user_image || '/images/default_avatar.png'}
              height="2.625rem"
              width="2.625rem"
              className="posted-by-avatar"
              allowToUnblur={false}
            />

            <span className="fs-20 fw-400 line-height-28 text-capitalize">
              {data.userdata?.first_name} {data.userdata?.last_name}
            </span>
          </div>
          {/* 
          <Divider />

          <span className="attribute-gray-label fs-18 fw-400">Employer</span> */}

          <Divider />
          <div className="location-and-ratings d-flex align-items-center flex-wrap gap-3">
            {data.userdata && (
              <div className="location d-flex align-items-center">
                <LocationIcon />
                <div className="attribute-value fs-1rem fw-400 attribute-gray-label">
                  {data.userdata?.location?.country_name}
                </div>
              </div>
            )}
            <div className="location d-flex align-items-center">
              <StarIcon />
              <div className="attribute-value fs-1rem fw-400">{data.avg_rating?.toFixed(1)}</div>
              <div className="attribute-value fs-sm fw-300 attribute-gray-label">
                Ratings ({numberWithCommas(data?.count_rating) || 0})
              </div>
            </div>
          </div>
        </div>
        <div className="job-dates d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="posted-date d-flex align-items-center flex-wrap gap-3">
            <div className="attribute-gray-label line-height-28 fs-20 fw-400">Posted:</div>
            <div className="attribute-value line-height-28 fs-20 fw-400">
              {data?.date_created && moment(data?.date_created).format('MMM DD, YYYY')}
            </div>
            <Divider />
            <div className="d-flex align-items-center gap-2">
              <span className="attribute-gray-label fs-20 fw-400">Due date: </span>
              <span className="budget-amount fs-20 fw-400">
                {data?.due_date ? moment(data?.due_date).format('MMM DD, YYYY') : '-'}
              </span>
            </div>
          </div>
          <div className="d-flex">
            {data?.status === 'prospects' ? (
              !isProposalSubmitted ? (
                <div className="flex-2">
                  {user?.is_account_approved ? (
                    user.stp_account_id && user?.stp_account_status === 'verified' ? (
                      <StyledButton
                        padding="1.125rem 2.25rem"
                        onClick={toggleProposalModal}
                        disabled={!user?.is_account_approved}
                      >
                        Submit Proposal
                      </StyledButton>
                    ) : (
                      /* Stripe Account is not created or verified  */
                      <Tooltip
                        customTrigger={
                          <StyledButton padding="1.125rem 2.25rem" disabled>
                            Submit Proposal
                          </StyledButton>
                        }
                        className="d-inline-block align-middle"
                      >
                        Please {!user.stp_account_id ? `create` : `activate`} your stripe account to submit proposals
                      </Tooltip>
                    )
                  ) : (
                    /* Blurred button */
                    <Tooltip
                      customTrigger={
                        <StyledButton padding="1.125rem 2.25rem" disabled>
                          Submit Proposal
                        </StyledButton>
                      }
                      className="d-inline-block align-middle"
                    >
                      Your account is still under review. You'll be able to apply to projects once it's been approved.
                    </Tooltip>
                  )}
                </div>
              ) : (
                <div>
                  <StatusBadge className="width-fit-content" color={'yellow'}>
                    Pending
                  </StatusBadge>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/*
       * If user account is not approved, then the user will not be able to apply
       * In that case a blurred button with tooltip will be displayed
       */}

      {/* Submit proposal modal */}
      <SubmitProposalModal
        show={showSubmitProposalModal}
        toggle={toggleProposalModal}
        data={data}
        onSubmitProposal={onSubmitProposal}
      />
    </NoPropsalWrapper>
  );
};

export default DetailsBanner;

const Divider = () => {
  return <div className="d-none d-lg-block opacity-50">|</div>;
};
