import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from 'react-query';
import Loader from 'components/Loader';
import PaymentForm from './AddCardForm';
import SavedCards from './SavedCards';
import { getCards } from 'helpers/http/client';
import { GETSTRIPEKEYHANDLER } from 'helpers/http/common';

const REACT_APP_STRIPE_KEY = GETSTRIPEKEYHANDLER();

const stripePromise = loadStripe(REACT_APP_STRIPE_KEY);

type Props = {
  onPay: (e: any) => void;
  onCancel: () => void;
  processingPayment: boolean;
};

const CardsList = ({ onPay, processingPayment, onCancel }: Props) => {
  const [showAddCardForm, setShowAddCardForm] = useState<boolean>(false);
  const { data, isLoading } = useQuery(['get-cards'], () => getCards());

  const toggleAddCardForm = () => {
    /* This will toggle add card form */
    setShowAddCardForm(!showAddCardForm);
  };

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
      {(showAddCardForm || data?.data?.length == 0) && (
        <Elements stripe={stripePromise}>
          <div className="fs-20 fw-400 mt-4 mb-2">Card Details</div>

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
