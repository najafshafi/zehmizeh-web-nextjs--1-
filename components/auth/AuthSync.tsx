"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  setCookie,
  getCookie,
  syncAuthWithCookies,
} from "@/helpers/utils/cookieHelper";
import { useAuth } from "@/helpers/contexts/auth-context";
import { apiClient } from "@/helpers/http";

// Extended session type to include apiToken
interface ExtendedSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    user_type?: string;
    first_name?: string;
    last_name?: string;
  };
  expires: string;
  apiToken?: string;
}

// This component handles the synchronization between NextAuth sessions
// and the legacy localStorage-based authentication system
export function AuthSync() {
  const { data: session } = useSession();
  const { user: contextUser, setUser } = useAuth();

  // Effect to sync authentication state between systems
  useEffect(() => {
    // First synchronize cookies with localStorage
    syncAuthWithCookies();

    // If we have a NextAuth session but no context user, fetch the user data
    if (session?.user && !contextUser) {
      const token = getCookie("token");
      if (token) {
        apiClient
          .get("/user/get", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data?.status && response.data?.data) {
              setUser(response.data.data);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    }

    // If we have a NextAuth token, make sure it's in both cookie and localStorage
    if (session?.user && session?.apiToken) {
      setCookie("token", session.apiToken);
      localStorage.setItem("token", session.apiToken);
    }
  }, [session, contextUser, setUser]);

  // This component doesn't render anything
  return null;
}

export default AuthSync;
