import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import { StyledButton } from "components/forms/Buttons";
import { FormWrapper } from "./milestones/milestones.styled";
import { manageMilestone } from "helpers/http/jobs";
import { manageHours } from "helpers/http/jobs";

type Props = {
  show: boolean;
  toggle: () => void;
  onSubmit: () => void;
  milestoneId: any;
  type: string;
};

const DeclineReasonPrompt = ({
  show,
  toggle,
  onSubmit,
  milestoneId,
  type,
}: Props) => {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (show && type === "milestone") {
      setShowWarning(true);
    }
  }, [type, show]);

  const submitDeclineReason = (e: any) => {
    e.preventDefault();

    const body: any = {
      decline_reason: "Declined",
      status: "decline",
    };
    if (type === "milestone") {
      body.action = "edit_milestone";
      body.milestone_id = milestoneId;
    } else {
      body.action = "edit_hours";
      body.hourly_id = milestoneId;
    }

    setLoading(true);
    // let promise;

    let promise = null;
    if (type === "hourly") {
      promise = manageHours(body);
    } else {
      promise = manageMilestone(body);
    }
    if (promise) {
      toast.promise(promise, {
        loading: "Loading...",
        success: (res: any) => {
          setLoading(false);
          toggle();
          onSubmit();
          return res.response;
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || "error";
        },
      });
    }
  };

  const closeModal = () => {
    setLoading(false);
    toggle();
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  return (
    <StyledModal
      maxwidth={570}
      show={show}
      size="sm"
      onHide={closeModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={closeModal}>
          &times;
        </Button>
        {showWarning && (
          <div>
            <div className="fs-24 font-normal text-center mb-3">
              Are you sure you want to terminate this milestone?
            </div>
            <div className="fs-20 font-normal text-center mb-3">
              When you terminate, the milestone is closed permanently and the
              money you deposited previously is returned to you.
            </div>
            <div className="fs-20 font-normal text-center">
              If you are simply not ready to deliver payment because you have
              feedback about the work your freelancer delivered - or because
              your freelancer has not yet delivered the work - close this window
              and communicate with them in the “Messages” tab.
            </div>
            <div className="d-flex align-itms-center justify-content-center gap-3 flex-wrap mt-4">
              <StyledButton variant="outline-dark" onClick={closeWarning}>
                Terminate Milestone
              </StyledButton>
              <StyledButton onClick={toggle}>I’ll Send Feedback</StyledButton>
            </div>
          </div>
        )}

        {!showWarning && (
          <>
            <div className="fs-20 font-normal text-center">
              Are you sure you would like to decline this Final Hours
              Submission? This will return the project to a "Project in
              Progress" status and the freelancer will be able to continue to
              submit hours.
            </div>
            <FormWrapper>
              <Form onSubmit={submitDeclineReason}>
                <div className="d-flex g-2 flex-wrap mt-4 justify-content-center">
                  <StyledButton
                    className="fs-16 font-normal"
                    variant="primary"
                    padding="0.8125rem 2rem"
                    type="submit"
                    disabled={loading}
                  >
                    Reopen the Project
                  </StyledButton>
                  <StyledButton
                    className="fs-16 font-normal"
                    variant="outline-dark"
                    padding="0.8125rem 2rem"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </StyledButton>
                </div>
              </Form>
            </FormWrapper>
          </>
        )}
      </Modal.Body>
    </StyledModal>
  );
};

export default DeclineReasonPrompt;
