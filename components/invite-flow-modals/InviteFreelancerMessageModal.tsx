import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import TextEditor from '@/components/forms/TextEditor';
import toast from 'react-hot-toast';

type Props = {
  show: boolean;
  toggle: () => void;
  onInvite?: (msg: string) => void;
  freelancerName: string;
  loading: boolean;
  inviteMessage?: string;
  isEditFlag?: boolean;
};

const ContentWrapper = styled.div`
  .invite-freelancer__message-box {
    padding: 1rem 1.25rem;
    margin-top: 2.5rem;
  }
`;

const InviteFreelancerMessageModal = ({
  show,
  toggle,
  onInvite,
  freelancerName,
  loading,
  inviteMessage,
  isEditFlag,
}: Props) => {
  const [message, setMessage] = useState<string>('');
  const onCloseModal = () => {
    setMessage('');
    toggle();
  };

  useEffect(() => {
    if (show) {
      setMessage('');
    }
  }, [show]);

  const onDescriptionChange = (data: any) => {
    setMessage(data);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onInvite(message);
    setMessage('');
  };

  return (
    <StyledModal show={show} size="lg" onHide={onCloseModal} centered maxwidth={765}>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <ContentWrapper>
          <Form onSubmit={handleSubmit}>
            <div className="content">
              <h3 className="fs-36 fw-700">
                {freelancerName ? 'Write Your Personal Invitation' : 'Message Freelancers'}
              </h3>
              {freelancerName ? (
                <div className="fs-20 fw-400">
                  Share a message{' with'}
                  <span className="fw-700 text-capitalize">{freelancerName && ` ${freelancerName}. `}</span> (Optional)
                </div>
              ) : (
                <div className="fs-20 fw-400">Share a message with the freelancers you're inviting (Optional)</div>
              )}
              {!isEditFlag && (
                <Form.Group className="mt-4">
                  <TextEditor
                    value={message}
                    onChange={onDescriptionChange}
                    placeholder="Write here..."
                    maxChars={1000}
                  />
                </Form.Group>
              )}
              {isEditFlag === true && (
                <Form.Group className="mt-4">
                  <TextEditor value={inviteMessage} onChange={onDescriptionChange} maxChars={1000} />
                </Form.Group>
              )}
            </div>
            <div className="bottom-buttons d-flex">
              {!isEditFlag && (
                <StyledButton
                  className="fs-16 fw-400"
                  variant="primary"
                  padding="0.8125rem 2rem"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" /> : 'Send Invitation'}
                </StyledButton>
              )}
              {isEditFlag === true && (
                <StyledButton
                  className="fs-16 fw-400"
                  variant="primary"
                  padding="0.8125rem 2rem"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" /> : 'Edit Invitation'}
                </StyledButton>
              )}
            </div>
          </Form>
        </ContentWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default InviteFreelancerMessageModal;
