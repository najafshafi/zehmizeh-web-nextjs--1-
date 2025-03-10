// import { client, apiClient } from './apiClient';

// import { setUser, setLoading, setBootstrapping, signout } from '../store/slices/authSlice';
// import { AppDispatch } from '../store';
// import toast from 'react-hot-toast';
// import moment from 'moment-timezone';
// import { getToken, saveAuthStorage } from './authStorage'; // You'll need to create this
// import { editUser, getUser, logoutApi } from './authApi'; // You'll need to create this
// // import { capitalizeFirstLetter } from './utils'; // Utility functions

// export const signin = async (dispatch: AppDispatch, formdata: any, router: any) => {
//   dispatch(setLoading(true));
//   try {
//     let response;
//     if (typeof formdata === 'string') {
//       response = await client.get('/user/get', {
//         headers: { Authorization: `Bearer ${formdata}` },
//       });
//     } else {
//       console.log('Sending login request with payload:', formdata); // For debugging
//       response = await client.post('/auth/login', formdata);
//     }
//     if (response.data.status) {
//       const userData = {
//         ...response.data.data?.user,
//         user_type: response.data.data?.user_type,
//         user_id: response.data.data?.user?.id || response.data.data?.user_id,
//       };
//       const currentTimezone = moment.tz.guess();
//       if (userData.timezone !== currentTimezone) {
//         await editUser({ timezone: currentTimezone });
//       }
//       dispatch(setUser(userData));
//       saveAuthStorage({
//         token: response.data.data?.token || formdata,
//         user: userData,
//       });
//       // apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.data?.token || formdata}`;
//       const redirectPath = router.state?.from || (userData.user_type === 'client' ? '/client/dashboard' : '/freelancer/account/profile');
//       router.push(redirectPath);
//     } else if (response.data.errorCode === 101) {
//       dispatch(setUser({ email_id: response.data.emailId }));
//       router.push('/2fa');
//       toast.error(response.data.response);
//     } else {
//       toast.error(response.data.message);
//     }
//   } catch (err: any) {
//     console.error('Login error:', err.response?.data); // Log server response
//     toast.error(err.response?.data?.message || 'Something went wrong!');
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const signoutAction = (dispatch: AppDispatch, router: any) => {
//   logoutApi();
//   localStorage.removeItem('user');
//   localStorage.removeItem('token');
//   dispatch(signout());
//   router.push('/');
// };

// export const twoFactor = async (dispatch: AppDispatch, formdata: any, user: any, cb?: () => void) => {
//   dispatch(setLoading(true));
//   try {
//     if (!user?.email_id) {
//       toast.error('Please try to login.');
//       return;
//     }
//     formdata.email_id = user.email_id;
//     const res = await client.post('/auth/otp', formdata);

//     if (res.data.status) {
//       toast.success(res.data.message);
//       if (formdata.action === 'verify_otp' && formdata.type === 'new_registration') {
//         localStorage.setItem('token', res.data.data.token);
//         apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
//       }
//       cb?.();
//     } else {
//       toast.error(res.data.message);
//     }
//   } catch (err: any) {
//     toast.error(err.response?.data?.message || 'Something went wrong!');
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const submitRegisterUser = async (dispatch: AppDispatch, payload: any, router: any) => {
//   dispatch(setLoading(true));
//   try {
//     const res = await client.post('/auth/register', payload);
//     if (res.data.status) {
//       dispatch(setUser(payload));
//       apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
//       router.push('/2fa');
//     } else {
//       toast.error(res.data.message);
//     }
//   } catch (err: any) {
//     toast.error(err.response?.data?.message || 'Something went wrong!');
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // Fetch user on app load
// export const bootstrapUser = async (dispatch: AppDispatch) => {
//   const token = getToken();
//   if (!token) {
//     dispatch(setBootstrapping(false));
//     return;
//   }

//   try {
//     const res = await getUser();
//     if (res.data?.is_deleted) {
//       toast.error('Your account has been deleted by the admin.');
//       dispatch(signout());
//     } else {
//       const currentTimezone = moment.tz.guess();
//       if (res.data.timezone !== currentTimezone) {
//         await editUser({ timezone: currentTimezone });
//       }
//       dispatch(setUser(res.data));
//     }
//   } catch (err) {
//     toast.error(String(err));
//   } finally {
//     dispatch(setBootstrapping(false));
//   }
// };


import { apiClient } from '@/helpers/http/index'; // Only import apiClient since client isn’t defined
import { setUser, setLoading, setBootstrapping, signout } from '../store/slices/authSlice';
import { AppDispatch } from '../store';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import { getToken, saveAuthStorage } from './authStorage';
import { getUser, logoutApi } from './authApi';
import {editUser} from '@/helpers/http/auth';

export const signin = async (dispatch: AppDispatch, formdata: any, router: any) => {
  dispatch(setLoading(true));
  try {
    let response;
    if (typeof formdata === 'string') {
      // Use apiClient with manual token for initial user fetch
      localStorage.setItem('token', formdata); // Set token so interceptor picks it up
      response = await apiClient.get('/user/get');
    } else {
      console.log('Sending login request with payload:', formdata);
      // Use apiClient for login, no token needed yet
      response = await apiClient.post('/auth/login', formdata);
    }

    if (response.data.status) {
      const userData = {
        ...response.data.data?.user,
        user_type: response.data.data?.user_type,
        user_id: response.data.data?.user?.id || response.data.data?.user_id,
      };
      const currentTimezone = moment.tz.guess();
      if (userData.timezone !== currentTimezone) {
        await editUser({ timezone: currentTimezone }); // Uses apiClient with token from localStorage
      }
      dispatch(setUser(userData));
      saveAuthStorage({
        token: response.data.data?.token || formdata,
        user: userData,
      });
      // No need to set headers manually; interceptor handles it
      const redirectPath = router.state?.from || (userData.user_type === 'client' ? '/client/dashboard' : '/');
      router.push(redirectPath);
    } else if (response.data.errorCode === 101) {
      dispatch(setUser({ email_id: response.data.emailId }));
      router.push('/2fa');
      toast.error(response.data.response);
    } else {
      toast.error(response.data.message);
    }
  } catch (err: any) {
    console.error('Login error:', err.response?.data);
    toast.error(err.response?.data?.message || 'Something went wrong!');
  } finally {
    dispatch(setLoading(false));
  }
};

export const signoutAction = (dispatch: AppDispatch, router: any) => {
  logoutApi(); // Uses apiClient with token from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  dispatch(signout());
  router.push('/');
};

export const twoFactor = async (dispatch: AppDispatch, formdata: any, user: any, cb?: () => void) => {
  dispatch(setLoading(true));
  try {
    if (!user?.email_id) {
      toast.error('Please try to login.');
      return;
    }
    formdata.email_id = user.email_id;
    const res = await apiClient.post('/auth/otp', formdata); // Uses apiClient with token from localStorage

    if (res.data.status) {
      toast.success(res.data.message);
      if (formdata.action === 'verify_otp' && formdata.type === 'new_registration') {
        localStorage.setItem('token', res.data.data.token); // Save token for interceptor
        // No need to set headers manually; interceptor handles it
      }
      cb?.();
    } else {
      toast.error(res.data.message);
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Something went wrong!');
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitRegisterUser = async (dispatch: AppDispatch, payload: any, router: any) => {
  dispatch(setLoading(true));
  try {
    const res = await apiClient.post('/auth/register', payload); // Uses apiClient without token initially
    if (res.data.status) {
      dispatch(setUser(payload));
      localStorage.setItem('token', res.data.data.token); // Save token for interceptor
      // No need to set headers manually; interceptor handles it
      router.push('/2fa');
    } else {
      toast.error(res.data.message);
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Something went wrong!');
  } finally {
    dispatch(setLoading(false));
  }
};

export const bootstrapUser = async (dispatch: AppDispatch) => {
  const token = getToken();
  if (!token) {
    dispatch(setBootstrapping(false));
    return;
  }

  try {
    const res = await getUser(); // Uses apiClient with token from localStorage
    if (res.data?.is_deleted) {
      toast.error('Your account has been deleted by the admin.');
      dispatch(signout());
    } else {
      const currentTimezone = moment.tz.guess();
      if (res.data.timezone !== currentTimezone) {
        await editUser({ timezone: currentTimezone }); // Uses apiClient with token
      }
      dispatch(setUser(res.data));
    }
  } catch (err) {
    toast.error(String(err));
  } finally {
    dispatch(setBootstrapping(false));
  }
};