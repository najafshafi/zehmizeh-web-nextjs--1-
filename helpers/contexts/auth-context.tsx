import React, { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/helpers/http';
import Loader from '@/components/Loader';
import { getToken, saveAuthStorage } from '@/lib/authStorage';
import { getUser, editUser, logoutApi } from '@/helpers/http/auth';
import { capitalizeFirstLetter, showErr } from '@/helpers/utils/misc';
import moment from 'moment-timezone';
import { useIntercom } from 'react-use-intercom';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import { isStagingEnv, stripeIntercomStatusHandler } from '@/helpers/utils/helper';
import { getCookie } from '@/helpers/utils/cookieHelper';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

// NOTE: Whenever api sends "withCredentials in request then api MUST specify exact origin in allowed-origin response
// wildcard won't work when sending withCredentials in request. So change allowed-origin for request else it'll throw cors error
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface AuthContextType {
  user: IFreelancerDetails & IClientDetails;
  setUser: (data: any) => void;
  signin: (data: any) => void;
  signout: () => void;
  isLoading: boolean;
  twoFactor: (data: any, cb?: () => void) => void;
  setEmail: (email: string) => void;
  submitRegisterUser: (payload: Partial<IFreelancerDetails & { utm_info: Record<string, string> }>) => void;
  preferred_banking_country?: string;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isBoostraping, setIsBootstraping] = React.useState(true);

  const { boot, shutdown } = useIntercom();

  const navigate = useNavigate();
  const location = useLocation();

  const signout = useCallback(() => {
    // No need for response from logout api. It'll just remove refreshToken from cookies
    logoutApi();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }, [navigate]);

  useQuery(['userProfile'], getUser, {
    enabled: !!getToken(),
    onSuccess: (res) => {
      if (res?.data) {
        if (res?.data?.is_deleted) {
          showErr('Your account has been deleted by the admin.');
          signout();
        } else {
          // Updating timezone of user
          const currentTimezone = moment.tz.guess();
          if (res?.data && 'timezone' in res.data && currentTimezone !== res?.data?.timezone) {
            editUser({ timezone: currentTimezone });
          }
          setUser(res.data);
        }
      }
    },
    onSettled: () => setIsBootstraping(false),
    onError: (err) => showErr(err + ''),
    retry: 0,
  });

  React.useEffect(() => {
    // check for token initally
    const token = getToken();
    if (!token) setIsBootstraping(false);
  }, []);

  const getUserSkills = () => {
    if (!user || user.user_type !== 'freelancer' || !Array.isArray(user.skills)) return [];
    let categories = user?.skills.filter((skl) => skl.category_name);
    categories = categories.map((cat) => capitalizeFirstLetter(cat.category_name));
    return categories;
  };

  const intercomHandler = () => {
    // JSON.parse(localStorage.user).location.country_name

    if (isStagingEnv()) return null;

    shutdown();
    if (user === null) return boot();

    const intercomFlag = ['first_name', 'last_name', 'u_email_id'].map((el) => el in user);

    if (intercomFlag.includes(false)) return boot();

    const ACCOUNTSTATUS = {
      0: 'Rejected',
      1: 'Approved',
    };

    interface IntercomPayload {
      user_type: string;
      account_status: string;
      headline?: string;
      last_modified: string;
      stripe_status?: string;
      jobs_completed?: string;
      platform?: string;
      categories?: string;
      country: string;
    }

    const customAttributes: IntercomPayload = {
      user_type: capitalizeFirstLetter(user.user_type),
      account_status: ACCOUNTSTATUS[user.is_account_approved] ?? 'Under Review',
      last_modified: moment(user.lat).format('MMM DD, YYYY'),
      country: user.location.country_name,
    };

    if (window.location.host.includes('beta')) {
      customAttributes.platform = 'Beta';
    } else {
      customAttributes.platform = 'Live';
    }

    if (user.user_type === 'freelancer') {
      customAttributes.headline = user.job_title ?? '';
      customAttributes.stripe_status = stripeIntercomStatusHandler(user.stp_account_id, user.stp_account_status);
      customAttributes.categories = getUserSkills().join(',');
    } else customAttributes.jobs_completed = user.done_jobs ?? 0;

    boot({
      name: `${user.first_name} ${user.last_name}`,
      email: user.u_email_id,
      customAttributes,
    });
  };

  // intercom logic for conversations
  useEffect(() => {
    intercomHandler();
  }, [user]);

  const signin = async (formdata: any) => {
    if (typeof formdata === 'string') {
      setIsLoading(true);
      const headers: any = {
        Authorization: `Bearer ${formdata}`,
      };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}user/get`, { headers });
      if (response.data.status) {
        const userAllData = {
          ...response.data?.data,
          user_type: response.data?.data?.user_type,
          user_id: response.data?.data?.user_id,
        };

        // Updating timezone of user
        const currentTimezone = moment.tz.guess();
        if (
          response?.data?.data &&
          'timezone' in response.data.data &&
          currentTimezone !== response?.data?.data?.timezone
        ) {
          editUser({ timezone: currentTimezone });
        }
        setUser(userAllData);
        saveAuthStorage({
          token: formdata,
          user: userAllData,
        });

        if (location.state?.from) {
          navigate(`${location.state.from.pathname}${location.state.from.search}`);
        } else if (response.data?.data?.user_type == 'client') {
          navigate('/client/dashboard');
        } else {
          navigate('/dashboard');
          // if (response.data?.data?.is_profile_completed) {
          // } else {
          //   navigate('/complete-profile');
          // }
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (response?.data?.errorCode === 101) {
          setUser({ email_id: response?.data?.emailId });
          navigate('/2fa');
          toast.error(response.data.response);
        } else {
          toast.error(response.data.message);
        }
      }
    } else {
      setIsLoading(true);
      client
        .post('/auth/login', formdata)
        .then((res) => {
          setIsLoading(false);
          if (res.data.status) {
            const userAllData = {
              ...res.data?.data?.user,
              user_type: res.data?.data?.user_type,
              user_id: res.data?.data?.user?.id,
            };

            // Updating timezone of user
            const currentTimezone = moment.tz.guess();
            if (
              res?.data?.data?.user &&
              'timezone' in res.data.data.user &&
              currentTimezone !== res?.data?.data?.user?.timezone
            ) {
              editUser({ timezone: currentTimezone });
            }
            setUser(userAllData);
            saveAuthStorage({
              token: res.data?.data?.token,
              user: userAllData,
            });
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + res.data?.data?.token;

            if (location.state?.from) {
              navigate(`${location.state.from.pathname}${location.state.from.search}`);
            } else if (res.data?.data?.user_type == 'client') {
              navigate('/client/dashboard');
            } else {
              navigate('/dashboard');
              // if (res.data?.data?.user.is_profile_completed) {
              // } else {
              //   navigate('/complete-profile');
              // }
            }
          } else {
            setIsLoading(false);
            if (res?.data?.errorCode === 101) {
              setUser({ email_id: res?.data?.emailId });
              navigate('/2fa');
              toast.error(res.data.response);
            } else {
              toast.error(res.data.message);
            }
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          toast.error(err.response?.data?.message || 'Something went wrong, try later!');
        });
    }
  };

  const submitRegisterUser: AuthContextType['submitRegisterUser'] = async (payload) => {
    /* START ----------------------------------------- Passing utm info when registering user */
    const utm_info = getCookie('utm_info');
    if (utm_info) payload.utm_info = JSON.parse(utm_info);
    /* END ------------------------------------------- Passing utm info when registering user */

    setIsLoading(true);
    try {
      const res = await client.post('/auth/register', payload);
      setIsLoading(false);
      if (res.data.status) {
        setUser(payload);
        // localStorage.setItem('token', res.data?.data?.token);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + res.data?.data?.token;
        navigate('/2fa');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration:', error);
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Something went wrong, try later!');
    }
  };

  const twoFactor = (formdata: any, cb?: any) => {
    setIsLoading(true);
    if (user.email_id !== '') {
      formdata.email_id = user.email_id;
      client
        .post('/auth/otp', formdata)
        .then((res) => {
          setIsLoading(false);
          if (res.data.status) {
            toast.success(res.data.message);
            if (formdata.action === 'verify_otp') {
              if (formdata.type == 'new_registration') {
                localStorage.setItem('token', res.data?.data?.token);
                apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + res.data?.data?.token;
              }
              cb();
              // navigate('/login');
            }
            if (cb) {
              cb();
            }
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          toast.error(err.response?.data?.message || 'Something went wrong, try later!');
        });
    } else {
      setIsLoading(false);
      toast.error('Please try to login.');
    }
  };

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      signin,
      signout,
      isLoading,
      twoFactor,
      submitRegisterUser,
      setEmail: (email: string) => setUser((prev) => ({ ...prev, email_id: email })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, signout, user, twoFactor, setUser]
  );
  if (isBoostraping) {
    return <Loader />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth };




// import React, { useCallback, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { getUser, editUser, logoutApi } from '@/helpers/http/auth';
// import { getToken, saveAuthStorage } from '@/lib/authStorage';
// import { setUser, clearUser } from '@/store/authSlice';
// import Loader from '@/components/Loader';
// import moment from 'moment-timezone';
// import { useIntercom } from 'react-use-intercom';
// import { capitalizeFirstLetter, showErr } from '@/helpers/utils/misc';
// import { isStagingEnv, stripeIntercomStatusHandler } from '@/helpers/utils/helper';

// const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const isLoading = useSelector((state) => state.auth.isLoading);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const signout = useCallback(() => {
//     logoutApi();
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     dispatch(clearUser());
//     navigate('/');
//   }, [dispatch, navigate]);

//   useQuery(['userProfile'], getUser, {
//     enabled: !!getToken(),
//     onSuccess: (res) => {
//       if (res?.data) {
//         if (res?.data?.is_deleted) {
//           showErr('Your account has been deleted by the admin.');
//           signout();
//         } else {
//           const currentTimezone = moment.tz.guess();
//           if (res?.data?.timezone !== currentTimezone) {
//             editUser({ timezone: currentTimezone });
//           }
//           dispatch(setUser(res.data));
//         }
//       }
//     },
//     onError: (err) => showErr(err.toString()),
//     retry: 0,
//   });

//   useEffect(() => {
//     if (!getToken()) {
//       dispatch(clearUser());
//     }
//   }, [dispatch]);

//   const signin = async (formdata) => {
//     try {
//       const token = typeof formdata === 'string' ? formdata : null;
//       if (token) {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}user/get`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data.status) {
//           const userAllData = { ...response.data.data };
//           saveAuthStorage({ token, user: userAllData });
//           dispatch(setUser(userAllData));
//           navigate(userAllData.user_type === 'client' ? '/client/dashboard' : '/dashboard');
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         const res = await axios.post('/auth/login', formdata);
//         if (res.data.status) {
//           const userAllData = { ...res.data.data.user };
//           saveAuthStorage({ token: res.data.data.token, user: userAllData });
//           dispatch(setUser(userAllData));
//           navigate(userAllData.user_type === 'client' ? '/client/dashboard' : '/dashboard');
//         } else {
//           toast.error(res.data.message);
//         }
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong, try later!');
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, signin, signout, isLoading }}>
//       {isLoading ? <Loader /> : children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };
