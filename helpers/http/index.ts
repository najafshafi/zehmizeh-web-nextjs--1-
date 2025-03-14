import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RetryQueueItem } from '@/helpers/types/axios.type';
import toast from 'react-hot-toast';

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

// Headers only for ngrok link
// const ngRokHeader = {};
// if (process.env.NEXT_PUBLIC_BACKEND_API.includes('ngrok')) {
//   ngRokHeader['ngrok-skip-browser-warning'] = 'true';
// }

function onRequest(config: AxiosRequestConfig) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  } else {
    // After logout also axios has the last storred token in auth, clearing it here
    //config.withCredentials = true;
    config.headers['Authorization'] = '';
  }
  return config;
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // Check if response contains a message to display
  if (response?.data && typeof response.data === 'object') {
    // If the response has status=false and a message, show an error toast
    if (response.data.status === false && response.data.message) {
      // Add a small timeout to ensure toast is shown after component updates
      setTimeout(() => {
        toast.error(response.data.message, {
          duration: 4000, // Show for 4 seconds
          position: 'top-center',
        });
        // Log for debugging
        console.log('Toast error shown:', response.data.message);
      }, 100);
    }
  }
  return response;
};

const onResponseError = async (error: AxiosError): Promise<unknown> => {
  const originalRequest: AxiosRequestConfig = error.config;

  // Display error message from API response if available
  if (error?.response?.data) {
    const errorData = error.response.data as any;
    if (errorData && typeof errorData === 'object' && errorData.message) {
      setTimeout(() => {
        toast.error(errorData.message, {
          duration: 4000,
          position: 'top-center',
        });
        console.log('Toast error shown from error response:', errorData.message);
      }, 100);
    }
  }

  // If user is unauthorized
  if (error?.response?.status === 401) {
    // Checking if refresh token request is already pending
    // if already pending then skipping this block else calling refresh token api
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // Refresh token api call
        const response = await axios({
          method: 'GET',
          baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
          url: '/auth/refresh',
          // headers: { ...ngRokHeader },
          withCredentials: true,
        });
        if (!response?.data?.data?.token) throw Error('Unauthorized');

        // Setting new token to localstorage and axios headers
        localStorage.setItem('token', response.data.data.token);
        error.config.headers['Authorization'] = `Bearer ${response.data.data.token}`;

        // Retry all requests in the queue with the new token
        refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
          apiClient(config)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        });

        // Clear the queue
        refreshAndRetryQueue.length = 0;

        // Retry the original request
        return axios(originalRequest);

        // Catching error if refreshtoken api failed
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired - please login again.');
        setTimeout(() => {
          window.location.replace('/login');
        }, 1000);
      } finally {
        isRefreshing = false;
      }
    }

    // If refresh token api is already pending then pushing other requests to queue and holding it until new token is created
    // once new token created then calling all failed api and giving response to respective function who called it
    return new Promise<void>((resolve, reject) => {
      refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
    });

    // If request failed because of status other than 401 (Unauthorized)
  } else {
    // if api call is not cancelled manually then executing necessary steps
    if (!axios.isCancel(error)) {
      if (error.response?.status === 502) window.location.reload();
      // eslint-disable-next-line no-console
      console.log('error', error);
    }
  }

  // If api failed because of internet issue then changing message
  if (error?.message?.toLowerCase?.() === 'network error') {
    error.message = 'Network Error - Switch wifi/web network to continue';
  }

  // returning reject status with error info
  return Promise.reject(error);
};
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  // headers: { ...ngRokHeader },
});

apiClient.interceptors.request.use(onRequest);
apiClient.interceptors.response.use(onResponse, onResponseError);
