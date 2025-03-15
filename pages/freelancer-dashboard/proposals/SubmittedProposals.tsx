/*
 * This component serves a list of submitted proposals
 */
import moment from 'moment';
import  Link  from 'next/link';
import { ProposalWrapper, TabContent } from './proposals.styled';
import Loader from '@/components/Loader';
import NoDataFound from '@/components/ui/NoDataFound';
import { StatusBadge } from '@/components/styled/Badges';
import useProposals from './use-proposals';
import { numberWithCommas, changeStatusDisplayFormat, convertToTitleCase } from '@/helpers/utils/misc';
import DollarCircleIcon from '@/public/icons/dollar-circle.svg';
import LocationIcon from '@/public/icons/location-blue.svg';

const SubmittedProposals = () => {
  const { proposals, isLoading, isRefetching } = useProposals('submitted');
  return (
    <TabContent>
      {isLoading || isRefetching ? (
        <Loader />
      ) : proposals?.length > 0 ? (
        proposals.map((item: any) => (
          <Link
            href={`/job-details/${item.job_post_id}/proposal_sent`}
            key={item.proposal_id}
            className="no-hover-effect"
          >
            <ProposalWrapper className="mt-3 d-flex flex-column pointer">
              {/* Name and title */}

              <div className="d-flex align-items-center justify-content-between flex-wrap g-2">
                <div className="job-title fs-18 fw-400">{convertToTitleCase(item.job_title)}</div>
                <div>
                  <StatusBadge color={item?.status === 'denied' ? 'darkPink' : 'yellow'}>
                    {item?.status === 'denied' ? 'Declined' : changeStatusDisplayFormat(item?.status)}
                  </StatusBadge>
                  {item?.status === 'pending' && (
                    <StatusBadge color={item?.is_viewed ? 'green' : 'red'} className="ms-2">
                      {item?.is_viewed ? 'Read' : 'Unread'}
                    </StatusBadge>
                  )}
                </div>
              </div>

              <div className="location-and-budget d-flex align-items-center flex-wrap">
                {/* Budget */}

                <div className="proposal__budget d-flex width-fit-content align-items-center flex-wrap">
                  <DollarCircleIcon />
                  <div className="proposal__budget-value fs-1rem fw-400 d-flex">
                    {numberWithCommas(item?.proposed_budget?.amount, 'USD')}
                    {item?.budget?.type === 'fixed' ? (
                      <span className="light-text fw-300 ms-1">Budget</span>
                    ) : (
                      <span className="light-text fw-300">/hr</span>
                    )}
                  </div>
                </div>

                {/* Location */}
                {Array.isArray(item?.preferred_location) && item?.preferred_location?.length > 0 && (
                  <div className="proposal__budget d-flex width-fit-content align-items-center flex-wrap">
                    <LocationIcon />
                    <div className="fs-1rem fw-400 mx-1">{item.preferred_location.join(', ')}</div>
                  </div>
                )}
              </div>

              {/* Applied on */}
              <div className="fs-1rem fw-400 applied-date">
                Submitted {moment(item?.applied_on).format('MMM DD, YYYY')}
              </div>
            </ProposalWrapper>
          </Link>
        ))
      ) : (
        <NoDataFound />
      )}
    </TabContent>
  );
};

export default SubmittedProposals;
