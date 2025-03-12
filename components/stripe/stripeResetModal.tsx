import { Modal, Button, Spinner } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { useState } from "react";
import { resetStripeHandler } from "@/helpers/http/freelancer";
import toast from "react-hot-toast";

type Props = {
  show: boolean;
  onClose: () => void;
  refetch: () => void;
};

const StripeResetModal = ({ show, onClose, refetch }: Props) => {
  const [loading, setLoading] = useState(false);

  const resetStripe = async () => {
    setLoading(true);

    const promise = resetStripeHandler();
    toast.promise(promise, {
      loading: "loading...",
      success: (res: any) => {
        setLoading(false);
        onClose();
        refetch();
        return res?.message ?? "success";
      },
      error: (err) => {
        setLoading(false);
        onClose();
        return err?.response?.data?.message ?? err.toString();
      },
    });
  };

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>

        <div className="content">
          <h4 className="fs-36 fw-700 text-center">
            Are You Sure You Want to Reset Stripe?
          </h4>
          <div style={{ fontSize: "18px" }}>
            <p className="mt-4">
              Resetting Stripe means all of your previous Stripe account details
              will be deleted and you will need to restart Stripe activation
              from the beginning. (Nothing else about your profile or your
              project history will be changed.)
            </p>

            <span>This action is only recommended if:</span>
            <ul>
              <li>You’ve registered with incorrect information</li>
              <li>You’re moving to a new country</li>
            </ul>

            <b className="text-center d-block mb-4">
              This step cannot be undone.
            </b>
          </div>
        </div>

        <div className="flex justify-content-center">
          <StyledButton
            className="flex items-center gap-3"
            disabled={loading}
            onClick={() => resetStripe()}
          >
            {loading && <Spinner animation="border" />}
            Reset Stripe
          </StyledButton>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default StripeResetModal;
