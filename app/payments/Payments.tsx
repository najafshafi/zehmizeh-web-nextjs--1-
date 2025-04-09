"use client";
import PageTitle from "@/components/styled/PageTitle";
import Spinner from "@/components/forms/Spin/Spinner";
import Tooltip from "@/components/ui/Tooltip";
import Info from "@/public/icons/info-circle-gray.svg";
import PaymentHeader from "./partials/PaymentHeader";
import PaymentRecords from "./partials/PaymentRecords";
import PayoutRecords from "./partials/PayoutRecords";
import {
  usePaymentController,
  getFreelancerStripeBalance,
} from "./PaymentController";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useEffect, useState } from "react";

type TtabKeys = "Transactions" | "Payouts";

function Payments() {
  const { filters, updateFilters } = usePaymentController();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  // AMIT - TotalEarnings was removed after this commit: c5d987ad343cb6ffb3f1b84bd091e38812f9b03a
  const [stripeBalance, setStripeBalance] = useState({
    currency: "",
    depositedToBank: 0,
    inTransitPayment: 0,
    futurePayouts: 0,
  });

  const onTabUpdate = (activeTab: TtabKeys) => {
    updateFilters({ activeTab });
  };

  useEffect(() => {
    if (user?.user_type !== "client") {
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
  const numberWithCommas = (value: number) => {
    return Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: stripeBalance?.currency || "USD",
    });
  };

  return (
    <div className="lg:min-w-[1170px] mb-12 max-w-[1170px] mt-[10px] mx-auto">
      {user?.user_type === "client" ? (
        <>
          <PageTitle className="mt-12 text-center capitalize">
            {user?.first_name}&apos;s Transactions
          </PageTitle>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <PaymentHeader
              onTabUpdate={onTabUpdate as (activeTab: string) => void}
            />
            <PaymentRecords />
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto mt-8 max-w-[1170px] rounded-2xl">
            <PageTitle className="mt-8 text-left capitalize">
              {user?.first_name}&apos;s Transactions
            </PageTitle>
            <div className="mt-4 grid grid-cols-2 gap-6">
              <div className="flex flex-col justify-between rounded-xl shadow-md bg-white p-6 h-[7.75rem]">
                <div className="flex items-center justify-start">
                  <div className="text-lg font-normal opacity-60 leading-[21.6px]">
                    Future Payouts
                  </div>
                  <Tooltip
                    customTrigger={
                      <div className="text-sm mx-1">
                        <Info />
                      </div>
                    }
                  >
                    This is the money that your clients have been already
                    charged and it&apos;s received on your Stripe account. It
                    will be initiated for transfer to your bank account within
                    2-3 working days.
                  </Tooltip>
                </div>
                {!isLoading ? (
                  <div className="text-[32px] font-bold leading-[38.4px] tracking-[0.03em]">
                    {numberWithCommas(stripeBalance?.futurePayouts)}
                  </div>
                ) : (
                  <div className="mt-4">
                    <Spinner />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between rounded-xl shadow-md bg-white p-6 h-[7.75rem]">
                <div className="flex items-center justify-start">
                  <div className="text-lg font-normal opacity-60 leading-[21.6px]">
                    Payment in Transit
                  </div>
                  <Tooltip
                    customTrigger={
                      <div className="text-sm mx-1">
                        <Info />
                      </div>
                    }
                  >
                    This is the money that your clients have been charged that
                    is still being processed by Stripe. See the Payouts tab
                    below for an estimated arrival date.
                  </Tooltip>
                </div>
                {!isLoading ? (
                  <div className="text-[32px] font-bold leading-[38.4px] tracking-[0.03em]">
                    {numberWithCommas(stripeBalance?.inTransitPayment)}
                  </div>
                ) : (
                  <div className="mt-4">
                    <Spinner />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto my-8 max-w-[1170px] bg-white rounded-2xl shadow-[0px_4px_54px_rgba(0,0,0,0.04)]">
            <PaymentHeader
              onTabUpdate={onTabUpdate as (activeTab: string) => void}
            />
            {filters?.activeTab === "Transactions" ? (
              <PaymentRecords />
            ) : (
              <PayoutRecords />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Payments;
