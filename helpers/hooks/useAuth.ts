import { useMutation, useQuery } from 'react-query';
import { apiClient } from '@/helpers/http/index';
import { saveAuthStorage, getToken, getStorageUser, clearAuthStorage } from '@/helpers/services/auth';
import { useDispatch } from 'react-redux';
import { setUser, setToken, clearAuth } from '@/store/redux/slices/authSlice';
import { AppDispatch } from '@/store/store';

interface LoginPayload {
  email_id: string;
  password: string;
  stay_signedin: boolean;
  terms_agreement: boolean;
}

interface RegisterPayload {
  email_id: string;
  password: string;
  name: string;
  terms_agreement: boolean;
}

interface TwoFactorPayload {
  formdata: {
    email_id: string;
    otp: string;
    action: string;
    type: string;
  };
  email: string;
}

// Query key factory
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// React Query hooks
export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post('/auth/login', payload);
      if (response.data.status) {
        const { user, token } = response.data.data;
        if (token && user) {
          saveAuthStorage({ token, user });
          dispatch(setUser(user));
          dispatch(setToken(token));
        }
        return response.data.data;
      }
      throw new Error(response.data.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post('/auth/register', payload);
      if (response.data.status) {
        const { user, token } = response.data.data;
        if (token && user) {
          saveAuthStorage({ token, user });
          dispatch(setUser(user));
          dispatch(setToken(token));
        }
        return response.data.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.get('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearAuthStorage();
        dispatch(clearAuth());
      }
    },
  });
};

export const useTwoFactor = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async ({ formdata, email }: TwoFactorPayload) => {
      formdata.email_id = email;
      const response = await apiClient.post('/auth/otp', formdata);
      if (response.data.status) {
        const { user, token } = response.data.data;
        if (token && user) {
          saveAuthStorage({ token, user });
          dispatch(setUser(user));
          dispatch(setToken(token));
        }
        return response.data.data;
      }
      throw new Error(response.data.message || 'Two-factor authentication failed');
    },
  });
};

export const useUser = () => {
  const token = getToken();
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      if (!token) return null;
      
      const response = await apiClient.get('/user/get');
      if (!response.data || !response.data.id) {
        throw new Error('Invalid user data received');
      }
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });
}; 