/*
 * This is a Success modal after ending a job
 */
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { StyledModal } from "components/styled/StyledModal";
import { ReactComponent as SuccessTickIcon } from "assets/icons/success-tick.svg";

type Props = {
  show: boolean;
  toggle: () => void;
};

const SuccessModalContent = styled.div`
  .description {
    opacity: 0.63;
  }
`;

const EndJobModal = ({ show, toggle }: Props) => {
  return (
    <StyledModal maxwidth={540} show={show} size="lg" onHide={toggle} centered>
      <Modal.Body className="flex flex-column justify-center items-center">
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <SuccessTickIcon />
        <SuccessModalContent>
          <div className="modal-title fs-32 fw-700 text-center">
            Project Ended!
          </div>
          <div className="description mt-3 fs-20 fw-300 text-center">
            Project ended successfully!
          </div>
        </SuccessModalContent>
      </Modal.Body>
    </StyledModal>
  );
};

export default EndJobModal;
