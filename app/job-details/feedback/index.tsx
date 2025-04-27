/*
 * This component will display the reviews given and received and add reviews form
-- Freelancer side
 */

import ReviewContent from "@/components/ReviewContent";
import AddReviewForm from "./AddReviewForm";
import { separateValuesWithComma } from "@/helpers/utils/misc";
import BlurredImage from "@/components/ui/BlurredImage";

const Feedback = ({
  feedbackData,
  clientDetails,
  jobPostId,
  clientUserId,
  freelancerUserId,
  onSubmitFeedback,
  isClientFeedback,
}: any) => {
  return (
    <div className="flex flex-col">
      {isClientFeedback && !feedbackData?.freelancer && (
        <div className="max-w-[574px] mx-auto mt-16 leading-[160%] text-center fs-20 font-normal">
          Your client has ended the project and shared a review. To read it,
          submit your review below.
        </div>
      )}
      {feedbackData && !feedbackData?.freelancer && (
        <AddReviewForm
          jobPostId={jobPostId}
          clientUserId={clientUserId}
          freelancerUserId={freelancerUserId}
          onSubmitFeedback={onSubmitFeedback}
          clientName={
            clientDetails?.first_name + " " + clientDetails?.last_name
          }
        />
      )}
      {feedbackData && feedbackData?.client && feedbackData?.freelancer && (
        <div>
          <div className="mt-10">
            <div className="text-xl font-bold">Received</div>
            <div className="bg-white p-[1.875rem] rounded-[1rem] gap-[1.875rem] mt-[1.125rem] flex flex-wrap items-start">
              <div className="flex gap-5 items-center">
                <BlurredImage
                  src={
                    clientDetails?.user_image || "/images/default_avatar.png"
                  }
                  height="5.25rem"
                  width="5.25rem"
                />
                <div>
                  <div className="text-base font-normal capitalize">
                    {clientDetails?.first_name} {clientDetails?.last_name}
                  </div>
                  <div className="mt-[6px] text-base font-normal text-gray-500">
                    {separateValuesWithComma([
                      clientDetails?.location?.state,
                      clientDetails?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
              <div className="my-0 mx-[0.625rem] h-[8.5rem] w-px bg-black hidden lg:block" />
              <div className="flex-1">
                <ReviewContent review={feedbackData?.client} />
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-xl font-bold">Given</div>
            <div className="bg-white p-[1.875rem] rounded-[1rem] gap-[1.875rem] mt-[1.125rem] flex flex-col">
              <ReviewContent review={feedbackData?.freelancer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
