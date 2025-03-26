/*
 * This component displays review card
 */

import moment from "moment";
import FilledStarIconSmall from "../public/icons/starYellow.svg";

const ReviewContent = ({ review }: any) => {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap">
        <div className="given-ratings flex">
          <div className="stars flex items-center gap-1">
            {Array(review?.rate)
              .fill(1)
              ?.map((item: any, i: number) => (
                <FilledStarIconSmall key={`star_${i}`} />
              ))}
          </div>
          <div className="given-rating-count text-base font-normal">
            {review?.rate.toFixed(1)}
          </div>
        </div>
        <div className="ratings-given-on text-base font-light">
          {moment(review?.date_created).format("MMM DD, YYYY")}
        </div>
      </div>
      <div className="review-description text-xl font-normal">
        &quot;{review?.description}&quot;
      </div>
    </>
  );
};

export default ReviewContent;
