import { Modal, Button } from 'react-bootstrap';
import { StyledButton } from 'components/forms/Buttons';
import { StyledModal } from 'components/styled/StyledModal';
import { useEffect, useState } from 'react';
import moment from 'moment';

type Props = {
  show: boolean;
  loading: boolean;
  toggle: () => void;
  handleClick: (data: 'ACCEPT_AND_DECLINE_REST' | 'ACCEPT_AND_LEAVE_OPEN') => void;
};

export const HiringMoreFreelancerModal = ({ show, toggle, handleClick, loading }: Props) => {
  const [showInformationModal, setShowInformationModal] = useState(false);

  // Reseting state when modal is not open
  useEffect(() => {
    if (!show) {
      // Added timeout because it was changing UI while closing animation is going on
      // So it'll change state only after closing animation is complete
      setTimeout(() => {
        setShowInformationModal(false);
      }, 1000);
    }
  }, [show]);

  const toggleWrapper = () => {
    if (!loading) toggle();
  };

  const ConfirmationPopup = (
    <div className="text-center">
      <div className="modal-title fs-24 fw-700">Would you like to hire more freelancers?</div>

      <p className="my-4">
        Would you like to accept this freelancer and decline the others?
        <br />
        Or would you like to keep the project post open so you can hire more freelancers?
      </p>

      <div className="d-flex gap-3 align-items-center justify-content-center">
        <StyledButton
          onClick={() => {
            setShowInformationModal(true);
          }}
          className="d-flex align-items-center gap-3 text-capitalize"
          disabled={loading}
        >
          Accept & Leave Open
        </StyledButton>
        <StyledButton variant="outline-dark" onClick={() => handleClick('ACCEPT_AND_DECLINE_REST')} disabled={loading}>
          Accept & Decline the Rest
        </StyledButton>
      </div>
    </div>
  );

  const InformationPopup = (
    <div className="text-center">
      <div className="modal-title fs-24 fw-700">
        You can continue accepting proposals and inviting more freelancers to this project.
      </div>

      <p className="my-4">
        In 65 Days ({moment().add('65', 'days').format('MMM DD, YYYY')}), your project post will close. Every time you
        accept a freelancer, the time will be extended again.
      </p>

      <div className="d-flex gap-3 align-items-center justify-content-center">
        <StyledButton
          onClick={() => {
            handleClick('ACCEPT_AND_LEAVE_OPEN');
          }}
          disabled={loading}
          className="d-flex align-items-center gap-3 text-capitalize"
        >
          Close
        </StyledButton>
      </div>
    </div>
  );

  return (
    <StyledModal maxwidth={678} show={show} size="lg" onHide={toggleWrapper} centered>
      <Modal.Body>
        {!loading && (
          <>
            <Button variant="transparent" className="close" onClick={toggleWrapper}>
              &times;
            </Button>
          </>
        )}
        {!showInformationModal ? ConfirmationPopup : InformationPopup}
      </Modal.Body>
    </StyledModal>
  );
};
