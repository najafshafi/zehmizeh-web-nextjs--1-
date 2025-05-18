// components/navbar-profile/NavbarLogin.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import NavbarProfile from "./NavbarProfile";
import Navbar from "../navbar/Navbar";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { clearAuth } from "@/store/redux/slices/authSlice";

const NavbarLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  // const pathname = usePathname();
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);

  // Get auth context and handle the case where it might be null initially
  const authContext = useAuth();
  const contextUser = authContext?.user;
  const signout = authContext?.signout || (() => {});

  const [isLoading, setIsLoading] = useState(true);
  const [forceRender, setForceRender] = useState(false);
  const hasLoggedOut = useRef(false);

  // Check if current path is a freelancer profile page
  // const isFreelancerProfileRoute = pathname
  //   ? pathname.includes('/freelancer/')
  //   : false;

  // // Log the pathname and route matching for debugging
  // useEffect(() => {
  //   if (pathname) {
  //     console.log("NavbarLogin pathname:", pathname);
  //     console.log("NavbarLogin isFreelancerProfileRoute:", isFreelancerProfileRoute);
  //   }
  // }, [pathname, isFreelancerProfileRoute]);

  // Combined auth check from both sources
  const isAuthenticated = Boolean(reduxUser || contextUser || session);

  // Global logout that clears all auth sources
  const handleGlobalLogout = useCallback(async () => {
    if (hasLoggedOut.current) return; // Prevent duplicate logout calls
    hasLoggedOut.current = true;

    try {
      // Clear Redux state first (synchronous)
      dispatch(clearAuth());

      // Log which auth systems we're clearing
      console.log("Logging out from multiple auth systems");
      console.log("Context user:", !!contextUser);
      console.log("Redux user:", !!reduxUser);
      console.log("NextAuth session:", !!session);

      // Clear NextAuth session
      await signOut({ redirect: false });

      // Then clear context auth
      signout();

      // Clear any auth data from localStorage and cookies
      if (typeof window !== "undefined") {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiration");

        // Clear cookies
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // Force immediate re-render of NavbarLogin to show logout state
      setForceRender((prev) => !prev);

      // Add a small delay to ensure auth state is cleared before navigation
      setTimeout(() => {
        // Force navigation to home page (using replace to prevent back navigation to profile)
        router.replace("/home");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure navigation happens even if there's an error
      router.replace("/home");
    } finally {
      // Reset the logout flag after a delay
      setTimeout(() => {
        hasLoggedOut.current = false;
      }, 500);
    }
  }, [dispatch, signout, router, contextUser, reduxUser, session]);

  // Expose the logout function globally for NavbarProfile to use
  useEffect(() => {
    // @ts-expect-error - Adding to window for global access
    window.handleGlobalLogout = handleGlobalLogout;

    return () => {
      // @ts-expect-error - Cleanup on unmount
      delete window.handleGlobalLogout;
    };
  }, [handleGlobalLogout]);

  useEffect(() => {
    // Brief delay to let auth state stabilize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Reduced from 200ms for faster response

    return () => clearTimeout(timer);
  }, [reduxUser, contextUser, session, forceRender]);

  // Show nothing during initial load to prevent flashing
  if (isLoading) {
    return null;
  }

  // Show the appropriate navbar based on auth state
  return isAuthenticated ? <NavbarProfile /> : <Navbar />;
};

export default NavbarLogin;
