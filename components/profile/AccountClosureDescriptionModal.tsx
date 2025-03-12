import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { StyledButton } from "@/components/forms/Buttons";
import { StyledModal } from "@/components/styled/StyledModal";
import TextEditor from "@/components/forms/TextEditor";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm?: (msg: string) => void;
  loading: boolean;
};

const ContentWrapper = styled.div`
  .invite-freelancer__message-box {
    padding: 1rem 1.25rem;
    margin-top: 2.5rem;
  }
  .issue-textarea {
    // border: 1px solid #e7e7e7;
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    width: 100%;
    padding: 10px 20px;
  }
`;

const AccountClosureDescriptionModal = ({
  show,
  toggle,
  onConfirm,
  loading,
}: Props) => {
  const [message, setMessage] = useState<string>("");
  const onCloseModal = () => {
    setMessage("");
    toggle();
  };

  useEffect(() => {
    if (show) {
      setMessage("");
    }
  }, [show]);

  const onDescriptionChange = (data: any) => {
    setMessage(data);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onConfirm(message);
  };

  return (
    <StyledModal
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
      maxwidth={765}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <ContentWrapper>
          <Form onSubmit={handleSubmit}>
            <div className="content">
              <div className="fs-20 fw-400">
                We're sorry to see you go! We can improve with your feedback...
                please let us know why you're closing your account.
              </div>
              <Form.Group className="mt-4">
                <TextEditor
                  value={message}
                  onChange={onDescriptionChange}
                  placeholder="Write here..."
                  maxChars={1000}
                />
              </Form.Group>
            </div>
            <div className="bottom-buttons flex">
              <StyledButton
                className="fs-16 fw-400"
                variant="primary"
                padding="0.8125rem 2rem"
                type="submit"
                disabled={message === "" || loading}
              >
                {loading ? (
                  <Spinner animation="border" />
                ) : (
                  "Closed Account Request"
                )}
              </StyledButton>
            </div>
          </Form>
        </ContentWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AccountClosureDescriptionModal;
