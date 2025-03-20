import { Modal, Button } from "react-bootstrap";
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
  cancelStateData: {
    show: boolean;
    loading?: boolean;
    milestoneStatus: string;
  };
  toggle: () => void;
  onConfirm: () => void;
};

const CancelMileStoneModal = ({
  cancelStateData,
  toggle,
  onConfirm,
}: Props) => {
  return (
    <Wrapper
      maxwidth={678}
      show={cancelStateData.show}
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
            Are you sure you want to cancel
            {cancelStateData.milestoneStatus === "pending" ? (
              <span>&nbsp;this milestone proposal?</span>
            ) : (
              <span>?</span>
            )}
          </div>
          {cancelStateData.milestoneStatus !== "pending" ? (
            <div className="content font-normal text-center">
              If you cancel this milestone, the money that has been deposited to
              pay you for its completion will be sent back to the client. There
              is no way to undo this and the client will not be obligated to pay
              for the incomplete work of this milestone.
              <div className="mt-md-3 mt-2">
                (To be paid for the work you've done in this milestone so far:
                have the client accept a new milestone to cover previous work
                before canceling this milestone.)
              </div>
            </div>
          ) : null}
          <div className="flex flex-column flex-md-row justify-center gap-3">
            <StyledButton
              className="fs-16 font-normal"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={toggle}
            >
              Not Now
            </StyledButton>
            <StyledButton
              className="fs-16 font-normal"
              variant="primary"
              padding="0.8125rem 2rem"
              onClick={onConfirm}
              disabled={cancelStateData.loading}
            >
              {cancelStateData.milestoneStatus === "pending"
                ? "Yes - Cancel"
                : "Yes - Cancel and Send Back Deposit"}
            </StyledButton>
          </div>
        </div>
      </Modal.Body>
    </Wrapper>
  );
};

export default CancelMileStoneModal;
