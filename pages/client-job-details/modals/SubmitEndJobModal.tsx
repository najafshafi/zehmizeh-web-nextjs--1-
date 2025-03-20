import { Modal } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import { StyledButton } from "components/forms/Buttons";

type Props = {
  show: boolean;
  onConfirm: () => void;
  loading: boolean;
};

const SubmitEndJobModal = ({ show, onConfirm, loading }: Props) => {
  return (
    <StyledModal maxwidth={540} show={show} size="sm" centered>
      <Modal.Body>
        <div className="fs-24 font-normal text-center mb-3">
          The freelancer has accepted your request to end the project
        </div>
        <div className="flex flex-row justify-center gap-md-3 gap-2 mt-md-4 mt-3">
          <StyledButton
            className="fs-16 font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onConfirm}
            disabled={loading}
          >
            Close Project
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default SubmitEndJobModal;
