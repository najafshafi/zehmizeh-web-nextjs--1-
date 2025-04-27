import { useState, useEffect } from "react";
import CardsList from "./CardsList";
import BankAccountsList from "./BankAccountsList";
import { useAuth } from "@/helpers/contexts/auth-context";
import { usePayments } from "../../controllers/usePayments";

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-[560px] w-full mx-auto relative">
        <div className="p-12 md:p-12 sm:p-8">
          <button
            className="absolute -top-4 -right-8 text-[1.75rem] font-extralight leading-none p-4 md:text-white md:translate-x-[30px] md:-translate-y-[10px] focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex flex-col gap-4">
            <div className="text-[32px] font-bold">Payment Details</div>

            {user?.location?.country_short_name === "US" && (
              <div className="flex items-center gap-4 mt-4">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    onChange={onPaymentMethodChange("OTHER")}
                    checked={selectedPaymentMethod === "OTHER"}
                    className="form-radio"
                  />
                  <span>Credit Card</span>
                </label>

                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    onChange={onPaymentMethodChange("ACH")}
                    checked={selectedPaymentMethod === "ACH"}
                    className="form-radio"
                  />
                  <span>Bank Account</span>
                </label>
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
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
