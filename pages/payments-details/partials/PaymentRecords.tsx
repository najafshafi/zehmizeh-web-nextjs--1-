import NoDataFound from "@/components/ui/NoDataFound";
import {
  convertToTitleCase,
  formatLocalDate,
  numberWithCommas,
  pxToRem,
} from "@/helpers/utils/misc";
import React from "react";
import styled from "styled-components";
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

// Function to adapt payment row to PaymentCard data format
const adaptToPaymentCardData = (row: PaymentRow): PaymentCardData => {
  // If milestone is an array, extract the first milestone's title
  const milestone = Array.isArray(row.milestone)
    ? { title: row.milestone[0]?.title || "" }
    : row.milestone;

  return {
    ...row,
    milestone,
  };
};

const Wrapper = styled.div`
  margin: 12px;
  thead {
    background: rgba(29, 30, 27, 0.1);
    th,
    td {
      text-transform: uppercase;
      font-size: ${pxToRem(14)};
      padding: 12px;
      font-weight: 400;
    }
  }
  .table > :not(:first-child) {
    border-top: none;
  }
  tbody {
    th,
    td {
      min-height: ${pxToRem(60)};
      height: ${pxToRem(60)};
      vertical-align: middle;
      border-color: #f5f5f5;
    }
  }
  .download-btn {
    color: ${(props) => props.theme.colors.lightBlue};
  }
  .card-label {
    color: ${(props) => props.theme.colors.gray8};
  }
  .refund-row {
    background: #fff1f1;
  }
`;

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
  const [invoiceModal, setInvoiceModal] = React.useState({
    show: false,
    data: null,
  });
  const onInvoiceModalClose = () => {
    setInvoiceModal({ show: false, data: null });
  };
  // const onInvoiceModalShow = (data) => {
  //   setInvoiceModal({ show: true, data });
  // };
  if (!payments?.payments?.length && !isLoadingPayments) {
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
    <Wrapper>
      {!isMobile
        ? payments?.payments?.length > 0 && (
            <div className="overflow-x-auto w-full">
              <table className="w-full table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.label} className="text-left">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments?.payments.map((row: PaymentRow) => (
                    <tr
                      key={row.stripe_txn_id}
                      className={classNames("", {
                        "refund-row": row.payment_type === "refund",
                      })}
                    >
                      <td className="align-top capitalize-first-ltr">
                        {convertToTitleCase(row.jobdata?.job_title)}
                      </td>
                      <td className="capitalize-first-ltr align-top">
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
                      <td className="align-top">
                        {formatLocalDate(
                          row?.date_created || "",
                          "MMM D, YYYY"
                        )}
                      </td>
                      <td className="align-top">
                        <span className="font-bold">
                          {numberWithCommas(row?.amount, "USD")}
                        </span>
                      </td>
                      <td className="align-top">
                        <Link href={`/invoice/${row?.charge_trans_id}`}>
                          <button className="download-btn text-base p-0 text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none">
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
        : payments?.payments?.length &&
          payments?.payments.map((row: PaymentRow) => (
            <PaymentCard
              key={row.stripe_txn_id}
              data={adaptToPaymentCardData(row)}
            />
          ))}

      {payments?.totalPages > 0 && (
        <div className="flex items-center justify-center">
          <PaginationComponent
            total={payments?.totalPages}
            onPageChange={(page) => updateFilters({ page: page.selected + 1 })}
            currentPage={payments?.currentPage}
          />
        </div>
      )}
      <InvoiceModal
        show={invoiceModal.show}
        onClose={onInvoiceModalClose}
        data={invoiceModal.data}
      />
    </Wrapper>
  );
}

export default React.memo(PaymentRecords);
