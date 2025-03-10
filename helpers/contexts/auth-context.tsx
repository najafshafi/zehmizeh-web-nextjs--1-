// auth-context.tsx
"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Replace react-router-dom with Next.js router
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

// Define your API base URL (same as in your original code)
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:3000/api";

// Create an axios instance for client-side requests
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface AuthContextType {
  user: (IFreelancerDetails & IClientDetails) | null;
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

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // const { boot, shutdown } = useIntercom();
  const router = useRouter(); // Use Next.js router

  const signout = useCallback(() => {
    logoutApi();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/"); // Navigate to home page
  }, [router]);

  // Fetch user profile if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const res = await getUser();
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
              await editUser({ timezone: currentTimezone });
            }
            setUser(res.data);
          }
        }
      } catch (err) {
        showErr(err + "");
      } finally {
        setIsBootstrapping(false);
      }
    };

    fetchUserProfile();
  }, [signout]);

  const getUserSkills = () => {
    if (!user || user.user_type !== "freelancer" || !Array.isArray(user.skills))
      return [];
    let categories = user?.skills.filter((skl) => skl.category_name);
    categories = categories.map((cat) =>
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

    const ACCOUNTSTATUS = {
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
      account_status: ACCOUNTSTATUS[user.is_account_approved] ?? "Under Review",
      last_modified: moment(user.lat).format("MMM DD, YYYY"),
      country: user.location.country_name,
    };

    if (
      typeof window !== "undefined" &&
      window.location.host.includes("beta")
    ) {
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
    } else {
      customAttributes.jobs_completed = user.done_jobs ?? 0;
    }

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
    setIsLoading(true);
    try {
      let response;
      if (typeof formdata === "string") {
        const headers = { Authorization: `Bearer ${formdata}` };
        response = await axios.get(`${BASE_URL}/user/get`, { headers });
      } else {
        response = await client.post("/auth/login", formdata);
      }

      if (response.data.status) {
        const userAllData = {
          ...response.data?.data?.user,
          user_type: response.data?.data?.user_type,
          user_id:
            response.data?.data?.user?.id || response.data?.data?.user_id,
        };

        const currentTimezone = moment.tz.guess();
        if (
          response?.data?.data?.user &&
          "timezone" in response.data.data.user &&
          currentTimezone !== response?.data?.data?.user?.timezone
        ) {
          await editUser({ timezone: currentTimezone });
        }

        setUser(userAllData);
        saveAuthStorage({
          token: response.data?.data?.token || formdata,
          user: userAllData,
        });

        if (response.data?.data?.user_type === "client") {
          router.push("/client/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        if (response?.data?.errorCode === 101) {
          setUser({ email_id: response?.data?.emailId });
          router.push("/2fa");
          toast.error(response.data.response);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong, try later!"
      );
    } finally {
      setIsLoading(false);
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
      toast.error(
        error.response?.data?.message || "Something went wrong, try later!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const twoFactor = (formdata: any, cb?: any) => {
    setIsLoading(true);
    if (user?.email_id) {
      formdata.email_id = user.email_id;
      client
        .post("/auth/otp", formdata)
        .then((res) => {
          if (res.data.status) {
            toast.success(res.data.message);
            if (formdata.action === "verify_otp") {
              if (formdata.type === "new_registration") {
                localStorage.setItem("token", res.data?.data?.token);
                apiClient.defaults.headers.common["Authorization"] =
                  "Bearer " + res.data?.data?.token;
              }
              cb?.();
            }
            cb?.();
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response?.data?.message || "Something went wrong, try later!"
          );
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      toast.error("Please try to login.");
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      signin,
      signout,
      isLoading,
      twoFactor,
      submitRegisterUser,
      setEmail: (email: string) =>
        setUser((prev) => ({ ...prev, email_id: email })),
    }),
    [isLoading, signout, user]
  );

  if (isBootstrapping) {
    return <Loader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
