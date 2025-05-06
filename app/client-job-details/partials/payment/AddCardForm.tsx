/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StyledButton } from "@/components/forms/Buttons";
import { showErr } from "@/helpers/utils/misc";
import PaymentSummary from "./PaymentSummary";
import { usePayments } from "../../controllers/usePayments";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // This funtion will generate a token for the card
    e.preventDefault();
    // eslint-disable-next-line no-debugger
    try {
      // Check if stripe or elements are null
      if (!stripe || !elements) {
        showErr("Stripe hasn't loaded yet. Please try again.");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        showErr("Card element not found. Please refresh and try again.");
        return;
      }

      setLoading(true);
      const data = await stripe.createToken(cardElement);
      if (data.token) {
        // After token is generated, it will process the payment on backend side
        onPay(data.token.id);
      } else if (data.error) {
        showErr(
          data.error.message || "Card validation failed. Please try again."
        );
      }
    } catch (err) {
      showErr("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="border border-[#e6e6e6] p-4 rounded-[5px]">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

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
    </div>
  );
}
