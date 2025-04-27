import ReviewContent from "./ReviewContent";
import AddReviewForm from "./AddReviewForm";
import { separateValuesWithComma } from "@/helpers/utils/misc";
import BlurredImage from "@/components/ui/BlurredImage";

type Porps = {
  feedbackData: any;
  freelancerDetails: any;
  jobPostId: string;
  clientUserId: string;
  freelancerUserId: string;
  onSubmitFeedback: any;
};

const Feedback = ({
  feedbackData,
  freelancerDetails,
  jobPostId,
  clientUserId,
  freelancerUserId,
  onSubmitFeedback,
}: Porps) => {
  return (
    <div className="flex flex-col">
      {feedbackData && !feedbackData?.client && (
        <AddReviewForm
          jobPostId={jobPostId}
          clientUserId={clientUserId}
          freelancerUserId={freelancerUserId}
          onSubmitFeedback={onSubmitFeedback}
          freelancerName={
            freelancerDetails?.first_name + " " + freelancerDetails?.last_name
          }
        />
      )}
      <div className="">
        {feedbackData && feedbackData?.freelancer && (
          <div className="mt-10">
            <div className="fs-20 fw-700">Received</div>
            <div className="bg-white p-[1.875rem] rounded-[1rem]  gap-[1.875rem] mt-[1.125rem] flex flex-wrap items-start">
              <div className="flex gap-5  items-center">
                <BlurredImage
                  src={
                    freelancerDetails?.user_image ||
                    "/images/default_avatar.png"
                  }
                  height="5.25rem"
                  width="5.25rem"
                />
                <div>
                  <div className="fs-18 font-normal capitalize">
                    {freelancerDetails?.first_name}{" "}
                    {freelancerDetails?.last_name}
                  </div>
                  <div className="mt-[6px] fs-18 font-normal opacity-60">
                    {separateValuesWithComma([
                      freelancerDetails?.location?.state,
                      freelancerDetails?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
              <div className="my-0 mx-[0.625rem] h-[8.5rem] w-px bg-black hidden lg:block" />
              <div className="flex-1">
                <ReviewContent review={feedbackData?.freelancer} />
              </div>
            </div>
          </div>
        )}
        {feedbackData && feedbackData?.client && (
          <div className="mt-12">
            <div className="fs-20 fw-700">Given</div>
            <div className="review-content bg-white p-[1.875rem] rounded-[1rem] gap-[1.875rem] mt-[1.125rem]">
              <ReviewContent review={feedbackData?.client} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
