/*
 * This component displays review card
 */

import moment from "moment";
import FilledStarIconSmall from "../public/icons/starYellow.svg";

const ReviewContent = ({ review }: any) => {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex gap-1">
          <div className="flex items-center gap-1">
            {Array(review?.rate)
              .fill(1)
              ?.map((item: any, i: number) => (
                <FilledStarIconSmall key={`star_${i}`} />
              ))}
          </div>
          <div className="italic text-base font-normal">
            {review?.rate.toFixed(1)}
          </div>
        </div>
        <div className="text-base font-light opacity-60">
          {moment(review?.date_created).format("MMM DD, YYYY")}
        </div>
      </div>
      <div className="italic opacity-80 leading-8 mt-3 text-xl font-normal">
        &quot;{review?.description}&quot;
      </div>
    </>
  );
};

export default ReviewContent;
