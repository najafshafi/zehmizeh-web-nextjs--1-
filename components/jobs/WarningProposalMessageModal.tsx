import { StyledModal } from 'components/styled/StyledModal';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type Props = {
  show: boolean;
  setShow: (value: boolean) => void;
  onContinue: () => void;
};

export const WarningProposalMessageModal = ({ setShow, show, onContinue }: Props) => {
  const [firstCheckbox, setFirstCheckbox] = useState(false);
  const [secondCheckbox, setSecondCheckbox] = useState(false);

  useEffect(() => {
    if (firstCheckbox && secondCheckbox) {
      closeModal();
      onContinue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCheckbox, secondCheckbox]);

  const closeModal = () => setShow(false);

  return (
    <StyledModal maxwidth={767} show={show} size="sm" onHide={closeModal} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={closeModal}>
          &times;
        </Button>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h4>Note: You are NOT Hired.</h4>

          <p className="mt-4 mb-2">
            You are not hired until the client accepts your proposal, so{' '}
            <b>you should not be doing any work on the project until then.</b>
          </p>
          <Form.Check
            type="checkbox"
            className="d-inline-flex align-items-center g-1 user-select-none"
            label="I understand"
            checked={firstCheckbox}
            onChange={(e) => {
              setFirstCheckbox(e.target.checked);
            }}
          />

          <p className="mt-4 mb-2">
            Payment for projects found on ZMZ must be made through ZMZ's payment system. Paying through{' '}
            <b>any other method is theft from the company,</b> (violating our Terms of Service and halacha).
          </p>
          <Form.Check
            type="checkbox"
            className="d-inline-flex align-items-center g-1 user-select-none"
            label="I understand"
            checked={secondCheckbox}
            onChange={(e) => {
              setSecondCheckbox(e.target.checked);
            }}
          />
        </div>
      </Modal.Body>
    </StyledModal>
  );
};
