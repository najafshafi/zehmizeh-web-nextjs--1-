import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { RetryQueueItem } from "@/helpers/types/axios.type";
import toast from "react-hot-toast";

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

// Function to check if current path is a freelancer profile
const isFreelancerProfilePath = () => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path.includes("/freelancer/");
};

// Get token expiration time from localStorage
const getTokenExpiration = (): number | null => {
  const expiration = localStorage.getItem("token_expiration");
  return expiration ? parseInt(expiration, 10) : null;
};

// Set token expiration time in localStorage
const setTokenExpiration = (expiresIn: number) => {
  // Calculate expiration timestamp (current time + expires_in in milliseconds)
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem("token_expiration", expirationTime.toString());
};

// Check if token is expired or about to expire (within 1 minute)
const isTokenExpired = (): boolean => {
  const expiration = getTokenExpiration();
  if (!expiration) return false;

  // Token is considered expired if it expires within the next minute
  return Date.now() > expiration - 60000;
};

// Store refresh token in localStorage
export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem("refresh_token", refreshToken);
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

// Headers only for ngrok link
// const ngRokHeader = {};
// if (process.env.NEXT_PUBLIC_BACKEND_API.includes('ngrok')) {
//   ngRokHeader['ngrok-skip-browser-warning'] = 'true';
// }

function onRequest(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem("token");

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    // Check if token is expired and the request is not a refresh token request
    if (isTokenExpired() && !config.url?.includes("/auth/refresh")) {
      // Silent token refresh will happen in the background through interceptors
      console.log("Token expired or about to expire - will refresh");
    }

    config.headers.set("Authorization", "Bearer " + token);
  } else {
    // After logout also axios has the last storred token in auth, clearing it here
    //config.withCredentials = true;
    config.headers.set("Authorization", "");
  }
  return config;
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // Check if response contains a message to display
  if (response?.data && typeof response.data === "object") {
    // If the response has status=false and a message, show an error toast
    if (response.data.status === false && response.data.message) {
      // Add a small timeout to ensure toast is shown after component updates
      setTimeout(() => {
        toast.error(response.data.message, {
          duration: 4000, // Show for 4 seconds
          position: "top-center",
        });
        // Log for debugging
        console.log("Toast error shown:", response.data.message);
      }, 100);
    }
  }
  return response;
};

const onResponseError = async (error: AxiosError): Promise<unknown> => {
  if (!error.config) {
    return Promise.reject(error);
  }

  const originalRequest = error.config;

  // Check if we're on a freelancer profile page
  const isOnFreelancerProfile = isFreelancerProfilePath();

  // Display error message from API response if available
  if (error?.response?.data) {
    const errorData = error.response.data as any;
    if (errorData && typeof errorData === "object" && errorData.message) {
      // Skip showing auth errors on freelancer profile pages
      if (
        isOnFreelancerProfile &&
        errorData.message.toLowerCase().includes("unauthorized")
      ) {
        console.log(
          "Suppressing unauthorized error on freelancer profile page"
        );
      } else {
        setTimeout(() => {
          toast.error(errorData.message, {
            duration: 4000,
            position: "top-center",
          });
          console.log(
            "Toast error shown from error response:",
            errorData.message
          );
        }, 100);
      }
    }
  }

  // If user is unauthorized
  if (error?.response?.status === 401) {
    // If we're on a freelancer profile page, don't redirect, just return a rejected promise
    if (isOnFreelancerProfile) {
      console.log("Unauthorized on freelancer profile page - not redirecting");
      return Promise.reject(error);
    }

    // Checking if refresh token request is already pending
    // if already pending then skipping this block else calling refresh token api
    if (!isRefreshing) {
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      // Only attempt to refresh if we have a refresh token
      if (refreshToken) {
        try {
          // Refresh token api call
          const response = await axios({
            method: "POST", // Changed to POST as refresh typically requires sending the refresh token
            baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
            url: "/auth/refresh",
            data: { refresh_token: refreshToken }, // Send refresh token in request body
            withCredentials: true,
          });

          if (!response?.data?.data?.token) throw Error("Unauthorized");

          // Setting new token to localstorage and axios headers
          localStorage.setItem("token", response.data.data.token);

          // Save the new refresh token if provided
          if (response.data.data.refresh_token) {
            setRefreshToken(response.data.data.refresh_token);
          }

          // Set token expiration time if provided
          if (response.data.data.expires_in) {
            setTokenExpiration(response.data.data.expires_in);
          }

          if (!error.config.headers) {
            error.config.headers = new AxiosHeaders();
          }

          error.config.headers.set(
            "Authorization",
            `Bearer ${response.data.data.token}`
          );

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
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clear auth data on refresh failure
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiration");

          // Check again if we're on a freelancer profile before redirecting
          if (!isFreelancerProfilePath()) {
            toast.error("Session expired - please login again.");
            setTimeout(() => {
              window.location.replace("/login");
            }, 1000);
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, clear auth
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!isFreelancerProfilePath()) {
          toast.error("Session expired - please login again.");
          setTimeout(() => {
            window.location.replace("/login");
          }, 1000);
        }
        isRefreshing = false;
      }
    }

    // If refresh token api is already pending then pushing other requests to queue and holding it until new token is created
    // once new token created then calling all failed api and giving response to respective function who called it
    return new Promise((resolve, reject) => {
      refreshAndRetryQueue.push({
        config: originalRequest,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
    });
  }

  // If request failed because of status other than 401 (Unauthorized)
  return Promise.reject(error);
};
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  // headers: { ...ngRokHeader },
});

apiClient.interceptors.request.use(onRequest);
apiClient.interceptors.response.use(onResponse, onResponseError);
