import NoDataFound from '@/components/ui/NoDataFound';
import { convertToTitleCase, formatLocalDate, numberWithCommas, pxToRem } from '@/helpers/utils/misc';
import React from 'react';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';
import { usePaymentController } from '../PaymentController';
import Loader from '@/components/Loader';
import PaginationComponent from '@/components/ui/Pagination';
import InvoiceModal from './InvoiceModal';
import Link from 'next/link';
import useResponsive from '@/helpers/hooks/useResponsive';
import PaymentCard from './PaymentCard';
import classNames from 'classnames';

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
    label: 'Project name',
  },
  {
    label: 'Milestone/Hours Name',
  },
  {
    label: 'Received on',
  },
  {
    label: 'Amount',
  },
  {
    label: 'Action',
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
            <Table responsive>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments?.payments.map((row) => (
                  <tr
                    key={row.stripe_txn_id}
                    className={classNames('', {
                      'refund-row': row.payment_type === 'refund',
                    })}
                  >
                    <td className="align-top capitalize-first-ltr">{convertToTitleCase(row.jobdata?.job_title)}</td>
                    <td className="capitalize-first-ltr align-top">
                      {row?.milestone &&
                        Array.isArray(row?.milestone) &&
                        row?.milestone?.map((ml: any) => (
                          <p className="mb-0" key={`transcation-milestone-${ml?.milestone_id}`}>
                            {ml?.title}
                          </p>
                        ))}
                    </td>
                    <td className="align-top">{formatLocalDate(row?.date_created, 'MMM D, YYYY')}</td>
                    <td className="align-top">
                      <b>{numberWithCommas(row?.amount, 'USD')}</b>
                    </td>
                    <td className="align-top">
                      <Link href={`/invoice/${row?.charge_trans_id}`}>
                        <Button className="download-btn fs-1rem p-0" variant="link">
                          Download Invoice
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        : payments?.payments?.length &&
          payments?.payments.map((row) => <PaymentCard key={row.stripe_txn_id} data={row} />)}

      {payments?.totalPages > 0 && (
        <div className="flex items-center justify-center">
          <PaginationComponent
            total={payments?.totalPages}
            onPageChange={(page) => updateFilters({ page: page.selected + 1 })}
            currentPage={payments?.currentPage}
          />
        </div>
      )}
      <InvoiceModal show={invoiceModal.show} onClose={onInvoiceModalClose} data={invoiceModal.data} />
    </Wrapper>
  );
}

export default React.memo(PaymentRecords);
