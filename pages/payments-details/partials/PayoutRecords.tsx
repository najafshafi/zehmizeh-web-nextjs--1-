import NoDataFound from "@/components/ui/NoDataFound";
import { formatLocalDate, numberWithCommas } from "@/helpers/utils/misc";
import React from "react";
import Loader from "@/components/Loader";
import PaginationComponent from "@/components/ui/Pagination";
import useResponsive from "@/helpers/hooks/useResponsive";
import PayoutCard from "./PayoutCard";
import classNames from "classnames";
import { usePaymentController } from "../PaymentController";

// Define payout row type
type PayoutRow = {
  payout_id: string | number;
  payment_amount: string | number;
  currency: string;
  bank_detail: {
    bank_name: string;
    last_4_digit: string | number;
  };
  stripe_status: string;
  date_created: string;
  arrival_date: string;
};

// Define the payouts data structure
interface PayoutsData {
  payouts: PayoutRow[];
  totalPages: number;
  currentPage: number;
}

const columns = [
  {
    label: "Amount",
  },
  {
    label: "Bank Name",
  },
  {
    label: "Status",
  },
  {
    label: "Initiated Date",
  },
  {
    label: "Estimated Arrival Date",
  },
];

function PayoutRecords() {
  const { isMobile } = useResponsive();
  const { payouts, isLoadingPayouts, updateFilters } = usePaymentController();
  const payoutsData = payouts as unknown as PayoutsData;

  if (!payoutsData?.payouts?.length && !isLoadingPayouts) {
    return (
      <div className="py-12">
        <NoDataFound title="No payouts found" />
      </div>
    );
  }
  if (isLoadingPayouts) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="m-3">
      {!isMobile
        ? payoutsData?.payouts?.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="w-full table">
                <thead className="bg-[rgba(29,30,27,0.1)]">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.label}
                        className="text-left p-3 font-normal text-sm uppercase"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:min-h-[60px] [&>tr>td]:h-[60px] [&>tr>td]:align-middle [&>tr>td]:border-[#f5f5f5]">
                  {(payoutsData?.payouts || []).map((row: PayoutRow) => (
                    <tr
                      key={row.payout_id}
                      className={classNames(
                        "border-b border-gray-500/20 text-base",
                        {
                          "bg-[#fff1f1]": row?.stripe_status === "pending",
                        }
                      )}
                    >
                      <td className="px-3">
                        <span className="font-bold">
                          {numberWithCommas(row?.payment_amount, row?.currency)}
                        </span>
                      </td>
                      <td className="px-3">
                        {row?.bank_detail?.bank_name}
                        {"****"}
                        {row?.bank_detail?.last_4_digit}
                      </td>
                      <td className="capital-first-ltr px-3">
                        {row?.stripe_status === "paid"
                          ? "Deposited"
                          : row?.stripe_status?.replace("_", " ")}
                      </td>
                      <td className="px-3">
                        {formatLocalDate(row?.date_created, "MMM D, YYYY")}
                      </td>
                      <td className="px-3">
                        {formatLocalDate(row?.arrival_date, "MMM D, YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        : payoutsData?.payouts?.length > 0 &&
          (payoutsData?.payouts || []).map((row: PayoutRow) => (
            <PayoutCard key={row.payout_id} data={row} />
          ))}
      {payoutsData?.totalPages && payoutsData.totalPages > 0 && (
        <div className="flex items-center justify-center w-full mx-auto py-3">
          <PaginationComponent
            total={payoutsData.totalPages || 0}
            onPageChange={(page) => updateFilters({ page: page.selected + 2 })}
            currentPage={payoutsData.currentPage || 0}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(PayoutRecords);
