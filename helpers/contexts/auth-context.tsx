"use client";
import React, { useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Next.js navigation hooks
import { apiClient } from "@/helpers/http";
import Loader from "@/components/Loader";
import { getToken, saveAuthStorage } from "@/helpers/services/auth";
import { getUser, editUser, logoutApi } from "@/helpers/http/auth";
import { capitalizeFirstLetter, showErr } from "@/helpers/utils/misc";
import moment from "moment-timezone";
import { useIntercom } from "react-use-intercom";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { IClientDetails } from "@/helpers/types/client.type";
import {
  isStagingEnv,
  stripeIntercomStatusHandler,
} from "@/helpers/utils/helper";
import { getCookie } from "@/helpers/utils/cookieHelper";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

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
  submitRegisterUser: (
    payload: Partial<IFreelancerDetails & { utm_info: Record<string, string> }>
  ) => void;
  preferred_banking_country?: string;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBoostraping, setIsBootstraping] = React.useState(true);

  const { boot, shutdown } = useIntercom();

  const router = useRouter(); // Replace useNavigate with useRouter
  const pathname = usePathname(); // Replace useLocation for current path
  const searchParams = useSearchParams(); // Replace useLocation for query params

  const signout = useCallback(() => {
    logoutApi();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiration");
    setUser(null);
    router.push("/"); // Use router.push instead of navigate
  }, [router]);

  // Check if we're on a freelancer profile page that allows public viewing
  // Using a more permissive pattern to match freelancer profiles
  const isFreelancerProfileRoute = pathname
    ? pathname.includes("/freelancer/")
    : false;

  // Check if we should enable the user profile API call
  // Only enable if:
  // 1. Token exists AND
  // 2. Either:
  //    a. We're not on a freelancer profile page, OR
  //    b. We are on a freelancer profile page but we have a token
  const shouldFetchUserProfile = !!getToken();

  useQuery(["userProfile"], getUser, {
    enabled: shouldFetchUserProfile,
    onSuccess: (res) => {
      if (res?.data) {
        if (res?.data?.is_deleted) {
          showErr("Your account has been deleted by the admin.");
          signout();
        } else {
          const currentTimezone = moment.tz.guess();
          if (
            res?.data &&
            "timezone" in res.data &&
            currentTimezone !== res?.data?.timezone
          ) {
            editUser({ timezone: currentTimezone });
          }
          setUser(res.data);
        }
      }
    },
    onSettled: () => setIsBootstraping(false),
    onError: (err) => {
      // Don't show errors on public freelancer profile pages
      if (!isFreelancerProfileRoute) {
        showErr(err + "");
      }
      setIsBootstraping(false);
    },
    retry: 0,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) setIsBootstraping(false);
  }, []);

  // Debug logging for auth context
  // useEffect(() => {
  //   if (pathname) {
  //     console.log("Auth context pathname:", pathname);
  //     console.log(
  //       "Auth context isFreelancerProfileRoute:",
  //       isFreelancerProfileRoute
  //     );
  //   }
  // }, [pathname, isFreelancerProfileRoute]);

  const getUserSkills = () => {
    if (!user || user.user_type !== "freelancer" || !Array.isArray(user.skills))
      return [];
    let categories = user?.skills.filter((skl: any) => skl.category_name);
    categories = categories.map((cat: any) =>
      capitalizeFirstLetter(cat.category_name)
    );
    return categories;
  };

  const intercomHandler = () => {
    if (isStagingEnv()) return null;

    shutdown();
    if (user === null) return boot();

    const intercomFlag = ["first_name", "last_name", "u_email_id"].map(
      (el) => el in user
    );
    if (intercomFlag.includes(false)) return boot();

    const ACCOUNTSTATUS: Record<number, string> = {
      0: "Rejected",
      1: "Approved",
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
      account_status:
        ACCOUNTSTATUS[user.is_account_approved as 0 | 1] ?? "Under Review",
      last_modified: moment(user.lat).format("MMM DD, YYYY"),
      country: user.location.country_name,
    };

    if (window.location.host.includes("beta")) {
      customAttributes.platform = "Beta";
    } else {
      customAttributes.platform = "Live";
    }

    if (user.user_type === "freelancer") {
      customAttributes.headline = user.job_title ?? "";
      customAttributes.stripe_status = stripeIntercomStatusHandler(
        user.stp_account_id,
        user.stp_account_status
      );
      customAttributes.categories = getUserSkills().join(",");
    } else customAttributes.jobs_completed = user.done_jobs ?? 0;

    boot({
      name: `${user.first_name} ${user.last_name}`,
      email: user.u_email_id,
      customAttributes,
    });
  };

  useEffect(() => {
    intercomHandler();
  }, [user]);

  const signin = async (formdata: any) => {
    if (typeof formdata === "string") {
      setIsLoading(true);
      const headers: any = {
        Authorization: `Bearer ${formdata}`,
      };
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}user/get`,
        { headers }
      );
      if (response.data.status) {
        const userAllData = {
          ...response.data?.data,
          user_type: response.data?.data?.user_type,
          user_id: response.data?.data?.user_id,
        };

        const currentTimezone = moment.tz.guess();
        if (
          response?.data?.data &&
          "timezone" in response.data.data &&
          currentTimezone !== response?.data?.data?.timezone
        ) {
          editUser({ timezone: currentTimezone });
        }
        setUser(userAllData);
        saveAuthStorage({
          token: formdata,
          user: userAllData,
        });

        const fromPath = searchParams?.get("from")
          ? `${pathname}${searchParams.toString()}`
          : null;
        if (fromPath) {
          router.push(fromPath); // Use router.push
        } else if (response.data?.data?.user_type === "client") {
          router.push("/client/dashboard");
        } else {
          router.push("/dashboard");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (response?.data?.errorCode === 101) {
          setUser({ email_id: response?.data?.emailId });
          router.push("/2fa");
          toast.error(response.data.response);
        } else {
          toast.error(response.data.message);
        }
      }
    } else {
      setIsLoading(true);
      client
        .post("/auth/login", formdata)
        .then((res) => {
          setIsLoading(false);
          if (res.data.status) {
            const userAllData = {
              ...res.data?.data?.user,
              user_type: res.data?.data?.user_type,
              user_id: res.data?.data?.user?.id,
            };

            // Store token and user
            const token = res.data?.data?.token;
            setUser(userAllData);
            saveAuthStorage({
              token,
              user: userAllData,
            });

            // Store refresh token if available
            if (res.data?.data?.refresh_token) {
              localStorage.setItem(
                "refresh_token",
                res.data?.data?.refresh_token
              );
            }

            // Store token expiration if available
            if (res.data?.data?.expires_in) {
              const expirationTime =
                Date.now() + res.data?.data?.expires_in * 1000;
              localStorage.setItem(
                "token_expiration",
                expirationTime.toString()
              );
            }

            apiClient.defaults.headers.common["Authorization"] =
              "Bearer " + token;

            const currentTimezone = moment.tz.guess();
            if (
              res?.data?.data?.user &&
              "timezone" in res.data.data.user &&
              currentTimezone !== res?.data?.data?.user?.timezone
            ) {
              editUser({ timezone: currentTimezone });
            }

            const fromPath = searchParams?.get("from");
            if (fromPath) {
              router.push(fromPath);
            } else if (res.data?.data?.user_type === "client") {
              router.push("/client/dashboard");
            } else {
              router.push("/dashboard");
            }
          } else {
            setIsLoading(false);
            if (res?.data?.errorCode === 101) {
              setUser({ email_id: res?.data?.emailId });
              router.push("/2fa");
              toast.error(res.data.response);
            } else {
              toast.error(res.data.message);
            }
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          toast.error(
            (err as any).response?.data?.message ||
              "Something went wrong, try later!"
          );
        });
    }
  };

  const submitRegisterUser: AuthContextType["submitRegisterUser"] = async (
    payload
  ) => {
    const utm_info = getCookie("utm_info");
    if (utm_info) payload.utm_info = JSON.parse(utm_info);

    setIsLoading(true);
    try {
      const res = await client.post("/auth/register", payload);
      setIsLoading(false);
      if (res.data.status) {
        setUser(payload);
        apiClient.defaults.headers.common["Authorization"] =
          "Bearer " + res.data?.data?.token;
        router.push("/2fa");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration:", error);
      setIsLoading(false);
      toast.error(
        (error as any).response?.data?.message ||
          "Something went wrong, try later!"
      );
    }
  };

  const twoFactor = (formdata: any, cb?: any) => {
    setIsLoading(true);
    if (user.email_id !== "") {
      formdata.email_id = user.email_id;
      client
        .post("/auth/otp", formdata)
        .then((res) => {
          setIsLoading(false);
          if (res.data.status) {
            toast.success(res.data.message);
            if (formdata.action === "verify_otp") {
              if (formdata.type === "new_registration") {
                localStorage.setItem("token", res.data?.data?.token);
                apiClient.defaults.headers.common["Authorization"] =
                  "Bearer " + res.data?.data?.token;
              }
              cb();
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
          toast.error(
            (err as any).response?.data?.message ||
              "Something went wrong, try later!"
          );
        });
    } else {
      setIsLoading(false);
      toast.error("Please try to login.");
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
      setEmail: (email: string) =>
        setUser((prev: any) => ({ ...prev, email_id: email })),
    }),
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
