import { Modal } from "react-bootstrap";
import { StyledButton } from "@/components/forms/Buttons";

type Props = {
  show: boolean;
  onConfirm: () => void;
  loading: boolean;
};

const SubmitEndJobModal = ({ show, onConfirm, loading }: Props) => {
  return (
    <Modal
      show={show}
      size="sm"
      centered
      className="max-w-[540px] mx-auto"
    >
      <Modal.Body className="p-6">
        <div className="text-2xl font-normal text-center mb-3">
          The freelancer has accepted your request to end the project
        </div>
        <div className="flex flex-row justify-center gap-3 mt-4">
          <StyledButton
            className="text-base font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onConfirm}
            disabled={loading}
          >
            Close Project
          </StyledButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SubmitEndJobModal;
