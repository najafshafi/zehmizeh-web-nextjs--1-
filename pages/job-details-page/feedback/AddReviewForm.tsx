/*
 * This is the add review form
 */

import { useState } from 'react';
import { Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { StyledButton } from '@/components/forms/Buttons';
import AnimatedStar from '@/components/ui/AnimatedStar';
import { manageFeedback } from '@/helpers/http/jobs';

const AddReviewForm = ({
  jobPostId,
  clientUserId,
  freelancerUserId,
  onSubmitFeedback,
  clientName,
}: {
  jobPostId: string;
  clientUserId: string;
  freelancerUserId: string;
  onSubmitFeedback: () => void;
  clientName: string;
}) => {
  const [ratings, setRatings] = useState<number>(0); //feedbackData?.client?.rate
  const [reviewMsg, setReviewMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const addFeedback = () => {
    if (ratings == 0) {
      toast.error('Please provide ratings.');
      return;
    }
    if (reviewMsg == '') {
      toast.error('Please provide your feedback.');
      return;
    }

    setLoading(true);
    const data = {
      action: 'add_feedback',
      job_post_id: jobPostId,
      client_user_id: clientUserId,
      freelancer_user_id: freelancerUserId,
      submitted_by: 'freelancer',
      rate: ratings,
      description: reviewMsg,
    };
    const promise = manageFeedback(data);
    toast.promise(promise, {
      loading: 'Loading...',
      success: (res) => {
        onSubmitFeedback();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || 'error';
      },
    });
  };

  return (
    <div className="content d-flex flex-column">
      <div className="fs-24 fw-400">Freelancer's Review</div>
      <div className="ratings d-flex flex-column">
        <div className="ratings__label fs-16 fw-400">
          RATE YOUR EXPERIENCE WITH {clientName}
        </div>
        <div className="d-flex align-items-center">
          <div className="ratings__range-label fs-18 fw-400">Worst</div>
          <div className="ratings__stars d-flex align-items-center mx-3">
            {Array(5)
              .fill(1)
              .map((item: any, index) => (
                <div key={`star_${index}`} className="pointer">
                  <AnimatedStar
                    isFilled={index < ratings}
                    onChange={() => setRatings(index + 1)}
                  />
                </div>
              ))}
          </div>
          <div className="ratings__range-label fs-18 fw-400">Best</div>
        </div>
      </div>
      <Form.Control
        as="textarea"
        rows={4}
        name="description"
        placeholder="Describe your experience with the client here..."
        value={reviewMsg}
        onChange={(e) => setReviewMsg(e.target.value)}
        className="feedback-message"
        maxLength={500}
      />
      <div className="text-end">
        <StyledButton
          padding="0.75rem 2rem"
          variant="outline"
          className="button"
          disabled={loading}
          onClick={addFeedback}
        >
          Submit Review
        </StyledButton>
      </div>
    </div>
  );
};

export default AddReviewForm;
