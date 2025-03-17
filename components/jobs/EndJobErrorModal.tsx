/*
 * This is the end job error modal - this will be opened when any error comes while ending the job
 */
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import ErrorIcon  from '@/public/icons/error-orange-icon.svg';

type Props = {
  show: boolean;
  error?: string;
  toggle: () => void;
  goToMilestones?: () => void;
};

const Content = styled.div`
  .description {
    opacity: 0.63;
  }
`;

const EndJobErrorModal = ({ show, toggle, goToMilestones, error }: Props) => {
  return (
    <StyledModal maxwidth={540} show={show} size="lg" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <Content className="d-flex flex-column justify-content-center align-items-center">
          <ErrorIcon />
          <div className="description fs-20 fw-400 text-center">
            {error ||
              'Please complete/close all the remaining milestones in order to end the project.'}
          </div>
          {goToMilestones ? (
            <StyledButton
              className="fs-16 fw-400 mt-4"
              variant="primary"
              padding="1.125rem 2.25rem"
              onClick={goToMilestones}
            >
              Close
            </StyledButton>
          ) : null}
        </Content>
      </Modal.Body>
    </StyledModal>
  );
};

export default EndJobErrorModal;
