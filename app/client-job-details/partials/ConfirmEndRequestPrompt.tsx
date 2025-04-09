import { useState } from "react";
import toast from "react-hot-toast";
import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { endJob } from "@/helpers/http/jobs";

type Props = {
  show: boolean;
  toggle: () => void;
  jobPostId: string;
  onEndJob: () => void;
  completionStatus: string;
};

const ConfirmEndRequestPrompt = ({
  show,
  toggle,
  jobPostId,
  onEndJob,
  completionStatus,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleEndJob = () => {
    // End job api call

    setLoading(true);
    const body: any = {
      job_id: jobPostId,
      status: completionStatus,
    };

    const promise = endJob(body);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        onEndJob();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        toggle();
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <StyledModal maxwidth={570} show={show} size="lg" onHide={toggle} centered>
      <Modal.Body className="flex flex-col justify-center items-center">
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <div className="text-center">
          <div className="fs-20 font-normal">
            Are you sure you want to end this job?
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <StyledButton variant="outline-dark" onClick={toggle}>
              Go Back
            </StyledButton>
            <StyledButton
              variant="primary"
              onClick={handleEndJob}
              disabled={loading}
            >
              Confirm
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default ConfirmEndRequestPrompt;
