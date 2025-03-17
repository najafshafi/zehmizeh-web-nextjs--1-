/*
 * This component will display the reviews given and received and add reviews form
-- Freelancer side
 */

import ReviewContent from '@/components/ReviewContent';
import AddReviewForm from './AddReviewForm';
import { FeedbackWrapper } from './feedback.styled';
import { separateValuesWithComma } from '@/helpers/utils/misc';
import BlurredImage from '@/components/ui/BlurredImage';

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
    <FeedbackWrapper className="d-flex flex-column">
      {isClientFeedback && !feedbackData?.freelancer && (
        <div className="review-heading-note text-center fs-20 fw-400">
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
            clientDetails?.first_name + ' ' + clientDetails?.last_name
          }
        />
      )}
      {feedbackData && feedbackData?.client && feedbackData?.freelancer && (
        <div className="">
          <div className="client-feedback">
            <div className="fs-20 fw-700">Received</div>
            <div className="review-content d-flex flex-wrap align-items-start">
              <div className="client-details d-flex align-items-center">
                <BlurredImage
                  src={
                    clientDetails?.user_image || '/images/default_avatar.png'
                  }
                  height="5.25rem"
                  width="5.25rem"
                />
                <div>
                  <div className="fs-18 fw-400 text-capitalize">
                    {clientDetails?.first_name} {clientDetails?.last_name}
                  </div>
                  <div className="client-location fs-18 fw-400 light-text">
                    {separateValuesWithComma([
                      clientDetails?.location?.state,
                      clientDetails?.location?.country_name,
                    ])}
                  </div>
                </div>
              </div>
              <div className="divider d-none d-lg-block" />
              <div className="flex-1">
                <ReviewContent review={feedbackData?.client} />
              </div>
            </div>
          </div>
          <div className="freelancer-feedback">
            <div className="fs-20 fw-700">Given</div>
            <div className="review-content">
              <ReviewContent review={feedbackData?.freelancer} />
            </div>
          </div>
        </div>
      )}
    </FeedbackWrapper>
  );
};

export default Feedback;
