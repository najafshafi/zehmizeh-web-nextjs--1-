/*
 * This component displays the right side of the Job card: Job Status badge / Save icon and Date *
 */

import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';
import { Bookmark } from './listings.styled';
import { StatusBadge } from 'components/styled/Badges';
import { ReactComponent as BookmarkIcon } from 'assets/icons/saved.svg';
import { JOBS_STATUS } from '../consts';
import { StyledButton } from 'components/forms/Buttons';
import toast from 'react-hot-toast';
import { reopenProposal } from 'helpers/http/proposals';

const Wrapper = styled.div``;

type Props = {
  item: any;
  listingType: string;
  onBookmarkClick: any;
  setDisableLink?: Dispatch<SetStateAction<boolean>> /* To disable the link on the list item */;
  refetch: () => void;
};
const StatusAndDateSection = ({ item, listingType, onBookmarkClick, setDisableLink, refetch }: Props) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onBookmark = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSaving(true);
    onBookmarkClick();
  };

  const handleReOpenProposal = (proposal) => {
    if (!proposal || !proposal?.proposal_id) return toast.error('Invalid request.');

    const response = reopenProposal({ proposal_id: proposal?.proposal_id });
    setLoading(true);

    toast.promise(response, {
      loading: 'Re-opening proposal...',
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
    if (item?.proposal?.is_proposal_deleted === 1) return 'Deleted by Freelancer';
    if (item?.proposal?.status === 'denied') return 'Declined';
    if (item?.status === 'active' && item?.proposal?.status === 'awarded') return 'Awarded to Another Freelancer';
    if (item?.status === 'active') return 'Work In Progress';
    if (item?.status === 'closed') return 'Closed';
    if (item?.status === 'deleted') return 'Canceled by Client';
    if (item?.status === 'prospects') {
      if (item?.proposal?.status === 'pending') return 'Pending';
      else return 'Declined';
    }
    return '';
  }, [item?.proposal?.status, item.status]);

  const handleProposalStatus = (item) => {
    if (item?.proposal?.is_job_deleted === 1 || item?.proposal?.is_proposal_deleted === 1) return 'darkPink';
    if (['denied', 'awarded'].includes(item?.proposal?.status)) return JOBS_STATUS[item?.proposal?.status].color;

    return JOBS_STATUS[item?.status].color || 'green';
  };

  return (
    <Wrapper className="d-flex flex-column justify-content-between flex-2 gap-3 align-items-md-end">
      {/* Status badge or Bookmark icon */}
      {listingType == 'saved' && (
        <Bookmark className="d-flex justify-content-center align-items-center pointer" onClick={onBookmark}>
          {saving ? <Spinner animation="border" /> : <BookmarkIcon />}
        </Bookmark>
      )}

      <div>
        {item?.proposal?.proposed_budget?.amount && listingType !== 'saved' && (
          <StatusBadge color={handleProposalStatus(item)} className="width-fit-content">
            {status}
          </StatusBadge>
        )}
        {/* START ----------------------------------------- Showing read and unread status when project is prospect and proposal status is pending */}
        {item?.status === 'prospects' && item?.proposal?.status === 'pending' && (
          <StatusBadge color={item?.proposal?.is_viewed ? 'green' : 'red'} className="ms-3">
            {item?.proposal?.is_viewed ? 'Read' : 'Unread'}
          </StatusBadge>
        )}
        {/* END ------------------------------------------- Showing read and unread status when project is prospect and proposal status is pending */}
      </div>

      {item?.proposal && item?.proposal?.is_proposal_deleted === 1 && (
        <div onMouseEnter={() => setDisableLink(true)} onMouseLeave={() => setDisableLink(false)}>
          <StyledButton
            disabled={loading}
            variant="outline-dark"
            type="submit"
            className="d-flex align-items-center gap-3"
            onClick={() => handleReOpenProposal(item?.proposal)}
          >
            {loading && <Spinner size="sm" animation="border" />} Re-open
          </StyledButton>
        </div>
      )}

      {/* Date applied on or Started to end date */}

      {listingType !== 'saved' && (
        <div className="listing__applied-date fs-1rem fw-400 light-text">
          {['active', 'closed'].includes(item?.status) &&
            `Proposal Sent: ${moment(item?.proposal?.date_created).format('MMM DD, YYYY')}`}

          {/* {item?.status == 'closed' &&
            moment(item?.job_start_date)?.format('MMM DD, YYYY') +
              ' - ' +
              moment(item?.job_end_date).format('MMM DD, YYYY')} */}

          {item?.proposal?.status == 'pending' &&
            'Applied on ' + moment(item?.proposal?.date_created)?.format('MMM DD, YYYY')}
        </div>
      )}
      {listingType == 'saved' && (
        <div className="listing__applied-date fs-1rem fw-400 light-text">
          {moment(item?.date_created)?.format('MMM DD, YYYY')}
        </div>
      )}
    </Wrapper>
  );
};

export default StatusAndDateSection;
