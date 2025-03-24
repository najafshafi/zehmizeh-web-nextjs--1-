/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StyledButton } from "@/components/forms/Buttons";
import { addCard } from "@/helpers/http/client";
import { showErr } from "@/helpers/utils/misc";

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

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      "::placeholder": {
        textTransform: "capitalize",
      },
    },
  },
};

type Props = {
  onCardAdded: () => void;
  onCancel: () => void;
};

export default function PaymentForm({ onCardAdded, onCancel }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e) => {
    // This funtion will generate a token for the card
    e.preventDefault();

    // eslint-disable-next-line no-debugger
    try {
      setLoading(true);
      const data = await stripe.createToken(elements.getElement(CardElement));
      if (data.token) {
        // After token is generated, it will process the payment on backend side
        saveCard(data.token.id);
      } else if (data.error) {
        showErr(data.error.message);
        setLoading(false);
      }
    } catch (err) {
      showErr("Something went wrong, please try again");
      setLoading(false);
    }
  };

  const saveCard = (token: string) => {
    /* This function will save the card */

    const promise = addCard(token);

    /* Add card api call */
    toast.promise(promise, {
      loading: "Loading...",
      success: (res) => {
        setLoading(false);
        /* Once the card is added, it will refetch the profile to get the latest cards */
        onCardAdded();
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <CardInput>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </CardInput>
        <div className="d-flex align-items-center justify-content-end mt-4 flex-wrap gap-3">
          <StyledButton
            disabled={loading}
            onClick={onCancel}
            variant="outline-dark"
          >
            Cancel
          </StyledButton>
          <StyledButton type="submit" disabled={loading}>
            Save
          </StyledButton>
        </div>
      </form>
    </Wrapper>
  );
}
