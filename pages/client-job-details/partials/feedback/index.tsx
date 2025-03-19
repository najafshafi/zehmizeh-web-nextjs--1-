import ReviewContent from "./ReviewContent";
import AddReviewForm from "./AddReviewForm";
import { FeedbackWrapper } from "./feedback.styled";
import { separateValuesWithComma } from "helpers/utils/misc";
import BlurredImage from "components/ui/BlurredImage";

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
    <FeedbackWrapper className="d-flex flex-column">
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
          <div className="client-feedback">
            <div className="fs-20 fw-700">Received</div>
            <div className="review-content d-flex flex-wrap align-items-start">
              <div className="client-details d-flex align-items-center">
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
                  <div className="client-location fs-18 font-normal light-text">
                    {separateValuesWithComma([
                      freelancerDetails?.location?.state,
                      freelancerDetails?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
              <div className="divider d-none d-lg-block" />
              <div className="fill-available">
                <ReviewContent review={feedbackData?.freelancer} />
              </div>
            </div>
          </div>
        )}
        {feedbackData && feedbackData?.client && (
          <div className="freelancer-feedback">
            <div className="fs-20 fw-700">Given</div>
            <div className="review-content">
              <ReviewContent review={feedbackData?.client} />
            </div>
          </div>
        )}
      </div>
    </FeedbackWrapper>
  );
};

export default Feedback;
