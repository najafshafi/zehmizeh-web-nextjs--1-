// components/Ratings.tsx
import ReviewContent from '@/components/ReviewContent';
import BlurredImage from '@/components/ui/BlurredImage';
import { IClientDetails } from '@/helpers/types/client.type';
import { separateValuesWithComma } from '@/helpers/utils/misc';

type Props = {
  reviews: IClientDetails['review'];
};

export const Ratings = ({ reviews }: Props) => {
  return (
    <div>
      {reviews && reviews?.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.feedback_id}
            className="flex flex-wrap items-start bg-white p-7 rounded-xl gap-7 mt-4 shadow-[0_4px_31px_rgba(0,0,0,0.04)]"
          >
            <div>
              <span className="text-lg">{review.job_title}</span>
              <div className="flex items-center mt-3 gap-5">
                <BlurredImage
                  src={review?.user_image || '/images/default_avatar.png'}
                  height="5.25rem"
                  width="5.25rem"
                  className="w-[5.25rem] h-[5.25rem]"
                />
                <div>
                  <div className="text-lg font-normal capitalize">
                    {review?.first_name} {review?.last_name}
                  </div>
                  <div className="text-lg font-normal text-gray-500">
                    {separateValuesWithComma([
                      review?.location?.state,
                      review?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block my-0 mx-2.5 h-[8.5rem] w-px bg-black" />
            <div className="flex-1">
              <ReviewContent review={review} />
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center mt-4">
          <span className="text-lg font-bold">
            It appears there are no ratings for you at this time.
          </span>
        </div>
      )}
    </div>
  );
};

export default Ratings;