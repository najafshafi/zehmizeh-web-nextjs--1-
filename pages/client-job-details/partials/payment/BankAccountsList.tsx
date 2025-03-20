import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { StyledButton } from "components/forms/Buttons";
import Loader from "components/Loader";
import { getBankAccounts } from "helpers/http/client";
import { transition } from "styles/transitions";
import PaymentSummary from "./PaymentSummary";
import { usePayments } from "pages/client-job-details/controllers/usePayments";
import {
  formatRoutingNumber,
  formatingAccountNumber,
} from "helpers/utils/helper";
import toast from "react-hot-toast";

const Wrapper = styled.div`
  .listings {
    max-height: 300px;
    overflow-y: auto;
  }
  .payable-label {
    color: ${(props) => props.theme.colors.darkText};
  }
  .selected {
    border: 2px solid ${(props) => props.theme.font.color.heading};
  }
  .payable-label {
    color: ${(props) => props.theme.colors.gray8};
  }
  .fees-calculation,
  .total-amount {
    border-top: 1px solid ${(props) => props.theme.colors.gray6};
  }
`;

const StyledBankItem = styled.div`
  border: 1px solid ${(props) => props.theme.colors.gray6};
  border-radius: 0.875rem;
  ${() => transition()}
  .bank-table {
    border-collapse: separate;
    border-spacing: 0.5rem;
    table-layout: fixed;
  }
  .acc-info--label {
    color: ${(props) => props.theme.colors.gray8};
  }
`;

type Props = {
  onPay: (e: any) => void;
  processingPayment: boolean;
};

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
    if (selectedAccountId == "") {
      toast.error("Please select a bank account.");
      return;
    }
    onPay(selectedAccountId);
  };

  return (
    <p
      style={{
        color: "#ff0000",
        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ff0000",
        borderRadius: "5px",
        backgroundColor: "#ffe6e6",
        margin: "20px 0",
      }}
    >
      Please note that our bank account payment processing system is currently
      undergoing maintenance. During this time, we kindly request that you use
      your credit card for any payments.
    </p>
  );

  /*return (
    <Wrapper>
      <div className="fs-20 font-normal mt-3">Select Account</div>
      {isLoading && <Loader />}
      <div className="listings">
        {!isLoading &&
          data?.data?.length > 0 &&
          data?.data?.map((item) => (
            <StyledBankItem
              key={item?.user_bank_id}
              className={`p-3 mt-3 pointer ${selectedAccountId == item?.stripe_bank_account_id ? 'selected' : ''}`}
              onClick={onSelect(item?.stripe_bank_account_id)}
            >
              <div>
                <table className="bank-table">
                  <tr className="fs-1rem font-normal">
                    <td>
                      <span className="acc-info--label">Name on Account: &nbsp;</span>
                    </td>
                    <td className="capitalize">{item?.account_holder_name}</td>
                  </tr>
                  <tr className="fs-1rem font-normal">
                    <td>
                      <span className="acc-info--label">Account Type: &nbsp;</span>
                    </td>
                    <td className="capital-first-ltr">{item?.account_holder_type}</td>
                  </tr>
                  <tr className="fs-1rem font-normal">
                    <td>
                      <span className="acc-info--label">Account Number: &nbsp;</span>
                    </td>
                    <td>{formatingAccountNumber(item?.last_4_digit)}</td>
                  </tr>
                  {item?.routing_number && (
                    <tr className="fs-1rem font-normal">
                      <td>
                        <span className="acc-info--label">Routing Number: &nbsp;</span>
                      </td>
                      <td>{formatRoutingNumber(item?.routing_number)}</td>
                    </tr>
                  )}
                </table>
              </div>
            </StyledBankItem>
          ))}
      </div>

      <PaymentSummary />

      <p className="mt-4 mb-0">Note: Payments via bank can take 4-5 business days to process</p>
      <div className="flex justify-center">
        <StyledButton disabled={processingPayment} onClick={onContinuePay} className="mt-3 w-100">
          {jobType === 'hourly' ? 'Pay' : 'Deposit Milestone Payment'}
        </StyledButton>
      </div>
    </Wrapper>
  );*/
};

export default BankAccountsList;
