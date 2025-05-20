import { useSession, signIn, signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/helpers/http/index";
import toast from "react-hot-toast";
import { getToken } from "@/helpers/services/auth";

interface LoginPayload {
  email_id: string;
  password: string;
  stay_signedin?: boolean;
  terms_agreement?: boolean;
}

// Query key factory
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useAuth() {
  const { data: session, status } = useSession();

  const login = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      try {
        // Use NextAuth signIn method with credentials
        const result = await signIn("credentials", {
          email: credentials.email_id,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        return result;
      } catch (error: any) {
        toast.error(error.message || "Login failed");
        throw error;
      }
    },
  });

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const register = useMutation({
    mutationFn: async (userData: any) => {
      try {
        // Keep using your existing registration API
        const response = await apiClient.post("/auth/register", userData);

        if (response.data.status) {
          // After registration, we can automatically sign in the user
          // or redirect to 2FA if needed
          if (response.data.data.token) {
            // Direct login after registration if token is available
            await signIn("credentials", {
              email: userData.email_id,
              password: userData.password,
              redirect: false,
            });
          }
          return response.data.data;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Registration failed");
        throw error;
      }
    },
  });

  const twoFactor = useMutation({
    mutationFn: async ({
      formdata,
      email,
    }: {
      formdata: any;
      email: string;
    }) => {
      try {
        formdata.email_id = email;
        const response = await apiClient.post("/auth/otp", formdata);

        if (response.data.status) {
          toast.success(response.data.message);
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        toast.error(error.message || "Two-factor authentication failed");
        throw error;
      }
    },
  });

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    login,
    logout,
    register,
    twoFactor,
  };
}

export const useUser = () => {
  const token = getToken();

  return useMutation({
    mutationFn: async () => {
      if (!token) return null;

      const response = await apiClient.get("/user/get");
      if (!response.data || !response.data.id) {
        throw new Error("Invalid user data received");
      }
      return response.data;
    },
  });
};
