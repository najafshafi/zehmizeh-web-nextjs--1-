import { StyledButton } from "@/components/forms/Buttons";
import { StatusBadge } from "@/components/styled/Badges";
import { endJob, jobClosureRequest } from "@/helpers/http/jobs";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

type Props = {
  onEndJob: (onlyToggleModal?: boolean) => void;
  jobPostId: string;
  onError: (message: string) => void;
  jobDetails: any;
};

const Container = styled.div`
  position: relative;
  .page-number {
    position: absolute;
    right: -35px;
    top: -35px;
  }
`;

export const CloseProjectWithoutFeedback = ({
  onEndJob,
  jobPostId,
  onError,
  jobDetails,
}: Props) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const isHourlyBasedProject = jobDetails?.budget?.type === "hourly";

  const handleJobClosureRequest = () => {
    setLoading(true);
    const body: any = {
      job_id: jobPostId,
    };

    toast.loading("Please wait...");
    jobClosureRequest(body)
      .then((res) => {
        setLoading(false);
        if (res.status) {
          onEndJob();
          toast.success(res.response);
        } else {
          onError(res.message);
        }
        toast.dismiss();
      })
      .catch((err: any) => {
        setLoading(false);
        onError(err?.response?.data?.message);
        toast.dismiss();
      });
  };

  const handleEndJob = () => {
    setLoading(true);
    const body: any = {
      job_id: jobPostId,
      status: "in-complete",
      reason: "freelancer hasnt been paid at all",
      incomplete_description: "",
    };
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
    <Container>
      {!isHourlyBasedProject && (
        <StatusBadge className="page-number" color="yellow">
          {step}/2
        </StatusBadge>
      )}
      {step === 1 && (
        <div>
          <div className="fs-28 fw-700 text-center">
            This Project will be marked 'Incomplete'
          </div>
          <div className="my-4">
            <div>
              <span>
                Any project that is closed before the freelancer has been paid
                is automatically marked as 'Incomplete.' Having been part of
                this project therefore does not contribute to the freelancer's
                record on ZMZ.
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <StyledButton
              padding="0.75rem 2rem"
              variant="primary"
              className="button"
              disabled={loading}
              onClick={() => {
                if (isHourlyBasedProject) {
                  handleEndJob();
                } else {
                  setStep(2);
                }
              }}
            >
              {isHourlyBasedProject ? "Close Project" : "Continue"}
            </StyledButton>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="fs-28 fw-700 text-center">
            The Freelancer Has Not Been Paid
          </div>
          <div className="my-4">
            <div>
              <p>
                The freelancer has not been paid for any milestones on this
                project.
              </p>
              <p>
                Therefore, they will have to agree to the project closure before
                the project is closed. They'll receive a notification of this
                closure request.
              </p>
              <p>
                Until the project is closed, you'll still be able to communicate
                with them through the Messages tab.
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3">
            <div>
              <StyledButton
                padding="0.75rem 2rem"
                variant="outline-dark"
                className="button mb-4"
                disabled={loading}
                onClick={() => onEndJob(true)}
              >
                Keep Project Open
              </StyledButton>
            </div>
            <div>
              <StyledButton
                padding="0.75rem 2rem"
                variant="primary"
                className="button"
                disabled={loading}
                onClick={handleJobClosureRequest}
              >
                Accept - Request to Close Project
              </StyledButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};
