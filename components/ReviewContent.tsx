/*
 * This component displays review card
 */

import moment from 'moment';
import  FilledStarIconSmall  from '../public/icons/starYellow.svg';

const ReviewContent = ({ review }: any) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="given-ratings d-flex">
          <div className="stars d-flex align-items-center gap-1">
            {Array(review?.rate)
              .fill(1)
              ?.map((item: any, i: number) => (
                <FilledStarIconSmall key={`star_${i}`} />
              ))}
          </div>
          <div className="given-rating-count fs-18 fw-400">
            {review?.rate.toFixed(1)}
          </div>
        </div>
        <div className="ratings-given-on fs-18 fw-300 light-text">
          {moment(review?.date_created).format('MMM DD, YYYY')}
        </div>
      </div>
      <div className="review-description fs-20 fw-400">
        &quot;{review?.description}&quote;
      </div>
    </>
  );
};

export default ReviewContent;
