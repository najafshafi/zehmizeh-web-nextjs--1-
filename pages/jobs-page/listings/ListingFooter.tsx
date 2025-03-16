/*
 * This component displays the budget details, locaiton details, and hired person's details*
 */

import BlurredImage from '@/components/ui/BlurredImage';
import { numberWithCommas } from '@/helpers/utils/misc';
import DollarCircleIcon  from '@/public/icons/dollar-circle.svg';
import LocationIcon  from '@/public/icons/location-blue.svg';
import moment from 'moment';

const ListingFooter = ({ item }: any) => {
  const amount = item?.proposal?.proposed_budget?.amount
    ? item?.proposal?.proposed_budget?.amount
    : item.budget.type === 'fixed'
    ? item.budget?.amount
    : item?.budget?.max_amount;

  return item?.status !== 'active' && item?.status !== 'closed' ? (
    /* If Job type is PROPSPECTS (applied job) */

    <div className="listing__item-other-details d-flex align-items-center flex-wrap">
      <div className="d-flex budget align-items-center gap-2">
        <DollarCircleIcon />
        <div className="budget-value fs-1rem fw-400">
          {numberWithCommas(amount, 'USD')}
          {item?.budget?.type === 'fixed' ? (
            <span className="light-text fw-300 ms-1">Budget</span>
          ) : (
            <span className="light-text fw-300">/hr</span>
          )}
        </div>
      </div>
      {Array.isArray(item?.preferred_location) && item?.preferred_location?.length > 0 && (
        <div className="budget d-flex align-items-center gap-1">
          <LocationIcon />
          <div className="fs-1rem fw-400 budget-label">{item.preferred_location.join(', ')}</div>
        </div>
      )}
      <div className="d-flex align-items-center gap-2">
        <span className="light-text fs-20 fw-400">Due Date:</span>
        <span className="budget-amount fs-20 fw-400">
          {item?.due_date ? moment(item?.due_date).format('MMM DD, YYYY') : '-'}
        </span>
      </div>
    </div>
  ) : (
    /* If Job type is CLOSED or ACTIVE */

    <div className="in-progress-closed d-flex flex-column flex-lg-row align-items-lg-center gap-3">
      {/* Hired person details */}
      <div className="client-details d-flex align-items-center gap-2">
        <BlurredImage
          height="52px"
          width="52px"
          allowToUnblur={false}
          src={item?.user_image || '/images/default_avatar.png'}
          type="small"
        />

        <div>
          <span className="light-text fs-16 fw-400">Posted by:</span>
          <div className="fs-20 fw-400 text-capitalize">
            {item?.first_name} {item?.last_name}
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="divider d-none d-lg-block" />
      {/* -- */}
      <div className="d-flex budget width-fit-content gap-1 align-items-center">
        <DollarCircleIcon />
        <div className="budget-value fs-1rem fw-400">
          {numberWithCommas(item?.proposal?.approved_budget?.amount, 'USD')}
          {item?.budget?.type === 'fixed' ? (
            <span className="light-text fw-300 ms-1">Budget</span>
          ) : (
            <span className="light-text fw-300">/hr</span>
          )}
        </div>
      </div>
      {/* Divider */}
      <div className="divider d-none d-lg-block" />

      <div className="d-flex align-items-center gap-2">
        <span className="light-text fs-20 fw-400">Started:</span>
        <span className="budget-amount fs-20 fw-400">
          {item?.job_start_date ? moment(item.job_start_date).format('MMM DD, YYYY') : '-'}
        </span>
      </div>

      {item?.status === 'closed' && (
        <>
          {/* Divider */}
          <div className="divider d-none d-lg-block" />
          <div className="d-flex align-items-center gap-2">
            <span className="light-text fs-20 fw-400">Ended:</span>
            <span className="budget-amount fs-20 fw-400">
              {item?.job_end_date ? moment(item.job_end_date).format('MMM DD, YYYY') : '-'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ListingFooter;
