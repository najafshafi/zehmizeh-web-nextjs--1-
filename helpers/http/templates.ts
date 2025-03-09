import { TJobDetails } from 'helpers/types/job.type';
import { apiClient } from './index';

export const getClientDashboardStats = () => {
  return apiClient.get(`/client/dashboard`).then((res) => {
    return res.data;
  });
};

export const manageTemplate = (formData: {
  action: string;
  post_template_id: string;
}) => {
  return apiClient.post(`/job/manage-template`, formData).then((res) => {
    return res.data;
  });
};

export type TAddEditTemplatePayload = Partial<TJobDetails> & {
  post_template_id: string;
  action: 'edit_template' | 'add_template';
};

export const AddEditTemplate = (formData: TAddEditTemplatePayload) => {
  return apiClient.post(`/job/manage-template`, formData).then((res) => {
    return res.data;
  });
};
