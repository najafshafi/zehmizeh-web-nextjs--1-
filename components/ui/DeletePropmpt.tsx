/*
 * This is a prompt modal for deleting..
 */
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";

type Props = {
  show: boolean;
  toggle: () => void;
  onDelete: () => void;
  loading?: boolean;
  text: string;
  cancelButtonText?: string;
};

const SuccessModalContent = styled.div`
  .modal-title {
    font-size: 1.5rem;
  }
`;
const DeletePrompt = ({
  show,
  toggle,
  onDelete,
  loading,
  text,
  cancelButtonText,
}: Props) => {
  return (
    <StyledModal maxwidth={570} show={show} size="lg" onHide={toggle} centered>
      <Modal.Body className="flex flex-column justify-center items-center">
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <SuccessModalContent className="text-center">
          <div className="modal-title font-normal">{text}</div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <StyledButton variant="outline-dark" onClick={toggle}>
              {cancelButtonText || "Go Back"}
            </StyledButton>
            <StyledButton
              variant="primary"
              onClick={onDelete}
              disabled={loading}
            >
              Delete
            </StyledButton>
          </div>
        </SuccessModalContent>
      </Modal.Body>
    </StyledModal>
  );
};

export default DeletePrompt;
