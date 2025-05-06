
import Tooltip from "@/components/ui/Tooltip";
import Info from "@/public/icons/info-circle-gray.svg";
import { numberWithCommas } from "@/helpers/utils/misc";
import { usePayments } from "../../controllers/usePayments";

const PaymentSummary = () => {
  const {
    amount,
    selectedPaymentMethod,
    zehMizehCharge,
    totalPayableAmount,
    jobType,
  } = usePayments();

  return (
    <div>
      <div className="border-t border-[#d9d9d9] mt-5 pt-4">
        <div className="fs-1rem fw-700 flex items-center justify-between mt-1">
          <span className="text-[#858585] fs-1rem font-normal">
            {jobType === "hourly"
              ? "Price for Hours Submitted"
              : "Milestone Amount"}
          </span>
          {numberWithCommas(amount, "USD")}
        </div>
        <div className="fs-1rem fw-700 flex items-center justify-between mt-1">
          <span className="text-[#858585] fs-1rem font-normal">
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
        <div className="fs-24 fw-700 flex items-center justify-between mt-3 pt-2 border-t border-[#d9d9d9]">
          <span className="text-[#858585] fs-1rem font-normal">Total</span>
          {numberWithCommas(totalPayableAmount, "USD")}
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
