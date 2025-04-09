import styled from "styled-components";
import Tooltip from "@/components/ui/Tooltip";
import Info from "@/public/icons/info-circle-gray.svg";
import { numberWithCommas } from "@/helpers/utils/misc";
import { usePayments } from "../../controllers/usePayments";

const Wrapper = styled.div`
  .payable-label {
    color: ${(props) => props.theme.colors.gray8};
  }
  .fees-calculation,
  .total-amount {
    border-top: 1px solid ${(props) => props.theme.colors.gray6};
  }
`;

// Mudit - Here I am using the calculations from context

const PaymentSummary = () => {
  const {
    amount,
    selectedPaymentMethod,
    zehMizehCharge,
    totalPayableAmount,
    jobType,
  } = usePayments();

  return (
    <Wrapper>
      <div className="fees-calculation mt-5 pt-4">
        <div className="fs-1rem fw-700 flex items-center justify-between mt-1">
          <span className="payable-label fs-1rem font-normal">
            {jobType === "hourly"
              ? "Price for Hours Submitted"
              : "Milestone Amount"}
          </span>
          {numberWithCommas(amount, "USD")}
        </div>
        <div className="fs-1rem fw-700 flex items-center justify-between mt-1">
          <span className="payable-label fs-1rem font-normal">
            <div className="flex flex-row items-center justify-content-start">
              ZehMizeh Fee
              <Tooltip
                customTrigger={
                  <div className="fs-sm mx-1">
                    <Info />
                  </div>
                }
              >
                {selectedPaymentMethod === "OTHER" ? "4.9%" : "2.9%"}
              </Tooltip>
            </div>
          </span>
          {/* {zehMizehCharge} {'=>'} {minFixedAmount} */}
          {numberWithCommas(zehMizehCharge, "USD")}
        </div>
        <div className="fs-24 fw-700 flex items-center justify-between mt-3 pt-2 total-amount">
          <span className="payable-label fs-1rem font-normal">Total</span>
          {numberWithCommas(totalPayableAmount, "USD")}
        </div>
      </div>
    </Wrapper>
  );
};

export default PaymentSummary;
