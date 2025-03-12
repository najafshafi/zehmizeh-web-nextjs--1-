import { Modal, Button } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import styled from "styled-components";

const Wrapper = styled.div`
  .close-btn {
    border: 1px solid ${(props) => props.theme.statusColors.darkPink.color};
    color: ${(props) => props.theme.statusColors.darkPink.color};
    :hover {
      background-color: inherit;
    }
  }
`;

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm?: () => void;
  clousureToggle?: () => void;
  loading: boolean;
};

const AccountClosureModal = ({
  show,
  toggle,
  clousureToggle,
  loading,
}: Props) => {
  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <Wrapper>
          <div className="fs-28 fw-400 text-center mb-3">
            Are you sure you would like to close your account?
          </div>
          <div className="fs-20 fw-400 text-center">
            Closing an account means permanently removing this user profile from
            the website.
          </div>
          <div className="mt-2 fs-20 fw-400 text-center">
            After closing, you will no longer have access to your transaction
            history, project records, ratings and reviews, message history, or
            any other aspect of your personal account. Starting a new account
            with the same name will not reinstate any of these elements.
          </div>
          <div className="mt-2 fs-20 fw-400 text-center">
            ZehMizeh will have no record of your personal banking and payment
            details after closure.
          </div>
          <div className="flex flex-column gap-3 mt-md-4 mt-3">
            <StyledButton
              className="fs-16 fw-400"
              variant="primary"
              padding="0.8125rem 2rem"
              onClick={toggle}
              disabled={loading}
            >
              Keep my account open
            </StyledButton>
            <StyledButton
              className="close-btn fs-16 fw-400"
              variant="outline-dark"
              padding="0.8125rem 2rem"
              onClick={clousureToggle}
              disabled={loading}
            >
              I&apos;d like my account to be closed
            </StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AccountClosureModal;
