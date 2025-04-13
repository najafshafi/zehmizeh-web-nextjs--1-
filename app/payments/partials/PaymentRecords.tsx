import NoDataFound from "@/components/ui/NoDataFound";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
} from "@/helpers/utils/misc";
import React from "react";
import { usePaymentController } from "../PaymentController";
import Loader from "@/components/Loader";
import PaginationComponent from "@/components/ui/Pagination";
import InvoiceModal from "./InvoiceModal";
import Link from "next/link";
import useResponsive from "@/helpers/hooks/useResponsive";
import PaymentCard from "./PaymentCard";
import classNames from "classnames";

// Define payment row type
type PaymentRow = {
  stripe_txn_id: string | number;
  jobdata: {
    job_title: string;
  };
  milestone:
    | Array<{
        milestone_id: string | number;
        title: string;
      }>
    | {
        title: string;
      };
  date_created: string;
  amount: string | number;
  charge_trans_id: string | number;
  payment_type: string;
};

// Type for PaymentCard props
type PaymentCardData = {
  jobdata: {
    job_title: string;
  };
  milestone: {
    title: string;
  };
  date_created: string;
  amount: string | number;
  charge_trans_id: string | number;
  payment_type: string;
};

// Define the payments data structure
interface PaymentsData {
  payments: PaymentRow[];
  totalPages: number;
  currentPage: number;
}

// Function to adapt payment row to PaymentCard data format
const adaptToPaymentCardData = (row: PaymentRow): PaymentCardData => {
  const milestone = Array.isArray(row.milestone)
    ? { title: row.milestone[0]?.title || "" }
    : row.milestone;

  return {
    ...row,
    milestone,
  };
};

const columns = [
  {
    label: "Project name",
  },
  {
    label: "Milestone/Hours Name",
  },
  {
    label: "Received on",
  },
  {
    label: "Amount",
  },
  {
    label: "Action",
  },
];

function PaymentRecords() {
  const { isMobile } = useResponsive();
  const { payments, isLoadingPayments, updateFilters } = usePaymentController();
  const paymentsData = payments as unknown as PaymentsData;
  const [invoiceModal, setInvoiceModal] = React.useState({
    show: false,
    data: null,
  });

  const onInvoiceModalClose = () => {
    setInvoiceModal({ show: false, data: null });
  };

  if (!paymentsData?.payments?.length && !isLoadingPayments) {
    return (
      <div className="py-12">
        <NoDataFound title="No payments found" />
      </div>
    );
  }

  if (isLoadingPayments) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="m-3">
      {!isMobile
        ? paymentsData?.payments?.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="w-full table border-collapse">
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
                  {(paymentsData?.payments || []).map((row: PaymentRow) => (
                    <tr
                      key={row.stripe_txn_id}
                      className={classNames("border-b border-gray-500/20", {
                        "bg-[#fff1f1]": row.payment_type === "refund",
                      })}
                    >
                      <td className="p-3 align-top capitalize-first-ltr">
                        {convertToTitleCase(row.jobdata?.job_title)}
                      </td>
                      <td className="p-3 capitalize-first-ltr align-top">
                        {row?.milestone &&
                          Array.isArray(row?.milestone) &&
                          row?.milestone?.map((ml) => (
                            <p
                              className="mb-0"
                              key={`transcation-milestone-${ml?.milestone_id}`}
                            >
                              {ml?.title}
                            </p>
                          ))}
                      </td>
                      <td className="p-3 align-top">
                        {formatLocalDate(
                          row?.date_created || "",
                          "MMM D, YYYY"
                        )}
                      </td>
                      <td className="p-3 align-top">
                        <span className="font-bold">
                          {numberWithCommas(row?.amount, "USD")}
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <Link href={`/invoice/${row?.charge_trans_id}`}>
                          <button className="text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none text-base p-0">
                            Download Invoice
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        : paymentsData?.payments?.length > 0 &&
          (paymentsData?.payments || []).map((row: PaymentRow) => (
            <PaymentCard
              key={row.stripe_txn_id}
              data={adaptToPaymentCardData(row)}
            />
          ))}

      {paymentsData?.totalPages && paymentsData.totalPages > 0 && (
        <div className="flex items-center justify-center w-full mx-auto py-3">
          <PaginationComponent
            total={paymentsData.totalPages || 0}
            onPageChange={(page) => updateFilters({ page: page.selected + 1 })}
            currentPage={paymentsData.currentPage || 0}
          />
        </div>
      )}
      <InvoiceModal show={invoiceModal.show} onClose={onInvoiceModalClose} />
    </div>
  );
}

export default React.memo(PaymentRecords);
