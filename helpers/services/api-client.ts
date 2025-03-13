import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private isServer: boolean;
  private retryCount: number = 0;
  private maxRetries: number = 2;
  private retryDelay: number = 1000; // ms
  
  constructor() {
    this.isServer = typeof window === 'undefined';
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.getBaseUrl(),
      timeout: 15000, // 15 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add request interceptor for logging and header manipulation
    this.client.interceptors.request.use(
      (config) => {
        // Log request details in development
        if (process.env.NODE_ENV === 'development' && !this.isServer) {
          console.log(
            `API Request: ${config.method?.toUpperCase()} ${config.url}`,
            config.params ? { params: config.params } : ''
          );
        }
        
        // Add custom headers if needed
        if (!this.isServer) {
          // Add any client-side specific headers here
        }
        
        return config;
      },
      (error) => {
        console.error('API Request Error:', error.message);
        return Promise.reject(error);
      }
    );
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development' && !this.isServer) {
          console.log(
            `API Response (${response.status}): ${response.config.method?.toUpperCase()} ${response.config.url}`
          );
        }
        
        // Reset retry count on successful response
        this.retryCount = 0;
        
        return response;
      },
      async (error) => {
        if (error.config && this.shouldRetry(error)) {
          this.retryCount++;
          
          console.warn(`API request failed. Retrying (${this.retryCount}/${this.maxRetries}):`, error.message);
          
          // Wait for delay
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          
          // Retry the request
          return this.client(error.config);
        }
        
        // Handle errors
        if (error.response) {
          // The server responded with a status code outside of 2xx range
          console.error('API Error Response:', {
            status: error.response.status,
            url: error.config?.url,
            method: error.config?.method,
            data: error.response.data
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.error('API No Response Error:', {
            url: error.config?.url,
            method: error.config?.method,
            error: error.message
          });
        } else {
          // Something happened in setting up the request
          console.error('API Request Setup Error:', error.message);
        }
        
        return Promise.reject(this.enhanceError(error));
      }
    );
  }
  
  private shouldRetry(error: AxiosError): boolean {
    // Only retry for network errors or 5xx server errors
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;
    const isIdempotentMethod = 
      error.config?.method === 'get' || 
      error.config?.method === 'head' || 
      error.config?.method === 'options' || 
      error.config?.method === 'put' || 
      error.config?.method === 'delete';
    
    // Don't retry if we've reached the max retries
    if (this.retryCount >= this.maxRetries) {
      return false;
    }
    
    // Only retry for network errors, 5xx responses, or idempotent requests
    return (isNetworkError || isServerError) && isIdempotentMethod;
  }
  
  private enhanceError(error: AxiosError): AxiosError {
    // Add properties to identify the type of error
    if (!error.response) {
      // Create a more descriptive error for network errors
      const enhancedError = error as any;
      enhancedError.isNetworkError = true;
      enhancedError.isTimeout = error.code === 'ECONNABORTED';
      enhancedError.isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      
      // Add more user-friendly message
      if (enhancedError.isTimeout) {
        enhancedError.userMessage = 'Request timed out - Server is taking too long to respond';
      } else if (enhancedError.isOffline) {
        enhancedError.userMessage = 'You appear to be offline - Please check your internet connection';
      } else {
        enhancedError.userMessage = 'Network error - Please check your connection';
      }
      
      return enhancedError;
    }
    
    return error;
  }
  
  private getBaseUrl(): string {
    // Use environment variables for the API URL
    let baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
    
    // Ensure there's no trailing slash
    if (baseUrl) {
      baseUrl = baseUrl.replace(/\/$/, '');
    }
    
    // If not available, use a relative URL in the client or the default URL for the server
    if (!baseUrl) {
      baseUrl = this.isServer ? 'https://api.zehmizeh.com' : '/api';
      console.warn(`API base URL not configured. Using default: ${baseUrl}`);
    }
    
    return baseUrl;
  }
  
  // Expose methods for HTTP requests
  async get<T = any>(
    url: string, 
    params?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { ...config, params });
  }
  
  async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }
  
  async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }
  
  async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
  
  // Method to set auth token in header
  setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `${token}`;
      if (process.env.NODE_ENV === 'development') {
        console.log('API Client: Auth token set');
      }
    } else {
      delete this.client.defaults.headers.common['Authorization'];
      if (process.env.NODE_ENV === 'development') {
        console.log('API Client: Auth token cleared');
      }
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient; 