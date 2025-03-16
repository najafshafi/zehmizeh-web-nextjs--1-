"use client"
import { apiClient } from '@/helpers/http';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const getFreelancerStripeBalance = () =>
  apiClient
    .get(`/payment/balance/get`)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err?.response?.data);
    });

const getPayoutList = ({ queryKey }: { queryKey: any[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, page, limit] = queryKey;
  const payload: any = {
    limit,
    page: page || 1,
  };

  return apiClient
    .post(`/payment/payouts-list`, payload)
    .then((res) => {
      const totalPages = res.data?.data?.total ? Math.ceil(res.data?.data?.total / limit) : 0;
      return { ...res.data?.data, totalPages, currentPage: payload.page };
    })
    .catch((err) => {
      throw new Error(err?.response?.data);
    });
};

const getPaymentList = ({ queryKey }: { queryKey: any[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, jobId, filter, page, limit] = queryKey;
  const payload: any = {
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
      const totalPages = res.data?.data?.total ? Math.ceil(res.data?.data?.total / limit) : 0;
      return { ...res.data?.data, totalPages, currentPage: payload.page };
    })
    .catch((err) => {
      throw new Error(err?.response?.data);
    });
};

const getJobs = () =>
  apiClient
    .post(`/job/manage-dispute`, {
      action: 'get_project',
      is_transactions: true,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err?.response?.data);
    });

const PaymentControllerContext = React.createContext<any>(null);

const PaymentControllerProvider = ({ children }: any) => {
  const [filters, setFilters] = useState({
    filter: 'alltime',
    job_post_id: '',
    page: 1,
    limit: 10,
    activeTab: 'Transactions',
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery(
    ['PAYMENT_LIST', filters.job_post_id, filters.filter, filters.page, filters.limit],
    getPaymentList,
    {
      enabled: (!!filters.job_post_id || !!filters.filter) && filters.activeTab === 'Transactions',
      keepPreviousData: true,
    }
  );

  const { data: payouts, isLoading: isLoadingPayouts } = useQuery(
    ['PAYOUT_LIST', filters.page, filters.limit],
    getPayoutList,
    {
      enabled: filters.activeTab === 'Payouts',
      keepPreviousData: true,
    }
  );

  const updateFilters = React.useCallback(
    (newFilters) => {
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
    [filters, isLoadingPayments, isLoadingPayouts, payments, payouts, updateFilters]
  );
  return <PaymentControllerContext.Provider value={value}>{children}</PaymentControllerContext.Provider>;
};

function usePaymentController() {
  return React.useContext(PaymentControllerContext);
}

export const useJobOptions = () => {
  const { data: jobList } = useQuery('JOB_LIST', getJobs);
  return jobList?.data;
};

export { usePaymentController, PaymentControllerProvider, getFreelancerStripeBalance };
