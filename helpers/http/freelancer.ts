import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { apiClient } from './index';

export const getFreelancerDetails: (freelancerId: string) => Promise<{ data: IFreelancerDetails }> = (
  freelancerId: string
) => {
  return apiClient.get(`/user/get-details/${freelancerId}`).then((res) => {
    return res.data;
  });
};

export const getFreelancerDashboardStats = () => {
  return apiClient.get(`/freelancer/dashboard`).then((res) => {
    return res.data;
  });
};

export const getProposals = (status: string) => {
  return apiClient
    .post(`/freelancer/dashboard/proposal`, {
      action: status,
      page: 1,
      limit: 100,
    })
    .then((res) => {
      return res.data;
    });
};

export const getJobs = (status: string) => {
  return apiClient
    .post(`/freelancer/dashboard/jobs`, {
      action: status,
      page: 1,
      limit: 100,
    })
    .then((res) => {
      return res.data;
    });
};

export const getMyAllJobs = (formData: {
  status: string;
  text?: string;
  page?: number;
  limit?: number;
  filter?: string;
}) => {
  return apiClient.post(`/job/freelancer/get`, formData).then((res) => {
    return res.data;
  });
};

export const manageEducation = (formData: any) => {
  return apiClient.post('/user/manage-education', formData).then((r) => r.data);
};

export const manageCourse = (formData: any) => {
  return apiClient.post('/user/manage-course', formData).then((r) => r.data);
};

export const getStripeAccountStatus = () => {
  return apiClient.get('/payment/account-status').then((r) => r.data);
};

export const getStripeVerificationLink = (preferred_country_short_name?: string) => {
  return apiClient.post('/payment/get-verify-link', { preferred_country_short_name }).then((r) => r.data);
};

export const managePayment = (formData: any) => {
  return apiClient.post('/payment/manage-bank-account', formData).then((r) => r.data);
};

export const resetStripeHandler = () => {
  return apiClient.post('/payment/reset-stripe').then((r) => r.data);
};
