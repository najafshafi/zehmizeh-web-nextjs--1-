import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Loader from "@/components/Loader";
import { getBankAccounts } from "@/helpers/http/client";
import PaymentSummary from "./PaymentSummary";
import { usePayments } from "../../controllers/usePayments";
import {
  formatRoutingNumber,
  formatingAccountNumber,
} from "@/helpers/utils/helper";
import toast from "react-hot-toast";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  onPay: (e: any) => void;
  processingPayment: boolean;
};

interface BankAccount {
  user_bank_id: string;
  stripe_bank_account_id: string;
  account_holder_name: string;
  account_holder_type: string;
  last_4_digit: string;
  routing_number?: string;
}

const BankAccountsList = ({ onPay, processingPayment }: Props) => {
  const { jobType } = usePayments();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const { data, isLoading } = useQuery(["get-client-bank-accounts"], () =>
    getBankAccounts()
  );

  // Set the first account as selected when data is loaded
  useEffect(() => {
    if (data?.data?.length > 0) {
      setSelectedAccountId(data.data[0].stripe_bank_account_id);
    }
  }, [data]);

  const onSelect = (stripeBankAccountId: string) => () => {
    setSelectedAccountId(stripeBankAccountId);
  };

  const onContinuePay = () => {
    if (selectedAccountId === "") {
      toast.error("Please select a bank account.");
      return;
    }
    onPay(selectedAccountId);
  };

  // Show maintenance message instead of the bank account list
  const showMaintenanceMessage = true;

  if (showMaintenanceMessage) {
    return (
      <p className="text-[#ff0000] text-[1.2rem] font-bold text-center p-5 border border-[#ff0000] rounded-md bg-[#ffe6e6] my-5">
        Please note that our bank account payment processing system is currently
        undergoing maintenance. During this time, we kindly request that you use
        your credit card for any payments.
      </p>
    );
  }

  return (
    <div>
      <div className="text-xl font-normal mt-3">Select Account</div>
      {isLoading && <Loader />}
      <div className="max-h-[300px] overflow-y-auto">
        {!isLoading &&
          data?.data?.length > 0 &&
          data?.data?.map((item: BankAccount) => (
            <div
              key={item?.user_bank_id}
              className={`p-3 mt-3 cursor-pointer border transition-all duration-300 rounded-[0.875rem]
                          ${
                            selectedAccountId === item?.stripe_bank_account_id
                              ? "border-2 border-black"
                              : "border-gray-300"
                          }`}
              onClick={onSelect(item?.stripe_bank_account_id)}
            >
              <div>
                <table className="border-separate border-spacing-2 table-fixed">
                  <tbody>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-gray-600">
                          Name on Account: &nbsp;
                        </span>
                      </td>
                      <td className="capitalize">
                        {item?.account_holder_name}
                      </td>
                    </tr>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-gray-600">
                          Account Type: &nbsp;
                        </span>
                      </td>
                      <td className="capitalize">
                        {item?.account_holder_type}
                      </td>
                    </tr>
                    <tr className="text-base font-normal">
                      <td>
                        <span className="text-gray-600">
                          Account Number: &nbsp;
                        </span>
                      </td>
                      <td>{formatingAccountNumber(item?.last_4_digit)}</td>
                    </tr>
                    {item?.routing_number && (
                      <tr className="text-base font-normal">
                        <td>
                          <span className="text-gray-600">
                            Routing Number: &nbsp;
                          </span>
                        </td>
                        <td>{formatRoutingNumber(item?.routing_number)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      <PaymentSummary />

      <p className="mt-4 mb-0">
        Note: Payments via bank can take 4-5 business days to process
      </p>
      <div className="flex justify-center">
        <CustomButton
          text={jobType === "hourly" ? "Pay" : "Deposit Milestone Payment"}
          disabled={processingPayment}
          onClick={onContinuePay}
          className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-base mt-3 w-full"
        />
      </div>
    </div>
  );
};

export default BankAccountsList;
