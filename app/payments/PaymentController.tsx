"use client";
import { apiClient } from "@/helpers/http";
import React, { useState, ReactNode } from "react";
import { useQuery, QueryFunctionContext } from "react-query";

const getFreelancerStripeBalance = () =>
  apiClient
    .get(`/payment/balance/get`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err?.response?.data);
    });

// Define types for payloads
type PayoutPayload = {
  limit: number;
  page: number;
};

// Using a more generic approach to avoid complex type issues with QueryFunctionContext
const getPayoutList = (context: QueryFunctionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, page, limit] = context.queryKey as readonly [
    string,
    number,
    number,
  ];
  const payload: PayoutPayload = {
    limit,
    page: page || 1,
  };

  return apiClient
    .post(`/payment/payouts-list`, payload)
    .then((res) => {
      const totalPages = res.data?.data?.total
        ? Math.ceil(res.data?.data?.total / limit)
        : 0;
      return { ...res.data?.data, totalPages, currentPage: payload.page };
    })
    .catch((err) => {
      throw new Error(err?.response?.data);
    });
};

type PaymentPayload = {
  filter: string;
  limit: number;
  page: number;
  job_post_id?: string;
};

// Using a more generic approach for QueryFunctionContext
const getPaymentList = (context: QueryFunctionContext) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, jobId, filter, page, limit] = context.queryKey as readonly [
    string,
    string | undefined,
    string,
    number,
    number,
  ];
  const payload: PaymentPayload = {
    filter,
    limit,
    page: page || 1,
  };
  if (jobId) {
    payload.job_post_id = jobId;
  }
  return apiClient
    .post(`/payment/get-list`, payload)
    .then((res) => {
      const totalPages = res.data?.data?.total
        ? Math.ceil(res.data?.data?.total / limit)
        : 0;
      return { ...res.data?.data, totalPages, currentPage: payload.page };
    })
    .catch((err) => {
      throw new Error(err?.response?.data);
    });
};

const getJobs = () =>
  apiClient
    .post(`/job/manage-dispute`, {
      action: "get_project",
      is_transactions: true,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err?.response?.data);
    });

// Define more specific types for payments and payouts
interface PaymentData {
  results: unknown[];
  total: number;
  totalPages: number;
  currentPage: number;
  [key: string]: unknown;
}

// Define types for payment controller context
interface PaymentControllerContextType {
  payments: PaymentData | undefined;
  payouts: PaymentData | undefined;
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  isLoadingPayments: boolean;
  isLoadingPayouts: boolean;
}

interface FilterState {
  filter: string;
  job_post_id: string;
  page: number;
  limit: number;
  activeTab: string;
}

const PaymentControllerContext =
  React.createContext<PaymentControllerContextType | null>(null);

interface PaymentControllerProviderProps {
  children: ReactNode;
}

const PaymentControllerProvider = ({
  children,
}: PaymentControllerProviderProps) => {
  const [filters, setFilters] = useState<FilterState>({
    filter: "alltime",
    job_post_id: "",
    page: 1,
    limit: 10,
    activeTab: "Transactions",
  });

  const { data: payments, isLoading: isLoadingPayments } =
    useQuery<PaymentData>(
      [
        "PAYMENT_LIST",
        filters.job_post_id,
        filters.filter,
        filters.page,
        filters.limit,
      ],
      getPaymentList,
      {
        enabled:
          (!!filters.job_post_id || !!filters.filter) &&
          filters.activeTab === "Transactions",
        keepPreviousData: true,
      }
    );

  const { data: payouts, isLoading: isLoadingPayouts } = useQuery<PaymentData>(
    ["PAYOUT_LIST", filters.page, filters.limit],
    getPayoutList,
    {
      enabled: filters.activeTab === "Payouts",
      keepPreviousData: true,
    }
  );

  const updateFilters = React.useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters({ ...filters, ...newFilters });
    },
    [filters]
  );

  const value = React.useMemo(
    () => ({
      payments,
      payouts,
      filters,
      updateFilters,
      isLoadingPayments,
      isLoadingPayouts,
    }),
    [
      filters,
      isLoadingPayments,
      isLoadingPayouts,
      payments,
      payouts,
      updateFilters,
    ]
  );
  return (
    <PaymentControllerContext.Provider value={value}>
      {children}
    </PaymentControllerContext.Provider>
  );
};

function usePaymentController(): PaymentControllerContextType {
  const context = React.useContext(PaymentControllerContext);
  if (!context) {
    throw new Error(
      "usePaymentController must be used within a PaymentControllerProvider"
    );
  }
  return context;
}

export const useJobOptions = () => {
  const { data: jobList } = useQuery("JOB_LIST", getJobs);
  return jobList?.data;
};

export {
  usePaymentController,
  PaymentControllerProvider,
  getFreelancerStripeBalance,
};
