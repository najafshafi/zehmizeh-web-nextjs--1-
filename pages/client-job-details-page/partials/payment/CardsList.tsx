import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "react-query";
import Loader from "@/components/Loader";
import PaymentForm from "./AddCardForm";
import SavedCards from "./SavedCards";
import { getCards } from "@/helpers/http/client";
import { GETSTRIPEKEYHANDLER } from "@/helpers/http/common";

// Initialize stripe only on the client side
const stripePromise =
  typeof window !== "undefined" ? loadStripe(GETSTRIPEKEYHANDLER()) : null;

type Props = {
  onPay: (e: any) => void;
  onCancel: () => void;
  processingPayment: boolean;
};

const CardsList = ({ onPay, processingPayment, onCancel }: Props) => {
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);
  const [clientStripe, setClientStripe] = useState(stripePromise);
  const { data, isLoading } = useQuery(["get-cards"], () => getCards());

  // Ensure stripe is initialized on the client side
  useEffect(() => {
    if (!clientStripe && typeof window !== "undefined") {
      setClientStripe(loadStripe(GETSTRIPEKEYHANDLER()));
    }
  }, [clientStripe]);

  const toggleAddCardForm = () => {
    /* This will toggle add card form */
    setShowAddCardForm(!showAddCardForm);
  };

  if (typeof window === "undefined") {
    return <div>Loading payment options...</div>;
  }

  return (
    <div>
      {/* Loading saved cards */}
      {isLoading && <Loader />}
      {/* Saved cards - If add card form is not opened */}
      {!isLoading && !showAddCardForm && data?.data?.length > 0 && (
        <SavedCards
          cards={data?.data}
          onPay={onPay}
          processingPayment={processingPayment}
        />
      )}

      {/* Add new card */}
      {(showAddCardForm || data?.data?.length == 0) && clientStripe && (
        <Elements stripe={clientStripe}>
          <div className="fs-20 font-normal mt-4 mb-2">Card Details</div>

          {/* Payment form */}
          <PaymentForm
            onPay={onPay}
            processingPayment={processingPayment}
            onCancel={data?.data?.length > 0 ? toggleAddCardForm : onCancel}
          />
        </Elements>
      )}
    </div>
  );
};

export default CardsList;
