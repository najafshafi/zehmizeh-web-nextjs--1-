import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import ErrorIcon from "@/public/icons/error-orange-icon.svg";

type Props = {
  show: boolean;
  toggle: () => void;
  stripeStatus: string;
};

const Wrapper = styled.div``;

const StripeCompleteWarning = ({ show, toggle, stripeStatus }: Props) => {
  const onCloseModal = () => {
    toggle();
  };

  return (
    <StyledModal
      maxwidth={570}
      show={show}
      size="lg"
      onHide={onCloseModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <Wrapper>
          <div className="content text-center">
            <ErrorIcon />
            {/* {stripeStatus} */}
            {(stripeStatus === "pending" ||
              stripeStatus === "currently_due") && (
              <>
                <h3 className="fs-36 fw-700">Complete Stripe Information</h3>
                <div className="subtitle fs-20 font-normal mt-3">
                  To add milestones, please complete your Stripe account
                  information (at the bottom of your profile page) and add your
                  bank details
                </div>
              </>
            )}
            {stripeStatus === "pending_verification" && (
              <>
                <h3 className="fs-36 fw-700">Stripe verification pending</h3>
                <div className="fs-20 font-normal">
                  Your Stripe account information is being verified. Once you're
                  approved, you can add your bank information.
                </div>
              </>
            )}
            {(stripeStatus === "bank_account_pending" ||
              stripeStatus === "verified") && (
              <>
                <h3 className="fs-36 fw-700">Complete bank details</h3>
                <div className="fs-20 font-normal">
                  To add milestones or request payment delivery, please first
                  add your bank details
                </div>
              </>
            )}
          </div>
          {(stripeStatus === "pending" ||
            stripeStatus === "currently_due" ||
            stripeStatus === "bank_account_pending") && (
            <div className="flex mt-4 justify-center">
              <Link to="/freelancer/account/Payment%20Details">
                <StyledButton
                  className="fs-16 font-normal"
                  variant="primary"
                  padding="0.8125rem 2rem"
                >
                  {["pending", "currently_due"].includes(stripeStatus)
                    ? "Begin Stripe Activation"
                    : "Add Bank Account"}
                </StyledButton>
              </Link>
            </div>
          )}
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default StripeCompleteWarning;
