import NoDataFound from '@/components/ui/NoDataFound';
import { formatLocalDate, numberWithCommas, pxToRem } from '@/helpers/utils/misc';
import React from 'react';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';
import { usePaymentController } from '../PaymentController';
import Loader from '@/components/Loader';
import PaginationComponent from '@/components/ui/Pagination';
import useResponsive from '@/helpers/hooks/useResponsive';
import PayoutCard from './PayoutCard';
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
    label: 'Amount',
  },
  {
    label: 'Bank Name',
  },
  {
    label: 'Status',
  },
  {
    label: 'Initiated Date',
  },
  {
    label: 'Estimated Arrival Date',
  },
];

function PayoutRecords() {
  const { isMobile } = useResponsive();
  const { payouts, isLoadingPayouts, updateFilters } = usePaymentController();

  if (!payouts?.payouts?.length && !isLoadingPayouts) {
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
    <Wrapper>
      {!isMobile
        ? payouts?.payouts?.length > 0 && (
            <Table responsive>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payouts?.payouts.map((row) => (
                  <tr
                    key={row.payout_id}
                    className={classNames('', {
                      'refund-row': row?.stripe_status === 'pending',
                    })}
                  >
                    <td>
                      <b>{numberWithCommas(row?.payment_amount, row?.currency)}</b>
                    </td>
                    <td>
                      {row?.bank_detail?.bank_name}
                      {'****'}
                      {row?.bank_detail?.last_4_digit}
                    </td>
                    <td className="capital-first-ltr">
                      {row?.stripe_status === 'paid' ? 'Deposited' : row?.stripe_status?.replace('_', ' ')}
                    </td>
                    <td>{formatLocalDate(row?.date_created, 'MMM D, YYYY')}</td>
                    <td>{formatLocalDate(row?.arrival_date, 'MMM D, YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        : payouts?.payouts?.length && payouts?.payouts.map((row) => <PayoutCard key={row.payout_id} data={row} />)}
      {payouts?.totalPages > 0 && (
        <div className="flex items-center justify-center">
          <PaginationComponent
            total={payouts?.totalPages}
            onPageChange={(page) => updateFilters({ page: page.selected + 1 })}
            currentPage={payouts?.currentPage}
          />
        </div>
      )}
    </Wrapper>
  );
}

export default React.memo(PayoutRecords);
