import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import { StyledButton } from "components/forms/Buttons";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const FinalMilestoneModal = ({ show, toggle, onConfirm, loading }: Props) => {
  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>

        <div className="fs-20 font-normal text-center mb-3">
          Your freelancer has posted a Final Hours Submission and would like to
          close the project. Please review the submission and decide if you
          would like to accept or decline the request.
        </div>

        <div className="flex flex-column flex-md-row justify-center mt-4 gap-2">
          <StyledButton
            className="fs-16 font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onConfirm}
            disabled={loading}
          >
            Close
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default FinalMilestoneModal;
