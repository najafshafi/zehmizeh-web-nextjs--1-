"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '@/store/redux/slices/authSlice';
import { AppDispatch } from '@/store/store';

interface LoginFormProps {
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { isLoading } = useSelector((state: RootState) => state.auth);

  // Check for redirectUrl from query params
  useEffect(() => {
    // Reset form error when component mounts
    setFormError("");
    
    // Check for error message in URL
    const errorMsg = searchParams?.get('error');
    if (errorMsg) {
      setFormError(decodeURIComponent(errorMsg));
    }
  }, [searchParams]);

  // Check if the API is configured correctly
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
    setApiLoaded(!!apiUrl);
    
    if (!apiUrl) {
      console.error('API URL not configured');
      setConnectionError('API configuration error - Please contact support');
    }

    // Check network connectivity
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setConnectionError(null);
      } else {
        setConnectionError('You are currently offline - Please check your internet connection');
      }
    };

    // Initial check
    handleOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formik = useFormik({
    initialValues: {
      email_id: '',
      password: '',
      stay_signedin: true,
      terms_agreement: false,
    },
    validationSchema: Yup.object({
      email_id: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      terms_agreement: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions'
      ),
    }),
    onSubmit: async (values) => {
      await onLoginClick();
    },
  });

  const onLoginClick = async () => {
    if (!formik.isValid || !formik.values.terms_agreement) {
      // If form is not valid or terms not agreed, trigger validation
      formik.validateForm().then((errors) => {
        if (Object.keys(errors).length > 0) {
          // Display validation errors
          Object.values(errors).forEach((error) => {
            if (typeof error === 'string') {
              toast.error(error);
            }
          });
        }

        // Specific check for terms agreement
        if (!formik.values.terms_agreement) {
          toast.error('You must accept the terms and conditions');
        }
      });
      return;
    }

    if (isLoggingIn) {
      console.log('Login already in progress, ignoring duplicate request');
      return;
    }

    // Check if API URL is configured
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
    if (!apiUrl) {
      toast.error('API configuration error - Please contact support');
      console.error('Cannot login: API URL not configured');
      return;
    }

    // Check if browser is online
    if (!navigator.onLine) {
      toast.error('You appear to be offline - Please check your internet connection');
      console.error('Cannot login: Browser is offline');
      return;
    }

    setIsLoggingIn(true);
    setConnectionError(null);

    try {
      console.log('Attempting login:', {
        email: formik.values.email_id,
        apiUrl: apiUrl,
        browserOnline: navigator.onLine,
      });

      // Get redirect URL from query params
      const redirect = searchParams?.get('redirect') || redirectTo || '/';

      // Call the sign-in function from auth context and check its result
      const result = await dispatch(login(formik.values));
      
      if (login.fulfilled.match(result)) {
        console.log('Login successful, redirecting to:', redirect);
        router.push(redirect);
      } else {
        console.log('Login unsuccessful - no redirection');
        toast.error(result.error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-[400px] p-[24px] bg-[rgb(255,255,255)] rounded-[12px]">
      {connectionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{connectionError}</p>
          </div>
        </div>
      )}
      
      <div className="text-center">
        <h1 className="leading-[1.2] text-[rgb(17,24,39)] text-[24px] font-extrabold">
          Log in to your account
        </h1>
        <div className="mt-3">
          <p className="text-[rgb(107,114,128)] leading-[1.5]">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-10">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email_id"
              className="block text-sm font-medium leading-[1.5] text-[rgb(17,24,39)]"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email_id"
                name="email_id"
                type="email"
                autoComplete="email"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email_id}
                className="block w-full rounded-lg border-[rgb(209,213,219)] py-[0.5rem] px-[0.75rem] text-[rgb(17,24,39)] shadow-sm placeholder:text-[rgb(107,114,128)]"
              />
            </div>
            {formik.touched.email_id && formik.errors.email_id && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email_id}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-[1.5] text-[rgb(17,24,39)]"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="block w-full rounded-lg border-[rgb(209,213,219)] py-[0.5rem] px-[0.75rem] text-[rgb(17,24,39)] shadow-sm placeholder:text-[rgb(107,114,128)]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="stay_signedin"
              name="stay_signedin"
              type="checkbox"
              checked={formik.values.stay_signedin}
              onChange={formik.handleChange}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label
              htmlFor="stay_signedin"
              className="ml-2 text-sm text-gray-600"
            >
              Stay signed in
            </label>
          </div>

          <div>
            <div className="flex items-center">
              <input
                id="terms_agreement"
                name="terms_agreement"
                type="checkbox"
                checked={formik.values.terms_agreement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label
                htmlFor="terms_agreement"
                className="ml-2 text-sm text-gray-600"
              >
                I agree to the{' '}
                <Link
                  href="/terms-conditions"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {formik.touched.terms_agreement &&
              formik.errors.terms_agreement && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.terms_agreement}
                </div>
              )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoggingIn || !apiLoaded}
              className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="text-sm text-center">
            <Link
              href="/auth/reset-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;