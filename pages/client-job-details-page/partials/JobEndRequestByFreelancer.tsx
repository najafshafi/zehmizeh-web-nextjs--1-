import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import { cancelClosureRequest } from "@/helpers/http/jobs";

type Props = {
  show: boolean;
  toggle: () => void;
  error?: string;
  jobPostId: string;
  refetch: () => void;
  onConfirmEndJob: (completionStatus: string) => void;
};

const JobEndRequestByFreelancer = ({
  show,
  toggle,
  jobPostId,
  refetch,
  onConfirmEndJob,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onCancelClosureRequest = () => {
    setLoading(true);
    const promise = cancelClosureRequest(jobPostId);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        toggle();
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onConfirm = (status: string) => () => {
    onConfirmEndJob(status);
  };

  return (
    <StyledModal maxwidth={540} show={show} size="lg" centered>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center">
          <div className="fs-20 font-normal text-center mb-2">
            The freelancer is requesting that you end this project. What would
            you like to do?
          </div>
          <ul>
            <li className="mt-2 fs-18 font-normal text-left">
              If the project is finished, you can mark the project as complete
              and close the project.
            </li>
            <li className="mt-2 fs-18 font-normal text-left">
              If the project is not finished but you still want to accept the
              freelancer’s request, you can mark the project as incomplete and
              close the project.
            </li>
            <li className="mt-2 fs-18 font-normal text-left">
              If you do not want to close the project, you can decline the
              request and discuss next steps with your freelancer.
            </li>
          </ul>
          <StyledButton
            className="fs-16 font-normal mt-4 w-100"
            variant="outline-dark"
            padding="1.125rem 2.25rem"
            onClick={onConfirm("closed")}
          >
            Close project and mark “Complete”
          </StyledButton>
          <StyledButton
            className="fs-16 font-normal mt-3 w-100"
            variant="outline-dark"
            padding="1.125rem 2.25rem"
            onClick={onConfirm("in-complete")}
            disabled={loading}
          >
            Close project and mark “Incomplete”
          </StyledButton>
          <StyledButton
            className="fs-16 font-normal mt-3 w-100"
            variant="outline-dark"
            padding="1.125rem 2.25rem"
            onClick={onCancelClosureRequest}
            disabled={loading}
          >
            Decline closure request and discuss
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default JobEndRequestByFreelancer;
