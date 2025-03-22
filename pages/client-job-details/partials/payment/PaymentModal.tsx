import { Modal, Button, Form } from "react-bootstrap";
import { StyledModal } from "components/styled/StyledModal";
import CardsList from "./CardsList";
import BankAccountsList from "./BankAccountsList";
import { useAuth } from "helpers/contexts/auth-context";
import { usePayments } from "pages/client-job-details/controllers/usePayments";

type Props = {
  show: boolean;
  onPay: (e: any) => void;
  onCancel: () => void;
  processingPayment: boolean;
};

function PaymentModal({ show, onPay, onCancel, processingPayment }: Props) {
  const { user } = useAuth();
  const { selectedPaymentMethod, updatePaymentMethod } = usePayments();

  const onPaymentMethodChange = (type: string) => () => {
    updatePaymentMethod(type);
  };

  const onClose = () => {
    onPaymentMethodChange("OTHER")();
    onCancel();
  };

  return (
    <StyledModal show={show} size="sm" onHide={onClose} maxwidth={560} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <div className="content flex flex-col">
          <div className="modal-title fs-32 fw-700">Payment Details</div>
          {user?.location?.country_short_name === "US" && (
            <div className="flex items-center gap-4 mt-4">
              <Form.Check
                inline
                label="Credit Card"
                name="budget_type"
                type="radio"
                id={"c_card"}
                onChange={onPaymentMethodChange("OTHER")}
                checked={selectedPaymentMethod === "OTHER"}
                className="d-inline-flex items-center g-1 me-2"
              />
              <Form.Check
                inline
                label="Bank Account"
                name="budget_type"
                type="radio"
                id={"bank"}
                onChange={onPaymentMethodChange("ACH")}
                checked={selectedPaymentMethod === "ACH"}
                className="d-inline-flex items-center g-1 me-2"
              />
            </div>
          )}
          {selectedPaymentMethod == "OTHER" && (
            <CardsList
              onPay={onPay}
              processingPayment={processingPayment}
              onCancel={onCancel}
            />
          )}
          {selectedPaymentMethod == "ACH" && (
            <BankAccountsList
              onPay={onPay}
              processingPayment={processingPayment}
            />
          )}
        </div>
      </Modal.Body>
    </StyledModal>
  );
}

export default PaymentModal;
