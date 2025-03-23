/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StyledButton } from "@/components/forms/Buttons";
import { showErr } from "@/helpers/utils/misc";
import PaymentSummary from "./PaymentSummary";
import { usePayments } from "@/pages/client-job-details-page/controllers/usePayments";

const Wrapper = styled.div`
  .payable-label {
    opacity: 0.8;
  }
`;

const CardInput = styled.div`
  border: 1px solid #e6e6e6;
  padding: 1rem;
  border-radius: 5px;
`;

type Props = {
  onPay: (e: any) => void;
  processingPayment: boolean;
  onCancel: () => void;
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      "::placeholder": {
        textTransform: "capitalize",
      },
    },
  },
};

export default function AddCardForm({
  onPay,
  processingPayment,
  onCancel,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState<boolean>(false);

  const { jobType } = usePayments();

  const handleSubmit = async (e) => {
    // This funtion will generate a token for the card
    e.preventDefault();
    // eslint-disable-next-line no-debugger
    try {
      setLoading(true);
      const data = await stripe.createToken(elements.getElement(CardElement));
      if (data.token) {
        // After token is generated, it will process the payment on backend side
        onPay(data.token.id);
      } else if (data.error) {
        showErr(data.error.message);
      }
    } catch (err) {
      showErr("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <CardInput>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </CardInput>

        <div>
          <PaymentSummary />

          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            {/* This cancel button will cancel the add card form and will show the saved card list */}
            <StyledButton
              variant="outline-dark"
              onClick={onCancel}
              disabled={processingPayment || loading}
            >
              Cancel
            </StyledButton>

            <StyledButton type="submit" disabled={processingPayment || loading}>
              {jobType === "hourly" ? "Pay" : "Deposit Milestone Payment"}
            </StyledButton>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}
