import { apiClient } from './index';

export const getNotifications = () => {
  return apiClient.get('/general/get-notification').then((r) => r.data);
};

export const readNotification = (formData: any) => {
  return apiClient
    .post('/general/read-notification', formData)
    .then((r) => r.data);
};
