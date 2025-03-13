import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/helpers/http/index';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import { getToken } from '@/helpers/services/auth';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import { AxiosError } from 'axios';

// Types for API responses
interface AuthResponse {
  user: IFreelancerDetails & IClientDetails;
  token: string;
  user_type: 'freelancer' | 'client';
  user_id: string;
  email_id: string;
  first_name: string;
  last_name: string;
  user_image: string;
  skills: Array<{ category_name: string }>;
  timezone?: string;
  is_agency: number;
  agency_name: string;
  languages: Array<{ id: number; name: string }>;
  about_me: string;
  portfolio_link: string;
  hourly_rate: number;
  job_title: string;
  date_of_birth: string;
  location: {
    label: string;
    state: string;
    country_id: number;
    country_code: string;
    country_name: string;
    country_short_name: string;
  };
  date_created: string;
  is_account_approved: number;
  avg_rating: number;
  feedback_count: number;
  is_bookmarked: boolean;
  formatted_phonenumber: string;
  phone_number: string;
  new_message_email_notification: number;
  notification_email: number;
  u_email_id: string;
  deletion_requested: number;
  totalearning: number;
  user_group: Record<string, unknown>;
  preferred_banking_country: string;
  count_rating: number;
  done_jobs: number;
}

interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errorCode?: number;
  emailId?: string;
  response?: string;
}

// Export types first
export interface AuthState {
  user: (IFreelancerDetails & IClientDetails) | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
}

// Payload Types
interface LoginPayload {
  email_id: string;
  password: string;
  terms_agreement: boolean;
  stay_signedin?: boolean;
}

interface TwoFactorPayload {
  formdata: {
    action: 'send_otp' | 'verify_otp';
    type: 'new_registration' | 'login';
    otp?: string;
    email_id?: string;
  };
  email: string;
}

interface RegisterPayload {
  email_id: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  terms_agreement: boolean;
  user_type: 'freelancer' | 'client';
}

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    isBootstrapping: true,
  } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<(IFreelancerDetails & IClientDetails) | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      // Sync token with localStorage and API client
      if (action.payload) {
        localStorage.setItem('token', action.payload);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
      } else {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBootstrapping: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapping = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.email_id = action.payload;
      } else {
        state.user = { email_id: action.payload } as IFreelancerDetails & IClientDetails;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isBootstrapping = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      // Bootstrap User
      .addCase(bootstrapUser.pending, (state) => {
        state.isBootstrapping = true;
        state.isLoading = true;
      })
      .addCase(bootstrapUser.fulfilled, (state, action) => {
        state.isBootstrapping = false;
        state.isLoading = false;
        if (action.payload) {
          const { user, token } = action.payload;
          state.user = user;
          state.token = token;
          // Set token in localStorage and API client
          localStorage.setItem('token', token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Update timezone if needed
          const currentTimezone = moment.tz.guess();
          if (user?.timezone !== currentTimezone) {
            apiClient.put('/user/edit', { timezone: currentTimezone }).catch(console.error);
          }
        } else {
          // Clear auth state if no payload
          state.user = null;
          state.token = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete apiClient.defaults.headers.common['Authorization'];
        }
      })
      .addCase(bootstrapUser.rejected, (state, action) => {
        state.isBootstrapping = false;
        state.isLoading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        toast.error(action.payload as string);
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isBootstrapping = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isBootstrapping = false;
        toast.error(action.payload as string);
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.token = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isLoading = false;
        // Set token in localStorage and API client
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Update timezone if needed
        const currentTimezone = moment.tz.guess();
        if (user.timezone !== currentTimezone) {
          apiClient.put('/user/edit', { timezone: currentTimezone }).catch(console.error);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete apiClient.defaults.headers.common['Authorization'];
        if (action.payload !== '2FA_REQUIRED') {
          toast.error(action.payload || 'Login failed');
        }
      })
      // Two-Factor
      .addCase(twoFactor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(twoFactor.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.formdata.action === 'verify_otp' && action.meta.arg.formdata.type === 'new_registration') {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
        toast.success('Two-factor authentication successful');
      })
      .addCase(twoFactor.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        apiClient.defaults.headers.common['Authorization'] = '';
      });
  },
});

// Export actions
export const {
  setUser,
  setToken,
  setLoading,
  setBootstrapping,
  setEmail,
  clearAuth,
} = authSlice.actions;

// Export reducer as default
export default authSlice.reducer;

// Also export as named export for compatibility
export const authReducer = authSlice.reducer;

// Export thunks
export const bootstrapUser = createAsyncThunk(
  'auth/bootstrapUser',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      // Log bootstrap attempt
      console.log('[Bootstrap] Attempting to bootstrap user with token');

      // First try to validate the token
      const response = await apiClient.get<ApiResponse<AuthResponse>>('/user/get', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        timeout: 30000, // 30 second timeout for initial bootstrap
        validateStatus: (status) => status < 500, // Retry on 5xx errors
        params: {
          _t: new Date().getTime(), // Add timestamp to prevent caching
        },
      });

      // Log successful response
      console.log('[Bootstrap] Received response:', {
        status: response.status,
        data: response.data,
      });

      if (response.data.status) {
        return response.data.data;
      }

      // If the response indicates invalid token
      if (response.status === 401) {
        console.log('[Bootstrap] Token invalid, clearing storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      throw new Error(response.data.message || 'Invalid response from server');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
      
      // Log detailed error information
      console.log('[Bootstrap] Error:', {
        message: axiosError.message,
        code: axiosError.code,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        config: {
          url: axiosError.config?.url,
          baseURL: axiosError.config?.baseURL,
          timeout: axiosError.config?.timeout,
          headers: axiosError.config?.headers,
        },
      });

      // Handle network errors
      if (!axiosError.response) {
        const errorMessage = 'Unable to connect to server. Please check your internet connection and refresh the page.';
        toast.error(errorMessage);
        return rejectWithValue('Network error - Please check your connection');
      }

      // Handle server errors
      if (axiosError.response.status >= 500) {
        const errorMessage = 'Server error. Please try again later.';
        toast.error(errorMessage);
        return rejectWithValue('Server error');
      }

      // Handle unauthorized
      if (axiosError.response.status === 401) {
        console.log('[Bootstrap] Unauthorized, clearing storage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      const errorMessage = axiosError.response?.data?.message || 'Failed to bootstrap user. Please try logging in again.';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<AuthResponse>>('/user/get');
      if (response.data.status) {
        return response.data.data.user;
      }
      throw new Error('Failed to fetch user');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (formdata, { rejectWithValue }) => {
    try {
      console.log('[Auth Redux] Attempting login with payload:', {
        email_id: formdata.email_id,
        terms_agreement: formdata.terms_agreement,
        stay_signedin: formdata.stay_signedin,
      });

      // Get API URL and validate it
      const apiBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_API || '').replace(/\/$/, '');
      if (!apiBaseUrl) {
        console.error('[Auth Redux] Backend API URL is not configured');
        return rejectWithValue('API configuration error - Please contact support');
      }
      
      // Set a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      
      try {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(
          '/auth/login', 
          formdata, 
          { 
            signal: controller.signal,
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            }
          }
        );
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        console.log('[Auth Redux] Login response:', {
          status: response.data.status,
          message: response.data.message,
          hasToken: !!response.data.data?.token,
          userType: response.data.data?.user_type,
        });

        if (response.data.status) {
          // Save token to localStorage before returning
          localStorage.setItem('token', response.data.data.token);
          return response.data.data;
        }

        // Handle 2FA case
        if (response.data.errorCode === 101) {
          return rejectWithValue('2FA_REQUIRED');
        }

        return rejectWithValue(response.data.message);
      } catch (requestError) {
        // Clear the timeout if there's an error
        clearTimeout(timeoutId);
        
        // Rethrow the error to be caught by the outer catch block
        throw requestError;
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
      console.error('[Auth Redux] Login error:', {
        error: axiosError,
        message: axiosError.message,
        code: axiosError.code,
        isAxiosError: axiosError.isAxiosError,
        status: axiosError.response?.status,
      });

      // Handle timeout error
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return rejectWithValue('Request timed out - Server may be experiencing high load');
      }
      
      // Handle network errors
      if (!axiosError.response) {
        // Add diagnostic information
        console.error('[Auth Redux] Network diagnostic info:', {
          apiUrl: process.env.NEXT_PUBLIC_BACKEND_API,
          browserOnline: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
          timestamp: new Date().toISOString(),
        });
        
        return rejectWithValue('Network error - Please check your connection');
      }

      // Handle server errors
      if (axiosError.response.status >= 500) {
        return rejectWithValue('Server error - Please try again later');
      }

      // Handle 2FA case
      if (axiosError.response.data?.errorCode === 101) {
        return rejectWithValue('2FA_REQUIRED');
      }

      return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await apiClient.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear auth state even if API call fails
    }
  }
);

export const twoFactor = createAsyncThunk<AuthResponse, TwoFactorPayload, { rejectValue: string }>(
  'auth/twoFactor',
  async ({ formdata, email }, { rejectWithValue }) => {
    try {
      const data = { ...formdata, email_id: email };
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/otp', data);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
      return rejectWithValue(axiosError.response?.data?.message || 'Two-factor authentication failed');
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<AuthResponse>>;
      return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
    }
  }
);