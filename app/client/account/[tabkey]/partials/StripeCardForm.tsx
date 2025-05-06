/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { addCard } from "@/helpers/http/client";
import { showErr } from "@/helpers/utils/misc";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // This funtion will generate a token for the card
    e.preventDefault();

    // Check if stripe or elements is not available
    if (!stripe || !elements) {
      showErr("Stripe has not been initialized properly");
      return;
    }

    // eslint-disable-next-line no-debugger
    try {
      setLoading(true);
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        showErr("Card information is missing");
        setLoading(false);
        return;
      }

      const data = await stripe.createToken(cardElement);
      if (data.token) {
        // After token is generated, it will process the payment on backend side
        saveCard(data.token.id);
      } else if (data.error) {
        showErr(data.error.message || "An error occurred with your card");
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="border border-[#e6e6e6] p-4 rounded-[5px]">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="flex items-center justify-end mt-4 flex-wrap gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white ${
              loading ? "opacity-50 " : ""
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105 border-2 border-primary ${
              loading || !stripe || !elements ? "opacity-50 " : ""
            }`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
