import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import ErrorIcon from "@/public/icons/error-orange-icon.svg";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
};

const EndJobModal = ({ show, toggle, onConfirm }: Props) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const onCloseModal = () => {
    setErrorMsg("");
    toggle();
  };

  return (
    <StyledModal
      maxwidth={540}
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <div className="flex flex-col justify-center items-center">
          {!errorMsg ? (
            <>
              <div className="description fs-20 font-normal text-center mb-2">
                Are you sure you&apos;re ready to end this project? If the
                employer accepts this request, you won&apos;t be able to post
                any more submissions.
              </div>
              <StyledButton
                className="fs-16 font-normal mt-4 w-100"
                variant="outline-dark"
                padding="1.125rem 2.25rem"
                onClick={toggle}
              >
                No, I&apos;m not ready
              </StyledButton>
              <StyledButton
                className="fs-16 font-normal mt-3 w-100"
                variant="outline-dark"
                padding="1.125rem 2.25rem"
                onClick={() => onConfirm()}
              >
                Yes, I&apos;m finished - request to close
              </StyledButton>
            </>
          ) : (
            <>
              <ErrorIcon />
              <div className="error fs-20 font-normal text-center">
                {errorMsg}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default EndJobModal;
