// src/helpers/http/index.ts
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { RetryQueueItem } from '@/helpers/types/axios.type';
import toast from 'react-hot-toast';
import { store } from '@/store/store';
import { setToken, logout } from '@/store/redux/authSlice';

// Extend AxiosRequestConfig to include retry count
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

// Define base URL with fallback
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('[API Configuration]', {
    baseURL: BASE_URL,
    nodeEnv: process.env.NODE_ENV,
  });
}

if (!BASE_URL) {
  console.log('[API Error] NEXT_PUBLIC_BACKEND_API is not defined in environment variables');
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout for initial requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Get token from Redux store or localStorage
    const token = store.getState().auth.token || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: timestamp,
      };
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        baseURL: config.baseURL,
        withCredentials: config.withCredentials,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.log('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError<{ message: string; status: boolean; data?: unknown }>) => {
    // Handle network errors
    if (!error.response) {
      const errorMessage = 'Network Error - Please check your internet connection';
      
      // Enhanced network error logging
      console.log('[API Network Error] Details:', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          timeout: error.config?.timeout,
          headers: error.config?.headers,
          data: error.config?.data,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          baseUrl: BASE_URL,
        }
      });

      // Attempt to check network connectivity
      try {
        console.log('[API] Checking network connectivity...');
        const online = typeof window !== 'undefined' ? window.navigator.onLine : true;
        console.log('[API] Network status:', { online });
        
        if (!online) {
          console.log('[API] Device is offline');
          toast.error('Your device appears to be offline. Please check your internet connection.');
          return Promise.reject(new Error('Device is offline'));
        }
      } catch (connectivityError) {
        console.log('[API] Error checking connectivity:', connectivityError);
      }

      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Error]:', {
        status: error.response.status,
        data: error.response.data,
        config: {
          url: originalRequest.url,
          method: originalRequest.method,
          baseURL: originalRequest.baseURL,
          headers: originalRequest.headers,
          data: originalRequest.data,
        },
      });
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios({
            method: 'GET',
            baseURL: BASE_URL,
            url: '/auth/refresh',
            withCredentials: true,
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });

          if (!response?.data?.data?.token) {
            throw new Error('Unauthorized');
          }

          const newToken = response.data.data.token;
          store.dispatch(setToken(newToken));
          localStorage.setItem('token', newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process queued requests
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
            apiClient(config).then(resolve).catch(reject);
          });
          refreshAndRetryQueue.length = 0;

          return apiClient(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired - please login again');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.replace('/login');
          }, 1000);
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue the request if refresh is in progress
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    // Handle other errors
    if (error.response.status >= 500) {
      toast.error('Server is temporarily unavailable. Please try again later.');
      return Promise.reject(new Error('Server unavailable'));
    }

    const errorMessage = error.response.data?.message || 'An unexpected error occurred';
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

// Add request retry on network errors
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    // Add retry count to config if not present
    if (typeof config.retryCount === 'undefined') {
      config.retryCount = 0;
    }
    return config;
  },
  error => Promise.reject(error)
);
