import { TEditUserRequest } from '@/helpers/types/apiRequestResponse';
import { apiClient } from './index';
import { LoginPayload, RegisterPayload, AuthResponse, TwoFactorPayload, ApiResponse } from '@/helpers/types/auth.type';
import { AxiosError } from 'axios';
// import { apiClient } from '@/lib/apiClient';

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
  return apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email_id: email }).then((r) => r.data);
};

export const changePassword = (formData: { old_password: string; new_password: string }) => {
  return apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', formData).then((r) => r.data);
};

export const getUser = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<AuthResponse>>('/user/get');
    return response.data.data;
  } catch (error) {
    console.log('[Auth API] Get user error:', error);
    throw error;
  }
};

export const editUser = (formData: TEditUserRequest) => {
  return apiClient.put<ApiResponse<{ message: string }>>('/user/edit', formData).then((r) => r.data);
};

export const verifyEmailAndPhone = (formData: { email_id: string; phone: string }) => {
  return apiClient.post<ApiResponse<{ message: string }>>('/auth/check-phone-email', formData).then((r) => r.data);
};

export const accountClosure = (formData: { reason: string }) => {
  return apiClient.post<ApiResponse<{ message: string }>>('/user/account-delete/request-send', formData).then((r) => r.data);
};

export const cancelAccountClosure = () => {
  return apiClient.get<ApiResponse<{ message: string }>>('/user/account-delete/request-cancel').then((r) => r.data);
};

export const sendVerifyOTP = (formData: TwoFactorPayload) => {
  return apiClient.post<ApiResponse<{ message: string }>>('/auth/otp', formData).then((r) => r.data);
};

export const changeEmail = (formData: { email_id: string; new_email: string }) => {
  return apiClient.post<ApiResponse<{ message: string }>>('/auth/update-email', formData).then((r) => r.data);
};

export const logoutApi = async (): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout');
  } catch (error) {
    console.log('[Auth API] Logout error:', error);
    throw error;
  }
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log('[Auth API] Attempting login with payload:', {
      email_id: payload.email_id,
      terms_agreement: payload.terms_agreement,
      stay_signedin: payload.stay_signedin,
    });

    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    
    console.log('[Auth API] Login response:', {
      status: response.data.status,
      message: response.data.message,
      hasToken: !!response.data.data.token,
      userType: response.data.data.user_type,
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
    console.log('[Auth API] Login error:', {
      error: axiosError,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      message: axiosError.message,
    });
    throw error;
  }
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return response.data.data;
  } catch (error) {
    console.log('[Auth API] Register error:', error);
    throw error;
  }
};

export const twoFactor = async (payload: TwoFactorPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/otp', payload);
    return response.data.data;
  } catch (error) {
    console.log('[Auth API] Two-factor error:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data.data;
  } catch (error) {
    console.log('[Auth API] Refresh token error:', error);
    throw error;
  }
};
