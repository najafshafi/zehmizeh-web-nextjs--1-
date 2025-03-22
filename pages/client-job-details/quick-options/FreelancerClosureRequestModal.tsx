import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import { StyledButton } from "components/forms/Buttons";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const FreelancerClosureRequestModal = ({
  show,
  toggle,
  onConfirm,
  loading,
}: Props) => {
  return (
    <StyledModal maxwidth={570} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>

        <div className="fs-20 font-normal text-center mb-3">
          Before ending the project, the freelancer will be given the
          opportunity to submit any remaining unposted hours. If they have no
          more hours to post, they will accept your closure request.
        </div>

        <div className="flex flex-col md:flex-row justify-center mt-4 gap-2">
          <StyledButton
            className="fs-16 font-normal"
            variant="primary"
            padding="0.8125rem 2rem"
            onClick={onConfirm}
            disabled={loading}
          >
            Send Closure Request
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default FreelancerClosureRequestModal;
