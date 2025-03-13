import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchUser,
  logout,
  twoFactor,
  registerUser,
  setBootstrapping,
  setEmail,
  setUser,
  setToken,
  clearAuth,
  setLoading,
} from '@/store/redux/authSlice';
import Loader from '@/components/Loader';
import { useIntercom } from 'react-use-intercom';
import { capitalizeFirstLetter } from '@/helpers/utils/misc';
import moment from 'moment-timezone';
import { getCookie } from '@/helpers/utils/cookieHelper';
import { isStagingEnv, stripeIntercomStatusHandler } from '@/helpers/utils/helper';
import { RootState, AppDispatch } from '@/store/store';
import toast from 'react-hot-toast';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import { apiClient } from '@/helpers/http/index';
import { LoginPayload, RegisterPayload, TwoFactorPayload } from '@/helpers/types/auth.type';
import { runDiagnostic } from '@/helpers/utils/debugHelper';

interface AuthContextType {
  user: (IFreelancerDetails & IClientDetails) | null;
  setUser: (user: (IFreelancerDetails & IClientDetails) | null) => void;
  signin: (data: LoginPayload) => Promise<boolean>;
  signout: () => void;
  isLoading: boolean;
  twoFactor: (data: TwoFactorPayload, cb?: () => void) => void;
  submitRegisterUser: (payload: RegisterPayload) => void;
  setEmail: (email: string) => void;
  runApiDiagnostics: () => Promise<unknown>;
}

const AuthContext = React.createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isBootstrapping, token } = useSelector((state: RootState) => state.auth);
  const { boot, shutdown } = useIntercom();
  const router = useRouter();

  // Bootstrap user on mount
  useEffect(() => {
    if (token) {
      // Set token in API client
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(fetchUser());
    } else {
      dispatch(setBootstrapping(false));
    }
  }, [dispatch, token]);

  // Handle Intercom integration
  const getUserSkills = () => {
    if (!user || user.user_type !== 'freelancer' || !Array.isArray(user.skills)) return [];
    return user.skills
      .filter((skl) => skl.category_name)
      .map((cat) => capitalizeFirstLetter(cat.category_name || ''));
  };

  useEffect(() => {
    if (isStagingEnv()) return;

    shutdown();
    if (!user) {
      boot();
      return;
    }

    const intercomFlag = ['first_name', 'last_name', 'u_email_id'].every((el) => el in user);
    if (!intercomFlag) {
      boot();
      return;
    }

    const ACCOUNTSTATUS = { 0: 'Rejected', 1: 'Approved' } as const;
    const customAttributes = {
      user_type: capitalizeFirstLetter(user.user_type),
      account_status: ACCOUNTSTATUS[user.is_account_approved as 0 | 1] ?? 'Under Review',
      last_modified: moment().format('MMM DD, YYYY'),
      country: user.location.country_name,
      platform: window.location.host.includes('beta') ? 'Beta' : 'Live',
    };

    if (user.user_type === 'freelancer') {
      Object.assign(customAttributes, {
        headline: user.job_title ?? '',
        stripe_status: stripeIntercomStatusHandler(user.stp_account_id, user.stp_account_status),
        categories: getUserSkills().join(','),
      });
    } else {
      Object.assign(customAttributes, {
        jobs_completed: user.done_jobs ?? 0,
      });
    }

    boot({
      name: `${user.first_name} ${user.last_name}`,
      email: user.u_email_id,
      customAttributes,
    });
  }, [user, boot, shutdown]);

  // Initialize the diagnostic tool in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Make the diagnostic tool available in console
      console.log(
        '%c ZehMizeh Debug Tools Loaded',
        'background: #f8f9fa; color: #0d6efd; padding: 5px; border-radius: 3px; font-weight: bold;'
      );
      console.log('Use runDiagnostic() to test API connectivity');
      
      // Run an initial diagnostic check
      if (typeof window !== 'undefined') {
        // Delay the check to not interfere with initial load
        setTimeout(() => {
          runDiagnostic().then(results => {
            console.log('Initial API diagnostic results:', results);
            
            // Update Redux store with connection status if available
            if (results.connectionTest) {
              const isNetworkHealthy = results.connectionTest.success && results.apiConfig.success;
              console.log(`Network health status: ${isNetworkHealthy ? 'Healthy' : 'Issues detected'}`);
            }
          });
        }, 5000);
      }
    }
  }, []);

  // Signin function
  const signin = async (formData: LoginPayload): Promise<boolean> => {
    try {
      // Log the login attempt with redacted info
      console.log('Attempting login with:', { 
        email: formData.email_id ? `${formData.email_id.substring(0, 3)}...` : undefined,
        stay_signed_in: formData.stay_signedin,
        terms_agreement: formData.terms_agreement
      });
      
      // Check if API URL is configured
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
      if (!apiUrl) {
        console.error('API URL not configured');
        toast.error('Login failed - API not configured correctly');
        return false;
      }
      
      // Check network connectivity
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.error('Browser is offline');
        toast.error('You appear to be offline - Please check your internet connection');
        return false;
      }
      
      // Set loading state
      dispatch(setLoading(true));
      
      // If we have a token, try to authenticate with it first
      const token = getCookie('token');
      if (token) {
        try {
          console.log('Token found in storage, attempting token-based authentication');
          
          // Set up a timeout for the fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          try {
            const response = await fetch(`${apiUrl}/user/get`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Token authentication successful');
              
              // Set user in store
              dispatch(setToken(token));
              dispatch(setUser(data.data.user));
              
              // Check user type and navigate accordingly
              if (data.data.user.user_type === 'freelancer') {
                router.push('/dashboard/freelancer');
              } else {
                router.push('/dashboard/client');
              }
              
              return true;
            } else {
              console.warn('Token authentication failed, will try form-based login');
              // Continue with form-based login below
            }
          } catch (fetchError: Error | unknown) {
            clearTimeout(timeoutId);
            
            // Handle specific network errors
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              console.error('Token authentication request timed out');
              toast.error('Request timed out - Please try again');
              dispatch(setLoading(false));
              return false;
            }
            
            console.warn('Error during token authentication:', fetchError instanceof Error ? fetchError.message : 'Unknown error');
            // Continue with form-based login below
          }
        } catch (err) {
          console.error('Error during token verification:', err);
          // Continue with form-based login
        }
      }
      
      // Proceed with form-based login
      console.log('Attempting form-based login');
      
      // For diagnostics, check API URL and connectivity
      if (process.env.NODE_ENV === 'development') {
        console.log('Using API URL:', apiUrl);
        console.log('Browser online status:', navigator.onLine);
      }
      
      // Set up a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        // Try the local API route first (which will proxy to the backend)
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Login failed:', errorData);
          
          // Special handling for 2FA requirement
          if (response.status === 206) {
            console.log('Two-factor authentication required');
            dispatch(setLoading(false));
            return true; // Let the caller handle 2FA redirection
          }
          
          // Handle other error cases
          if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error('Login failed. Please check your credentials and try again.');
          }
          
          dispatch(setLoading(false));
          return false;
        }
        
        const data = await response.json();
        console.log('Login successful');
        
        // Save auth data - saving token to cookies instead of using saveAuthStorage
        document.cookie = `token=${data.token}; path=/; max-age=2592000`; // 30 days
        
        dispatch(setToken(data.token));
        dispatch(setUser(data.user));
        
        // Navigate based on user type
        if (data.user.user_type === 'freelancer') {
          router.push('/dashboard/freelancer');
        } else {
          router.push('/dashboard/client');
        }
        
        return true;
      } catch (fetchError: Error | unknown) {
        clearTimeout(timeoutId);
        
        // Handle specific network errors with better messages
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('Login request timed out');
          toast.error('Request timed out - Server is taking too long to respond');
        } else {
          console.error('Network error during login:', fetchError);
          
          // Run diagnostic if in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Running diagnostic check...');
            const diagnostic = await runDiagnostic();
            console.log('Diagnostic results:', diagnostic);
          }
          
          toast.error('Network error - Please check your connection and try again');
        }
        
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error('Unhandled error in signin function:', error);
      dispatch(setLoading(false));
      toast.error('An unexpected error occurred. Please try again later.');
      return false;
    }
  };

  // Signout function
  const signout = () => {
    dispatch(logout()).then(() => {
      dispatch(clearAuth());
      shutdown();
      router.push('/');
    });
  };

  // Two-factor authentication
  const twoFactorHandler = (formdata: TwoFactorPayload, cb?: () => void) => {
    if (user?.email_id) {
      const payload = {
        formdata: {
          action: formdata.formdata.action,
          type: formdata.formdata.type,
          otp: formdata.formdata.otp,
          email_id: formdata.formdata.email_id,
        },
        email: user.email_id
      };
      
      dispatch(twoFactor(payload)).then((action) => {
        if (twoFactor.fulfilled.match(action)) {
          if (formdata.formdata.action === 'verify_otp' && formdata.formdata.type === 'new_registration') {
            router.push('/login');
          }
          if (cb) cb();
        }
      });
    } else {
      toast.error('Please try to login.');
    }
  };

  // Register user
  const submitRegisterUser = (payload: RegisterPayload) => {
    const utm_info = getCookie('utm_info');
    if (utm_info) {
      payload.utm_info = JSON.parse(utm_info);
    }
    dispatch(registerUser(payload)).then((action) => {
      if (registerUser.fulfilled.match(action)) {
        router.push('/2fa');
      }
    });
  };

  // Add an explicit method to run diagnostics
  const runApiDiagnostics = async () => {
    console.log('Running API diagnostics...');
    try {
      const results = await runDiagnostic();
      console.log('API diagnostic results:', results);
      return results;
    } catch (error) {
      console.error('Error running diagnostics:', error);
      return null;
    }
  };

  const value = {
    user,
    setUser: (user: (IFreelancerDetails & IClientDetails) | null) => dispatch(setUser(user)),
    signin,
    signout,
    isLoading,
    twoFactor: twoFactorHandler,
    submitRegisterUser,
    setEmail: (email: string) => dispatch(setEmail(email)),
    runApiDiagnostics,
  };

  if (isBootstrapping) {
    return <Loader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth };


