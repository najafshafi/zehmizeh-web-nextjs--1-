import { Modal, Button, Spinner } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import styled from "styled-components";
import { breakpoints } from "@/helpers/hooks/useResponsive";

const Wrapper = styled(StyledModal)`
  .heading {
    font-size: 1.5rem;
    @media ${breakpoints.mobile} {
      font-size: 1.25rem;
    }
  }
  .content {
    padding: 1rem;
    font-size: 1.25rem;
    @media ${breakpoints.mobile} {
      font-size: 1.125rem;
    }
  }
`;

type Props = {
  stateData: {
    show: boolean;
    loading: boolean;
  };
  toggle: () => void;
  onConfirm: () => void;
};

const MarkMilestoneAsCompleted = ({ stateData, toggle, onConfirm }: Props) => {
  return (
    <Wrapper
      maxwidth={900}
      show={stateData.show}
      size="sm"
      onHide={toggle}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <div className="flex flex-column gap-md-3 gap-0">
          <div className="heading font-normal text-center">
            You’re Changing Milestone Status to ‘Complete’
          </div>

          <p style={{ fontSize: "1.2rem" }}>
            By marking a milestone as complete, you’re indicating to the client
            that all of the required uploads have been submitted. They’ll be
            notified that you’re ready to have your payment delivered.
          </p>

          <div className="flex flex-column flex-md-row justify-center gap-3">
            <StyledButton
              className="fs-16 font-normal"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={toggle}
            >
              It’s Not Ready - Cancel
            </StyledButton>
            <StyledButton
              onClick={onConfirm}
              className="fs-16 font-normal"
              variant="primary"
              padding="0.8125rem 2rem"
              disabled={stateData.loading}
            >
              {stateData.loading && (
                <span className="me-2">
                  <Spinner size="sm" animation="grow" />
                </span>
              )}
              Everything is Submitted - Mark as ‘Complete’
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </Wrapper>
  );
};

export default MarkMilestoneAsCompleted;
