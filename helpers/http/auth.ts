import { TEditUserRequest } from '@/helpers/types/apiRequestResponse';
import { apiClient } from './index';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import axios from 'axios';
// import { apiClient } from '@/lib/apiClient';

interface UserResponse {
  status: boolean;
  data: IFreelancerDetails & IClientDetails;
  message?: string;
}

const auth = {
  resetPassword: (payload: { email_id: string; otp_id: string; new_password: string }) =>
    apiClient.post('/auth/reset-password', payload).then((r) => {
      if (!r.data.status) {
        throw new Error(r.data.message);
      }
      return r.data;
    }),
};

export default auth;

export const forgotPassword = (email: string) => {
  return apiClient.post('/auth/forgot-password', { email_id: email }).then((r) => r.data);
};

export const changePassword = (formData: { current_password: string; new_password: string }) => {
  return apiClient.post('/auth/change-password', formData).then((r) => r.data);
};

export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await apiClient.get<UserResponse>('/user/get');
    
    // Check if response exists and has data
    if (!response || !response.data) {
      throw new Error('No response data received');
    }

    // Check if response has the expected structure
    if (typeof response.data.status !== 'boolean') {
      throw new Error('Invalid response format: status is missing');
    }

    // If status is false, throw error with message
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to fetch user data');
    }

    // Validate user data
    if (!response.data.data || !response.data.data.id) {
      throw new Error('Invalid user data received');
    }

    // Ensure user data has required fields
    const userData = response.data.data;
    if (!userData.user_type || !userData.email_id) {
      throw new Error('User data is missing required fields');
    }

    return response.data;
  } catch (error) {
    // Handle Axios errors specifically
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Session expired - please login again');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error - please try again later');
      }
      if (!error.response) {
        throw new Error('Network error - please check your connection');
      }
      throw new Error(error.response.data?.message || 'Failed to fetch user data');
    }

    // Handle other errors
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    throw new Error('Failed to fetch user data');
  }
};

export const editUser = (formData: TEditUserRequest) => {
  return apiClient.put('/user/edit', formData).then((r) => r.data);
};

export const verifyEmailAndPhone = (formData: { email_id: string; phone_number: string }) => {
  return apiClient.post('/auth/check-phone-email', formData).then((r) => r.data);
};

export const accountClosure = (formData: { reason: string }) => {
  return apiClient.post('/user/account-delete/request-send', formData).then((r) => r.data);
};

export const cancelAccountClosure = () => {
  return apiClient.get('/user/account-delete/request-cancel').then((r) => r.data);
};

export const sendVerifyOTP = (formData: { email_id: string; otp: string; action: string; type: string }) => {
  return apiClient.post('/auth/otp', formData).then((r) => r.data);
};

export const changeEmail = (formData: { email_id: string; new_email: string }) => {
  return apiClient.post('/auth/update-email', formData).then((r) => r.data);
};

export const logoutApi = () => {
  return apiClient.get('/auth/logout').catch((e) => {
    console.error('Logout error:', e?.message);
    throw e;
  });
};
