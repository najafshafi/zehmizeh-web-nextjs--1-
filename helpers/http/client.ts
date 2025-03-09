import { apiClient } from './index';

export const getMyAllJobs = (formData: {
  status: string;
  page?: number;
  limit?: number;
  text?: string;
}) => {
  return apiClient.post(`/job/client/get`, formData).then((res) => {
    return res.data;
  });
};

export const deleteJob = (job_id: any) => {
  return apiClient.delete(`/job/delete/${job_id}`).then((res) => res.data);
};

export const getClientDashboardStats = () => {
  return apiClient.get(`/client/dashboard`).then((res) => {
    return res.data;
  });
};

export const getReceivedProposals = ({
  page,
  limit,
  keyword = '',
}: {
  page: number;
  limit: number;
  keyword?: string;
}) => {
  return apiClient
    .post(`/client/dashboard/proposal`, {
      action: 'received',
      page,
      limit,
      keyword,
    })
    .then((res) => {
      return res.data;
    });
};

export const getDashboardJobs = (action: string) => {
  return apiClient
    .post(`/client/dashboard/jobs`, {
      action,
      page: 1,
      limit: 100,
    })
    .then((res) => {
      return res.data;
    });
};

export const getDashboardFreelancers = (action: string) => {
  return apiClient
    .post(`/client/dashboard/freelancer`, {
      action,
      page: 1,
      limit: 100,
    })
    .then((res) => {
      return res.data;
    });
};

export const deleteCard = (userCardId: string) => {
  return apiClient
    .post(`/payment/manage-card`, {
      action: 'delete_card',
      user_card_id: userCardId,
    })
    .then((res) => {
      return res.data;
    });
};

export const addCard = (tokenId: string) => {
  return apiClient
    .post(`/payment/manage-card`, {
      action: 'add_card',
      tokenId: tokenId,
    })
    .then((res) => {
      return res.data;
    });
};

export const getCards = () => {
  return apiClient
    .post(`/payment/manage-card`, {
      action: 'get_card',
    })
    .then((res) => {
      return res.data;
    });
};

export const getBankAccounts = () => {
  return apiClient
    .post(`/payment/manage-bank-account`, {
      action: 'get_account',
    })
    .then((r) => r.data);
};

export const deleteBankAccount = (formData: any) => {
  return apiClient
    .post('/payment/manage-bank-account', formData)
    .then((r) => r.data);
};

export const verifyBankAccountForACH = (formData: any) => {
  return apiClient
    .post('/payment/customer/account-verify', formData)
    .then((r) => r.data);
};

export const checkUserHasPaymentMethod = () => {
  return apiClient.get('/payment/check-cards-account').then((r) => r.data);
};
