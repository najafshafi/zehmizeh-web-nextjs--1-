import Link from "next/link";
import { StyledModal } from "./styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";

interface PaymentTermsPopupProps {
  show: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PaymentTermsPopup = ({
  show,
  onClose,
  onAccept,
}: PaymentTermsPopupProps) => {
  return (
    <StyledModal show={show} onHide={onClose} centered maxwidth={500}>
      <StyledModal.Body>
        <div className="text-center">
          <h2 className="fs-24 fw-600 mb-4">Payment Terms Agreement</h2>

          <div className="mb-4">
            <p className="mb-2">
              I agree that all payments will be processed through Zehmizeh.
            </p>
            <p className="fw-700 mb-2">
              Paying outside Zehmizeh is against Halacha and violates our{" "}
              <Link href="/terms-of-service#13" className="text-warning">
                Terms
              </Link>
            </p>
          </div>

          <div className="flex gap-3 justify-center items-center">
            <StyledButton
              variant="outline-dark"
              onClick={onClose}
              padding="0.75rem 1.5rem"
            >
              Cancel
            </StyledButton>
            <StyledButton
              variant="primary"
              onClick={onAccept}
              padding="0.75rem 3.5rem"
            >
              I Agree
            </StyledButton>
          </div>
        </div>
      </StyledModal.Body>
    </StyledModal>
  );
};

export default PaymentTermsPopup;
