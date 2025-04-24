import Payments from "./Payments";
import { PaymentControllerProvider } from "./PaymentController";

const PaymentsWrapper = () => {
  return (
    <PaymentControllerProvider>
      <Payments />
    </PaymentControllerProvider>
  );
};

export default PaymentsWrapper;
