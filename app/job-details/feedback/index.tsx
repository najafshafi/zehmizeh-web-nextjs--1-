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
        <div className="m-auto mt-16 text-center text-xl font-normal">
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
        <div className="">
          <div className="mt-10">
            <div className="text-xl font-bold">Received</div>
            <div className="!mt-[1.125rem] flex flex-wrap items-start !gap-[1.875rem] !rounded-[1rem] !bg-white !p-[1.875rem]">
              <div className="flex items-center gap-5">
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
                  <div className="mt-1.5 text-base font-normal text-gray-500">
                    {separateValuesWithComma([
                      clientDetails?.location?.state,
                      clientDetails?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
              <div className="hidden h-[8.5rem] w-[1px] bg-black lg:block" />
              <div className="flex-1">
                <ReviewContent review={feedbackData?.client} />
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-xl font-bold">Given</div>
            <div className="mt-[1.125rem] rounded-[1rem] bg-white p-[1.875rem]">
              <ReviewContent review={feedbackData?.freelancer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
