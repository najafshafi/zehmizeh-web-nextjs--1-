/*
 * This is a modal that asks for review when ending the job
 */

import { useState } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import toast from "react-hot-toast";
import { StyledButton } from "components/forms/Buttons";
import AnimatedStar from "./AnimatedStar";
import { endJob } from "helpers/http/jobs";
import ErrorMessage from "components/ui/ErrorMessage";

type Props = {
  onEndJob?: () => void;
  freelancerName: string;
  jobPostId: string;
  endJobState: any;
  onError: (msg: string) => void;
};

const Wrapper = styled.div`
  .content {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  .ratings {
    border: 1px solid #d7d7d7;
    padding: 1.5rem 1.75rem;
    gap: 1.25rem;
    border-radius: 0.5rem;
    .ratings__label {
      opacity: 0.7;
    }
  }
  .ratings__stars {
    gap: 3px;
  }
  .feedback-message {
    padding: 1rem 1.25rem;
    border-radius: 7px;
  }
  .button {
    background: ${(props) => props.theme.colors.yellow};
  }
  .disabled {
    opacity: 0.5; // Adjust opacity to visually indicate disabled state
    pointer-events: none; // Disable pointer events to prevent interaction
  }
`;

const errorInitialState = { ratings: "", feedback: "" };

const Feedback = ({
  onEndJob,
  freelancerName,
  jobPostId,
  endJobState,
  onError,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [ratings, setRatings] = useState<number>(0);
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [error, setError] = useState(errorInitialState);

  const isValid = () => {
    const errors = { ...errorInitialState };
    if (!(endJobState?.selectedStatus == "in-complete")) {
      if (!ratings) {
        errors.ratings = "Please enter ratings";
      }
      if (!reviewMsg) {
        errors.feedback = "Please enter feedback";
      }
    }
    setError(errors);
    if (Object.values(errors).some((x) => x !== "")) return false;
    return true;
  };

  const handleEndJob = () => {
    if (loading || !isValid()) return;
    // End job api call

    setLoading(true);
    const body: any = {
      job_id: jobPostId,
      status:
        endJobState?.selectedStatus == "closed" ? "closed" : "in-complete",
      rate: ratings,
      description: reviewMsg,
    };

    if (endJobState?.selectedStatus == "in-complete") {
      body.reason = endJobState?.endingReason;
      body.incomplete_description = endJobState?.incompleteJobDescription;
    }

    toast.loading("Please wait...");

    endJob(body)
      .then((res) => {
        setLoading(false);
        if (res.status) {
          onEndJob();
          toast.success(res.message);
        } else {
          onError(res.message);
        }
        toast.dismiss();
      })
      .catch((err) => {
        setLoading(false);
        onError(err?.response?.data?.message);
        toast.dismiss();
      });
  };

  return (
    <Wrapper>
      <div className="fs-32 fw-700">Close Project</div>
      <div className="content flex flex-column">
        {endJobState?.selectedStatus == "in-complete" ? (
          <>
            <div className="ratings flex flex-column disabled">
              <div className="ratings__label fs-16 font-normal text-uppercase">
                RATE YOUR EXPERIENCE WITH {freelancerName}
              </div>
              <div className="flex items-center">
                <div className="ratings__range-label fs-18 font-normal">
                  Worst
                </div>
                <div className="ratings__stars flex items-center mx-3">
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
                <div className="ratings__range-label fs-18 font-normal">
                  Best
                </div>
              </div>
            </div>
            <Form.Control
              disabled
              as="textarea"
              rows={4}
              name="description"
              placeholder="Write your feedback here..."
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              className="feedback-message"
              maxLength={500}
            />
          </>
        ) : (
          <>
            <div>
              <div className="ratings flex flex-column">
                <div className="ratings__label fs-16 font-normal text-uppercase">
                  RATE YOUR EXPERIENCE WITH {freelancerName}
                </div>
                <div className="flex items-center">
                  <div className="ratings__range-label fs-18 font-normal">
                    Worst
                  </div>
                  <div className="ratings__stars flex items-center mx-3">
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
                  <div className="ratings__range-label fs-18 font-normal">
                    Best
                  </div>
                </div>
              </div>
              {error?.ratings && <ErrorMessage message={error.ratings} />}
            </div>
            <div>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Write your feedback here..."
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                className="feedback-message"
                maxLength={500}
              />
              {error?.feedback && <ErrorMessage message={error.feedback} />}
            </div>
          </>
        )}
        <div className="bottom-buttons flex">
          <StyledButton
            padding="0.75rem 2rem"
            variant="primary"
            onClick={handleEndJob}
          >
            Submit Feedback & Close Project
          </StyledButton>
        </div>
      </div>
    </Wrapper>
  );
};

export default Feedback;
