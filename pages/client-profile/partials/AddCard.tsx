import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCardForm from "./StripeCardForm";
import { GETSTRIPEKEYHANDLER } from "@/helpers/http/common";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const REACT_APP_STRIPE_KEY = GETSTRIPEKEYHANDLER();

const stripePromise = loadStripe(REACT_APP_STRIPE_KEY);

type Props = {
  onCancel: () => void;
  onCardAdded: () => void;
};

function AddCard({ onCancel, onCardAdded }: Props) {
  return (
    <div className="mt-3">
      <Elements stripe={stripePromise}>
        <StripeCardForm onCancel={onCancel} onCardAdded={onCardAdded} />
      </Elements>
    </div>
  );
}

export default AddCard;
