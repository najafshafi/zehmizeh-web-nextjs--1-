import { Modal, Button } from 'react-bootstrap';
import { StyledModal } from 'components/styled/StyledModal';
import { StyledButton } from 'components/forms/Buttons';

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const PendingHourlySubmission = ({
  show,
  toggle,
  onConfirm,
  loading = false,
}: Props) => {
  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>

        <div className="fs-20 fw-400 text-center mb-3">
          Cannot pay final hours until previous hours are Paid.
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-center mt-4 gap-2">
          <StyledButton
            className="fs-16 fw-400"
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

export default PendingHourlySubmission;
