import { TEditUserRequest } from '@/helpers/types/apiRequestResponse';
import { apiClient } from './index';

export default {
  resetPassword: (payload: { email_id: string; otp_id: string; new_password: string }) =>
    apiClient.post('/auth/reset-password', payload).then((r) => {
      if (!r.data.status) {
        throw new Error(r.data.message);
      }
      return r.data;
    }),
};

export const forgotPassword = (email: string) => {
  return apiClient.post('/auth/forgot-password', { email_id: email }).then((r) => r.data);
};

export const changePassword = (formData: any) => {
  return apiClient.post('/auth/change-password', formData).then((r) => r.data);
};

export const getUser = () => {
  return apiClient.get('/user/get').then((r) => r.data);
};

export const editUser = (formData: TEditUserRequest) => {
  return apiClient.put('/user/edit', formData).then((r) => r.data);
};

export const verifyEmailAndPhone = (formData: any) => {
  return apiClient.post('/auth/check-phone-email', formData).then((r) => r.data);
};

export const accountClosure = (formData: any) => {
  return apiClient.post('/user/account-delete/request-send', formData).then((r) => r.data);
};

export const cancelAccountClosure = () => {
  return apiClient.get('/user/account-delete/request-cancel').then((r) => r.data);
};

export const sendVerifyOTP = (formData: any) => {
  return apiClient.post('/auth/otp', formData).then((r) => r.data);
};

export const changeEmail = (formData: any) => {
  return apiClient.post('/auth/update-email', formData).then((r) => r.data);
};

export const logoutApi = () => {
  // eslint-disable-next-line no-console
  return apiClient.get('/auth/logout').catch((e) => console.log('Logout:', e?.message));
};
