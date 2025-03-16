"use client"
import PageTitle from '@/components/styled/PageTitle';
import Spinner from "@/components/forms/Spin/Spinner"
import styled from 'styled-components';
import Tooltip from '@/components/ui/Tooltip';
import Info from '@/public/icons/info-circle-gray.svg';
import { breakpoints } from '@/helpers/hooks/useResponsive';
import PaymentHeader from './partials/PaymentHeader';
import PaymentRecords from './partials/PaymentRecords';
import PayoutRecords from './partials/PayoutRecords';
import { usePaymentController, getFreelancerStripeBalance } from './PaymentController';
import { useAuth } from '@/helpers/contexts/auth-context';
import { useEffect, useState } from 'react';

const PaymentContainer = styled.div`
  background: ${(props) => props.theme.colors.white};
  margin: 2rem auto;
  max-width: 1170px;
  box-shadow: 0px 4px 54px rgba(0, 0, 0, 0.04);
  border-radius: 1rem;
`;

const TitleStatsContainer = styled.div`
  margin: 2rem auto;
  max-width: 1170px;
  border-radius: 1rem;
`;

const StatBlock = styled.div`
  height: 7.75rem;
  border-radius: 0.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.08);
  background: ${(props) => props.theme.colors.white};
  padding: 1.5rem;
  .stat-label {
    opacity: 0.6;
    line-height: 21.6px;
  }
  .stat-value {
    line-height: 38.4px;
    letter-spacing: 0.03em;
  }
  @media ${breakpoints.mobile} {
    margin-bottom: 2rem;
    padding: 1rem;
    .stat-value {
      font-size: 1.25rem;
    }
  }
`;

type TtabKeys = 'Transactions' | 'Payouts';

function Payments() {
  const { filters, updateFilters } = usePaymentController();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  // AMIT - TotalEarnings was removed after this commit: c5d987ad343cb6ffb3f1b84bd091e38812f9b03a
  const [stripeBalance, setStripeBalance] = useState({
    currency: '',
    depositedToBank: 0,
    inTransitPayment: 0,
    futurePayouts: 0,
  });

  const onTabUpdate = (activeTab: TtabKeys) => {
    updateFilters({ activeTab });
  };

  useEffect(() => {
    if (user?.user_type !== 'client') {
      const stripeBalancePromise = getFreelancerStripeBalance();
      stripeBalancePromise.then((res) => {
        if (res.data) {
          setStripeBalance(res?.data);
          setIsLoading(false);
        }
      });
    }
  }, []);

  // convert currency with their currency symbol
  const numberWithCommas = (value) => {
    return Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: stripeBalance?.currency || 'USD',
    });
  };

  return (
    <div className="lg:container mb-12 max-w-[1170px] mt-[10px] mx-auto">
  {user?.user_type === 'client' ? (
    <>
      <PageTitle className="mt-12 text-center capitalize">
        {user?.first_name}’s Transactions
      </PageTitle>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <PaymentHeader onTabUpdate={onTabUpdate} />
        <PaymentRecords />
      </div>
    </>
  ) : (
    <>
      <TitleStatsContainer>
        <PageTitle className="mt-8 text-left capitalize ">
          {user?.first_name}’s Transactions
        </PageTitle>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <StatBlock className="flex flex-col justify-between rounded-lg shadow-md p-4 bg-white">
            <div className="flex items-center justify-start">
              <div className="stat-label text-lg font-normal">Future Payouts</div>
              <Tooltip
                customTrigger={
                  <div className="text-sm mx-1">
                    <Info />
                  </div>
                }
              >
                This is the money that your clients have been already charged and it’s received on your Stripe account. It will be initiated for transfer to your bank account within 2-3 working days.
              </Tooltip>
            </div>
            {!isLoading ? (
              <div className="stat-value text-[32px] font-bold">
                {numberWithCommas(stripeBalance?.futurePayouts)}
              </div>
            ) : (
              <div className="mt-4">
                <Spinner />
              </div>
            )}
          </StatBlock>
          <StatBlock className="flex flex-col justify-between rounded-lg shadow-md p-4 bg-white">
            <div className="flex items-center justify-start">
              <div className="stat-label text-lg font-normal">Payment in Transit</div>
              <Tooltip
                customTrigger={
                  <div className="text-sm mx-1">
                    <Info />
                  </div>
                }
              >
                This is the money that your clients have been charged that is still being processed by Stripe. See the Payouts tab below for an estimated arrival date.
              </Tooltip>
            </div>
            {!isLoading ? (
              <div className="stat-value text-[32px] font-bold">
                {numberWithCommas(stripeBalance?.inTransitPayment)}
              </div>
            ) : (
              <div className="mt-4">
                <Spinner />
              </div>
            )}
          </StatBlock>
        </div>
      </TitleStatsContainer>
      <PaymentContainer>
        <PaymentHeader onTabUpdate={onTabUpdate} />
        {filters?.activeTab === 'Transactions' ? <PaymentRecords /> : <PayoutRecords />}
      </PaymentContainer>
    </>
  )}
</div>
  );
}

export default Payments;
