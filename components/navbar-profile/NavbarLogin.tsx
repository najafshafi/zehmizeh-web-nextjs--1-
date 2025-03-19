// components/navbar-profile/NavbarLogin.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import NavbarProfile from "./NavbarProfile";
import Navbar from "../navbar/Navbar";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/store/redux/slices/authSlice";

const NavbarLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);
  const { user: contextUser, signout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [forceRender, setForceRender] = useState(false);
  const hasLoggedOut = useRef(false);

  // Combined auth check from both sources
  const isAuthenticated = Boolean(reduxUser || contextUser);

  // Global logout that clears both auth sources
  const handleGlobalLogout = useCallback(async () => {
    if (hasLoggedOut.current) return; // Prevent duplicate logout calls
    hasLoggedOut.current = true;

    try {
      // Clear Redux state first (synchronous)
      dispatch(clearAuth());
      
      // Then clear context auth (async)
      signout();
      
      // Clear any auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Force immediate re-render of NavbarLogin to show logout state
      setForceRender(prev => !prev);
      
      // Add a small delay to ensure auth state is cleared before navigation
      setTimeout(() => {
        // Force navigation to home page (using replace to prevent back navigation to profile)
        router.replace('/home');
      }, 50);
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure navigation happens even if there's an error
      router.replace('/home');
    } finally {
      // Reset the logout flag after a delay
      setTimeout(() => {
        hasLoggedOut.current = false;
      }, 500);
    }
  }, [dispatch, signout, router]);

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
  }, [reduxUser, contextUser, forceRender]);

  // Show nothing during initial load to prevent flashing
  if (isLoading) {
    return null;
  }

  // Show the appropriate navbar based on auth state
  return isAuthenticated ? <NavbarProfile /> : <Navbar />;
};

export default NavbarLogin;
