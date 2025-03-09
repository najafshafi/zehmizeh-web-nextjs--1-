import { apiClient } from './index';

export const postAJob = (formData: any) => {
  return apiClient.post(`/job/save`, formData).then((res) => res.data);
};

export const editJobBudget = (formData: {
  job_post_id: string;
  amount: string;
}) => {
  return apiClient.post(`/job/save`, formData).then((res) => res.data);
};

export const increaseBudgetAcceptOrDecline = (formData: {
  job_post_id: string;
}) => {
  return apiClient.post('/job/save', formData).then((res) => res.data);
};

export const editJobDueDate = (formData: {
  job_post_id: string;
  due_date: string;
}) => {
  return apiClient.post(`/job/save`, formData).then((res) => res.data);
};

export const getMyJobs = (
  status: any,
  keyword?: string,
  freelancerId?: string
) => {
  return apiClient
    .post(`/my-jobs?page=1&limit=100`, { status, keyword, freelancerId })
    .then((res) => res.data);
};

export const getPostTemplates = (keyword: any) => {
  return apiClient
    .post(`/job/template/list?page=1&limit=100&keyword=${keyword}`, { status })
    .then((res) => res.data);
};
